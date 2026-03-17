from study_plan_ml.train import train_model


if __name__ == '__main__':
    artifact, model_path = train_model()
    print(f'Saved model to {model_path}')
    print(f"Metrics: {artifact['metrics']}")
