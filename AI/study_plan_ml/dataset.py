import json
import random
from pathlib import Path

from .config import DEFAULT_DATASET_PATH, MIDSEM_MAX_MARKS

SUBJECTS = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'English',
    'Data Structures',
    'Operating Systems',
    'Database Systems',
    'Computer Networks',
]


def _target_minutes(raw_score: float, target_final: float) -> int:
    percentage = (raw_score / MIDSEM_MAX_MARKS) * 100
    gap = max(0.0, target_final - percentage)
    if percentage < 45:
        return 48
    if percentage < 60:
        return 40
    if percentage < 75:
        return 24 if gap > 0 else 18
    return 12


def build_seed_dataset(output_path: Path = DEFAULT_DATASET_PATH, sample_count: int = 320):
    output_path.parent.mkdir(parents=True, exist_ok=True)
    random.seed(42)

    rows = []
    for _ in range(sample_count):
        subject = random.choice(SUBJECTS)
        raw_score = round(random.uniform(4, 19), 1)
        target_final = random.choice([70, 75, 80, 85, 90])
        percentage = round((raw_score / MIDSEM_MAX_MARKS) * 100, 2)
        gap_to_target = round(max(0.0, target_final - percentage), 2)
        status = 'weak' if percentage < 60 else 'moderate' if percentage < 75 else 'strong'
        target_minutes = _target_minutes(raw_score, target_final)
        rows.append({
            'subject': subject,
            'raw_score': raw_score,
            'midsem_max_marks': MIDSEM_MAX_MARKS,
            'percentage': percentage,
            'target_final': target_final,
            'gap_to_target': gap_to_target,
            'is_weak': int(status == 'weak'),
            'is_moderate': int(status == 'moderate'),
            'target_daily_minutes': target_minutes,
        })

    with output_path.open('w', encoding='utf-8') as handle:
        for row in rows:
            handle.write(json.dumps(row) + '\n')

    return output_path, len(rows)


if __name__ == '__main__':
    path, count = build_seed_dataset()
    print(f'Wrote {count} training samples to {path}')
