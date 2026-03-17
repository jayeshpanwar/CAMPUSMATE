from study_plan_ml.dataset import build_seed_dataset


if __name__ == '__main__':
    output_path, row_count = build_seed_dataset()
    print(f'Created {row_count} rows at {output_path}')
