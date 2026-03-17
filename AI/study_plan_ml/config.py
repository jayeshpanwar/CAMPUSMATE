from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[2]
AI_ROOT = PROJECT_ROOT / 'AI'
DATA_DIR = AI_ROOT / 'data'
MODELS_DIR = AI_ROOT / 'models'
DEFAULT_DATASET_PATH = DATA_DIR / 'study_plan_training_data.jsonl'
DEFAULT_MODEL_PATH = MODELS_DIR / 'study_plan_allocator.joblib'
MIDSEM_MAX_MARKS = 20.0
DAILY_STUDY_MINUTES = 120
WEEK_COUNT = 6
DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
PHASES = {
    1: 'Foundation',
    2: 'Foundation',
    3: 'Practice',
    4: 'Practice',
    5: 'Mock Test',
    6: 'Revision',
}
