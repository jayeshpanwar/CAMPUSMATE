import json
from pathlib import Path

import joblib
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.feature_extraction import DictVectorizer
from sklearn.metrics import mean_absolute_error
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline

from .config import DEFAULT_DATASET_PATH, DEFAULT_MODEL_PATH
from .dataset import build_seed_dataset


FEATURE_KEYS = ['subject', 'raw_score', 'percentage', 'target_final', 'gap_to_target', 'is_weak', 'is_moderate']
TARGET_KEY = 'target_daily_minutes'


def load_rows(dataset_path: Path):
    if not dataset_path.exists():
        build_seed_dataset(dataset_path)

    rows = []
    with dataset_path.open('r', encoding='utf-8') as handle:
        for line in handle:
            line = line.strip()
            if line:
                rows.append(json.loads(line))
    return rows


def build_pipeline():
    model = RandomForestRegressor(
        n_estimators=300,
        max_depth=12,
        min_samples_leaf=2,
        random_state=42,
    )
    return Pipeline([
        ('features', DictVectorizer(sparse=False)),
        ('model', model),
    ])


def train_model(dataset_path: Path = DEFAULT_DATASET_PATH, model_path: Path = DEFAULT_MODEL_PATH):
    rows = load_rows(dataset_path)
    X = [{key: row[key] for key in FEATURE_KEYS} for row in rows]
    y = np.array([row[TARGET_KEY] for row in rows], dtype=float)

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    pipeline = build_pipeline()
    pipeline.fit(X_train, y_train)
    preds = pipeline.predict(X_test)
    mae = float(mean_absolute_error(y_test, preds))

    artifact = {
        'pipeline': pipeline,
        'feature_keys': FEATURE_KEYS,
        'target_key': TARGET_KEY,
        'metrics': {'mae': round(mae, 3)},
        'row_count': len(rows),
    }
    model_path.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(artifact, model_path)
    return artifact, model_path


if __name__ == '__main__':
    artifact, path = train_model()
    print(f'Model saved to {path}')
    print(json.dumps(artifact['metrics'], indent=2))
