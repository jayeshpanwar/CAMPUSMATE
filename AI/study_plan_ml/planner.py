import math
from pathlib import Path

import joblib

from .config import DAYS, DEFAULT_MODEL_PATH, DAILY_STUDY_MINUTES, MIDSEM_MAX_MARKS, PHASES, WEEK_COUNT
from .resources import get_resources


def _subject_features(subject: str, raw_score: float, target_final: float):
    percentage = round((raw_score / MIDSEM_MAX_MARKS) * 100, 2)
    gap = round(max(0.0, target_final - percentage), 2)
    return {
        'subject': subject,
        'raw_score': raw_score,
        'percentage': percentage,
        'target_final': target_final,
        'gap_to_target': gap,
        'is_weak': int(percentage < 60),
        'is_moderate': int(60 <= percentage < 75),
    }


def _phase_activity(phase: str, subject: str):
    if phase == 'Foundation':
        return f'Review fundamentals and rebuild weak concepts in {subject}'
    if phase == 'Practice':
        return f'Solve practice papers and maintain an error log for {subject}'
    if phase == 'Mock Test':
        return f'Attempt timed mock questions for {subject} and analyse mistakes'
    return f'Revise summary notes, formulas, and previous mistakes for {subject}'


def load_artifact(model_path: Path = DEFAULT_MODEL_PATH):
    if not model_path.exists():
        raise FileNotFoundError(f'Model artifact not found: {model_path}')
    return joblib.load(model_path)


def generate_plan_from_model(marks: dict, target_final: float, model_path: Path = DEFAULT_MODEL_PATH):
    artifact = load_artifact(model_path)
    pipeline = artifact['pipeline']

    features = [_subject_features(subject, raw_score, target_final) for subject, raw_score in marks.items()]
    predictions = pipeline.predict(features)

    scored_subjects = []
    for feature_row, predicted_minutes in zip(features, predictions):
        bounded_minutes = int(max(10, min(60, round(float(predicted_minutes)))))
        scored_subjects.append({**feature_row, 'predicted_daily_minutes': bounded_minutes})

    scored_subjects.sort(key=lambda row: (row['is_weak'], row['gap_to_target'], row['predicted_daily_minutes']), reverse=True)

    subject_total = sum(row['predicted_daily_minutes'] for row in scored_subjects) or 1
    weeks = []
    for week in range(1, WEEK_COUNT + 1):
        phase = PHASES[week]
        daily_tasks = []
        for day in DAYS:
            tasks = []
            remaining_minutes = DAILY_STUDY_MINUTES
            for subject_row in scored_subjects:
                planned_minutes = max(10, round((subject_row['predicted_daily_minutes'] / subject_total) * DAILY_STUDY_MINUTES))
                planned_minutes = min(planned_minutes, remaining_minutes)
                tasks.append({
                    'subject': subject_row['subject'],
                    'activity': _phase_activity(phase, subject_row['subject']),
                    'duration_min': planned_minutes,
                })
                remaining_minutes -= planned_minutes
                if remaining_minutes <= 0:
                    break
            if remaining_minutes > 0 and tasks:
                tasks[-1]['duration_min'] += remaining_minutes
            daily_tasks.append({'day': day, 'tasks': tasks})

        resources = []
        for subject_row in scored_subjects[:4]:
            for title, url in get_resources(subject_row['subject']):
                resources.append({'subject': subject_row['subject'], 'title': title, 'url': url})

        weeks.append({'week': week, 'focus': phase, 'daily_tasks': daily_tasks, 'resources': resources})

    return {
        'weeks': weeks,
        'generator': 'local-ml-model',
        'model_metrics': artifact.get('metrics', {}),
        'predicted_subject_allocations': [
            {
                'subject': row['subject'],
                'raw_score': row['raw_score'],
                'percentage': row['percentage'],
                'predicted_daily_minutes': row['predicted_daily_minutes'],
            }
            for row in scored_subjects
        ],
    }


if __name__ == '__main__':
    demo = {'Mathematics': 9, 'Physics': 14.5, 'Chemistry': 11, 'English': 16}
    print(generate_plan_from_model(demo, 80))
