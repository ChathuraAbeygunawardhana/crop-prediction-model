import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import joblib

print("Loading dataset...")
df = pd.read_csv('data/lanka_crop_dataset_cleaned.csv')

X = df.drop(['Target_Crop', 'Yield_MT_per_HA'], axis=1)
y = df['Target_Crop']
X = pd.get_dummies(X, columns=['Soil_Type', 'Zone', 'Water_Source'])

X_train, X_temp, y_train, y_temp = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)
X_val, X_test, y_val, y_test = train_test_split(X_temp, y_temp, test_size=0.5, stratify=y_temp, random_state=42)

print("Training RandomForestClassifier...")
model = RandomForestClassifier(
    n_estimators=300,
    max_depth=15,
    min_samples_leaf=1,
    class_weight='balanced',
    random_state=42,
    n_jobs=1
)

model.fit(pd.concat([X_train, X_val]), np.concatenate([y_train, y_val]))

print("Saving model and features to model.joblib...")
joblib.dump({"model": model, "features": X.columns.tolist()}, 'model.joblib')
print("Model saved to model.joblib")
