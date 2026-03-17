from pathlib import Path

from django.conf import settings


def generate_local_study_plan(marks: dict, target_final: float):
    from AI.study_plan_ml.planner import generate_plan_from_model

    model_path = Path(settings.STUDY_PLAN_MODEL_PATH)
    return generate_plan_from_model(marks=marks, target_final=target_final, model_path=model_path)


def local_model_available() -> bool:
    return settings.USE_LOCAL_STUDY_PLAN_MODEL and Path(settings.STUDY_PLAN_MODEL_PATH).exists()
