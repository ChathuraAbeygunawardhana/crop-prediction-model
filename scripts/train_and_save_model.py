import pandas as pd
from catboost import CatBoostClassifier
import joblib

def main():
    print("Loading dataset...")
    df = pd.read_csv('../data/lanka_crop_dataset_cleaned.csv')
    
    # We drop the Yield leakage column just like in the notebook
    X = df.drop(['Target_Crop', 'Yield_MT_per_HA'], axis=1)
    y = df['Target_Crop']
    
    categorical_features = ['Soil_Type', 'Zone', 'Water_Source']
    
    print("Training CatBoostClassifier...")
    # Initialize the model using the same tuned parameters
    model = CatBoostClassifier(
        iterations=1000,
        learning_rate=0.05,
        depth=8,
        cat_features=categorical_features,
        auto_class_weights='Balanced',
        random_seed=42,
        verbose=100
    )
    
    # Fit the model on the full cleaned dataset 
    # (Since we just need the best production model now)
    model.fit(X, y)
    
    # Save the model
    model_path = '../model.joblib'
    print(f"Saving model to {model_path}...")
    joblib.dump(model, model_path)
    print("Optimization Complete: Model Saved.")

if __name__ == "__main__":
    main()
