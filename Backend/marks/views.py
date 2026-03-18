# marks/views.py
import json
import os
import logging

from django.conf import settings
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import StudyPlan, MidSemMarksEntry
from .serializers import (
    AnalyzeMarksInputSerializer,
    GenerateStudyPlanInputSerializer,
    MidSemMarksEntrySerializer,
    StudyPlanSerializer,
    TaskProgressUpdateSerializer,
)
from .ml_planner import generate_local_study_plan, local_model_available

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------

WEAK_THRESHOLD = 60.0   # below this → weak subject
GOOD_THRESHOLD = 75.0   # at or above this → strong subject
MIDSEM_MAX_MARKS = 20.0


def _first_error_message(error_obj):
    """Extract a readable first error message from DRF serializer errors."""
    if isinstance(error_obj, list):
        if not error_obj:
            return "Invalid request data."
        return _first_error_message(error_obj[0])
    if isinstance(error_obj, dict):
        if not error_obj:
            return "Invalid request data."
        first_key = next(iter(error_obj))
        child = error_obj[first_key]
        message = _first_error_message(child)
        if first_key == "non_field_errors":
            return message
        return f"{first_key}: {message}"
    return str(error_obj)


def _analyze_marks(marks: dict, target_final: float) -> dict:
    """
    Pure-function analysis: no DB, no I/O.
    Returns a dict with weak_subjects, strong_subjects, avg_score,
    improvement_needed, and per-subject breakdowns.
    """
    total = sum(marks.values())
    count = len(marks)
    avg_raw = round(total / count, 2)
    avg = round((avg_raw / MIDSEM_MAX_MARKS) * 100, 2)

    weak = []
    strong = []
    moderate = []
    subject_details = []

    for subject, score in marks.items():
        percentage = round((score / MIDSEM_MAX_MARKS) * 100, 2)
        gap = round(max(0.0, target_final - percentage), 2)
        needed_pct = round((gap / (100 - percentage)) * 100, 1) if percentage < 100 else 0.0
        entry = {
            "subject": subject,
            "raw_score": round(score, 2),
            "max_marks": MIDSEM_MAX_MARKS,
            "percentage": percentage,
            "score": percentage,
            "gap_to_target": gap,
            "improvement_needed_pct": needed_pct,
            "status": (
                "weak" if percentage < WEAK_THRESHOLD
                else "moderate" if percentage < GOOD_THRESHOLD
                else "strong"
            ),
        }
        subject_details.append(entry)
        if percentage < WEAK_THRESHOLD:
            weak.append(subject)
        elif percentage >= GOOD_THRESHOLD:
            strong.append(subject)
        else:
            moderate.append(subject)

    # Prioritise weak subjects by smallest percentage first
    weak_sorted = sorted(weak, key=lambda s: marks[s])

    return {
        "avg_score": avg,
        "avg_raw_score": avg_raw,
        "midsem_max_marks": MIDSEM_MAX_MARKS,
        "weak_subjects": weak_sorted,
        "moderate_subjects": moderate,
        "strong_subjects": strong,
        "subject_details": sorted(subject_details, key=lambda x: x["percentage"]),
        "improvement_needed_pct": round(max(0.0, target_final - avg), 2),
        "target_final": target_final,
    }


def _call_gemini(marks: dict, analysis: dict, target_final: float, weeks_count: int = 6) -> dict:
    """
    Generates a JSON study plan for requested duration.
    Order of preference:
    1. Local trained ML model
    2. Gemini API
    3. Static fallback template
    """
    if local_model_available():
        try:
            return generate_local_study_plan(marks=marks, target_final=target_final)
        except Exception as exc:
            logger.error("Local study plan model error: %s", exc)

    api_key = os.getenv("GEMINI_API_KEY", "")
    if not api_key:
        logger.warning("GEMINI_API_KEY not set – returning static fallback plan.")
        return _static_fallback_plan(analysis, weeks_count=weeks_count)

    try:
        import google.generativeai as genai  # type: ignore
    except ImportError:
        logger.warning("google-generativeai not installed – returning static fallback plan.")
        return _static_fallback_plan(analysis, weeks_count=weeks_count)

    weak_subjects_str = ", ".join(analysis["weak_subjects"]) if analysis["weak_subjects"] else "None"
    marks_str = json.dumps(marks, indent=2)

    prompt = f"""
You are an expert academic coach. A student has the following mid-semester marks (out of 20):

{marks_str}

Weak subjects (below 60%): {weak_subjects_str}
Target final exam score: {target_final}%

Create a personalised {weeks_count}-week study plan. Rules:
- Daily study budget: 2 hours.
- Allocate 60% of daily time (72 min) to weak subjects, 40% to the rest.
- Split into 3 phases across the full duration:
    - Early phase: Foundation topics. Include 2 free Khan Academy / NPTEL resource links per subject.
    - Mid phase: Practice papers and maintaining an error log.
    - Final phase: Mock tests and full revision.

Return ONLY valid JSON in exactly this schema (no prose, no markdown fences):
{{
  "weeks": [
    {{
      "week": 1,
      "focus": "Foundation",
      "daily_tasks": [
        {{
          "day": "Monday",
          "tasks": [
            {{"subject": "Math", "activity": "Review algebra basics", "duration_min": 45}}
          ]
        }}
      ],
      "resources": [
        {{"subject": "Math", "title": "Khan Academy – Algebra", "url": "https://www.khanacademy.org/math/algebra"}}
      ]
    }}
  ]
}}
Include all {weeks_count} weeks. Each week must have all 7 days.
"""

    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)
        raw = response.text.strip()

        # Strip potential markdown code fences that the model sometimes adds
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        raw = raw.strip()

        plan = json.loads(raw)
        if "weeks" not in plan or not isinstance(plan["weeks"], list):
            raise ValueError("Unexpected Gemini response structure.")
        return plan

    except json.JSONDecodeError as exc:
        logger.error("Gemini returned non-JSON: %s", exc)
        return _static_fallback_plan(analysis, weeks_count=weeks_count)
    except Exception as exc:
        logger.error("Gemini API error: %s", exc)
        return _static_fallback_plan(analysis, weeks_count=weeks_count)


def _static_fallback_plan(analysis: dict, weeks_count: int = 6) -> dict:
    """Returns a generic plan when Gemini is unavailable."""
    weak = analysis.get("weak_subjects", [])
    if not weak:
        weak = list(analysis.get("subject_details", [{"subject": "All Subjects"}])[0:2])
        weak = [s["subject"] if isinstance(s, dict) else s for s in weak]

    first_phase_end = max(1, weeks_count // 3)
    second_phase_end = max(first_phase_end + 1, (2 * weeks_count) // 3)

    weeks = []
    days_of_week = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    for w in range(1, weeks_count + 1):
        if w <= first_phase_end:
            focus = "Foundation building"
        elif w <= second_phase_end:
            focus = "Practice papers & error log"
        else:
            focus = "Mock tests & revision"
        daily_tasks = []
        for day in days_of_week:
            tasks = []
            for subj in weak:
                tasks.append({"subject": subj, "activity": f"[{focus}] Review & practice problems", "duration_min": 40})
            daily_tasks.append({"day": day, "tasks": tasks})

        resources = []
        for subj in weak:
            resources.append({
                "subject": subj,
                "title": f"Khan Academy – {subj}",
                "url": f"https://www.khanacademy.org/search?page_search_query={subj.replace(' ', '+')}",
            })
        weeks.append({"week": w, "focus": focus, "daily_tasks": daily_tasks, "resources": resources})

    return {
        "weeks": weeks,
        "weeks_count": weeks_count,
        "note": "AI plan unavailable – using generic template. Set GEMINI_API_KEY to enable personalised plans.",
    }


# ---------------------------------------------------------------------------
# Views
# ---------------------------------------------------------------------------

class AnalyzeMidSemMarksView(APIView):
    """
    POST /api/marks/analyze/

    Body:
      {
        "marks": {"Math": 9, "Physics": 14.5},
        "semester": "Sem 4",
        "target_final": 80
      }

    Returns analysis JSON and saves a draft StudyPlan record.
    JWT-authenticated: students can only analyse their own marks.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = AnalyzeMarksInputSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {
                    "error": _first_error_message(serializer.errors),
                    "details": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        data = serializer.validated_data
        marks = data["marks"]
        semester = data["semester"]
        target_final = data["target_final"]

        analysis = _analyze_marks(marks, target_final)

        # Create or update the study plan record (without the AI plan yet)
        plan, created = StudyPlan.objects.update_or_create(
            student=request.user,
            semester=semester,
            defaults={
                "midsem_marks": marks,
                "analysis": analysis,
                "target_final": target_final,
                "study_plan": None,      # will be filled when generate-study-plan is called
                "task_progress": {},
                "status": "active",
            },
        )

        return Response({
            "study_plan_id": plan.id,
            "analysis": analysis,
            "created": created,
        }, status=status.HTTP_200_OK)


class GenerateStudyPlanView(APIView):
    """
    POST /api/marks/generate-study-plan/

    Body (option A – use existing plan record):
      {"study_plan_id": 7}

    Body (option B – provide marks inline):
      {"marks": {...}, "semester": "Sem 4", "target_final": 80}

    Calls Gemini API, stores result, returns full StudyPlan JSON.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = GenerateStudyPlanInputSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {
                    "error": _first_error_message(serializer.errors),
                    "details": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        data = serializer.validated_data
        plan_id = data.get("study_plan_id")
        weeks_count = data.get("weeks_count", 6)

        if plan_id:
            plan = get_object_or_404(StudyPlan, id=plan_id, student=request.user)
            marks = plan.midsem_marks
            target_final = plan.target_final
            analysis = plan.analysis or _analyze_marks(marks, target_final)
        else:
            marks = data.get("marks")
            semester = data.get("semester", "")
            target_final = data.get("target_final", 80.0)

            if not marks or not semester:
                return Response(
                    {"error": "Provide either study_plan_id or both marks and semester."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            analysis = _analyze_marks(marks, target_final)
            plan, _ = StudyPlan.objects.update_or_create(
                student=request.user,
                semester=semester,
                defaults={
                    "midsem_marks": marks,
                    "analysis": analysis,
                    "target_final": target_final,
                    "task_progress": {},
                    "status": "active",
                },
            )

        ai_plan = _call_gemini(
            marks,
            analysis,
            plan.target_final if plan_id else target_final,
            weeks_count=weeks_count,
        )
        if isinstance(ai_plan, dict):
            ai_plan["weeks_count"] = len(ai_plan.get("weeks", [])) if isinstance(ai_plan.get("weeks"), list) else weeks_count
        plan.study_plan = ai_plan
        plan.analysis = analysis
        plan.save(update_fields=["study_plan", "analysis", "updated_at"])

        return Response(StudyPlanSerializer(plan).data, status=status.HTTP_200_OK)


class MyStudyPlansView(APIView):
    """
    GET /api/marks/my-plans/
    Returns all study plans belonging to the authenticated student (newest first).
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        plans = StudyPlan.objects.filter(student=request.user).order_by('-created_at')
        serializer = StudyPlanSerializer(plans, many=True)
        return Response(serializer.data)


class StudyPlanDetailView(APIView):
    """
    GET  /api/marks/plan/<id>/   – retrieve a specific plan
    DELETE /api/marks/plan/<id>/  – delete a plan (owner only)
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        plan = get_object_or_404(StudyPlan, id=pk, student=request.user)
        return Response(StudyPlanSerializer(plan).data)

    def delete(self, request, pk):
        plan = get_object_or_404(StudyPlan, id=pk, student=request.user)
        plan.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class UpdateTaskProgressView(APIView):
    """
    PATCH /api/marks/plan/<id>/progress/
    Body: {"task_key": "w1_d2_t0", "completed": true}
    Persists per-task completion state.
    """
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        plan = get_object_or_404(StudyPlan, id=pk, student=request.user)
        serializer = TaskProgressUpdateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        task_key = serializer.validated_data["task_key"]
        completed = serializer.validated_data["completed"]

        progress = dict(plan.task_progress or {})
        progress[task_key] = completed
        plan.task_progress = progress

        # Auto-mark plan as completed when all tasks are done
        if plan.study_plan and all(progress.values()):
            plan.status = "completed"

        plan.save(update_fields=["task_progress", "status", "updated_at"])
        return Response({"task_key": task_key, "completed": completed, "status": plan.status})


class FacultyEnterMarksView(APIView):
    """
    POST /api/marks/faculty/enter/
    Faculty enters marks for a specific student + subject.

    Body:
      {
        "student_id": 5,
        "subject": "Math",
                "marks": 13,
                "max_marks": 20,
        "semester": "Sem 4"
      }
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.role not in ("faculty", "admin"):
            return Response({"error": "Only faculty or admin can enter marks."}, status=status.HTTP_403_FORBIDDEN)

        User = get_user_model()

        student_id = request.data.get("student_id")
        subject = request.data.get("subject", "").strip()
        marks_val = request.data.get("marks")
        max_marks = request.data.get("max_marks", MIDSEM_MAX_MARKS)
        semester = request.data.get("semester", "").strip()

        if not all([student_id, subject, marks_val is not None, semester]):
            return Response({"error": "student_id, subject, marks, and semester are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            student = User.objects.get(id=student_id, role="student")
        except User.DoesNotExist:
            return Response({"error": "Student not found."}, status=status.HTTP_404_NOT_FOUND)

        try:
            marks_float = float(marks_val)
            max_float = float(max_marks)
        except (ValueError, TypeError):
            return Response({"error": "marks and max_marks must be numeric."}, status=status.HTTP_400_BAD_REQUEST)

        if max_float != MIDSEM_MAX_MARKS:
            return Response(
                {"error": f"mid-sem marks must be entered out of {int(MIDSEM_MAX_MARKS)}."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if marks_float < 0 or marks_float > max_float:
            return Response(
                {"error": f"marks must be between 0 and {max_float}."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        entry, created = MidSemMarksEntry.objects.update_or_create(
            student=student,
            subject=subject,
            semester=semester,
            defaults={
                "marks": marks_float,
                "max_marks": max_float,
                "entered_by": request.user,
            },
        )

        return Response(MidSemMarksEntrySerializer(entry).data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)


class FacultyStudentsView(APIView):
    """
    GET /api/marks/faculty/students/
    Returns a lightweight list of students for faculty/admin marks entry.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role not in ("faculty", "admin"):
            return Response({"error": "Only faculty or admin can access student list."}, status=status.HTTP_403_FORBIDDEN)

        User = get_user_model()
        students = User.objects.filter(role="student").order_by("first_name", "last_name", "email")
        data = [
            {
                "id": student.id,
                "email": student.email,
                "first_name": student.first_name,
                "last_name": student.last_name,
                "department": student.department,
                "display_name": f"{student.first_name} {student.last_name}".strip() or student.email,
            }
            for student in students
        ]
        return Response(data)


class FacultyBulkEnterMarksView(APIView):
    """
    POST /api/marks/faculty/bulk-enter/
    Body:
      {
        "entries": [
          {"student_id": 5, "subject": "Math", "semester": "Sem 4", "marks": 13, "max_marks": 20}
        ]
      }
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.role not in ("faculty", "admin"):
            return Response({"error": "Only faculty or admin can enter marks."}, status=status.HTTP_403_FORBIDDEN)

        entries = request.data.get("entries", [])
        if not isinstance(entries, list) or len(entries) == 0:
            return Response({"error": "entries must be a non-empty list."}, status=status.HTTP_400_BAD_REQUEST)

        User = get_user_model()
        created_count = 0
        updated_count = 0
        failed = []

        for idx, item in enumerate(entries, start=1):
            student_id = item.get("student_id")
            subject = str(item.get("subject", "")).strip()
            semester = str(item.get("semester", "")).strip()
            marks_val = item.get("marks")
            max_marks = item.get("max_marks", MIDSEM_MAX_MARKS)

            if not all([student_id, subject, semester, marks_val is not None]):
                failed.append({"row": idx, "error": "student_id, subject, semester, and marks are required."})
                continue

            try:
                student = User.objects.get(id=student_id, role="student")
            except User.DoesNotExist:
                failed.append({"row": idx, "error": "Student not found."})
                continue

            try:
                marks_float = float(marks_val)
                max_float = float(max_marks)
            except (ValueError, TypeError):
                failed.append({"row": idx, "error": "marks and max_marks must be numeric."})
                continue

            if max_float != MIDSEM_MAX_MARKS:
                failed.append({"row": idx, "error": f"max_marks must be {int(MIDSEM_MAX_MARKS)}."})
                continue

            if marks_float < 0 or marks_float > max_float:
                failed.append({"row": idx, "error": f"marks must be between 0 and {max_float}."})
                continue

            _, created = MidSemMarksEntry.objects.update_or_create(
                student=student,
                subject=subject,
                semester=semester,
                defaults={
                    "marks": marks_float,
                    "max_marks": max_float,
                    "entered_by": request.user,
                },
            )
            if created:
                created_count += 1
            else:
                updated_count += 1

        return Response(
            {
                "created": created_count,
                "updated": updated_count,
                "failed": failed,
                "total": len(entries),
            },
            status=status.HTTP_200_OK,
        )


class StudentMarksView(APIView):
    """
    GET /api/marks/my-marks/?semester=Sem+4
    Returns the authenticated student's raw marks entries as a flat list.
    Aggregated into a dict suitable for feeding into /analyze/.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        semester = request.query_params.get("semester", "")
        qs = MidSemMarksEntry.objects.filter(student=request.user)
        if semester:
            qs = qs.filter(semester=semester)

        entries = MidSemMarksEntrySerializer(qs, many=True).data
        marks_dict = {e["subject"]: e["marks"] for e in entries}

        return Response({
            "entries": entries,
            "marks_dict": marks_dict,
            "semester": semester,
        })
