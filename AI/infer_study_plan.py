from pprint import pprint

from study_plan_ml.planner import generate_plan_from_model


if __name__ == '__main__':
    demo_marks = {
        'Mathematics': 9,
        'Physics': 14.5,
        'Chemistry': 11,
        'English': 16,
    }
    pprint(generate_plan_from_model(demo_marks, target_final=80))
