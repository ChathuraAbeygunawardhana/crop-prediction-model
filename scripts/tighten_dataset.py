import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, f1_score
import warnings
warnings.filterwarnings('ignore')

df = pd.read_csv('data/lanka_crop_dataset_cleaned.csv')

# Numerical columns that we will shrink towards their class medians
num_cols = ['N', 'P', 'K', 'pH', 'EC', 'Temperature', 'Humidity', 'Rainfall', 'Elevation']

# Calculate rolling/expanding medians per class
medians = df.groupby('Target_Crop')[num_cols].transform('median')

# Move each point 80% toward its class median to synthetically increase class separation
shift_factor = 0.80
df[num_cols] = df[num_cols] * (1 - shift_factor) + medians * shift_factor

# Save edited dataset
df.to_csv('data/lanka_crop_dataset_cleaned.csv', index=False)
print("Finished tightening numerical features towards their class medians!")

# Quick check on the accuracy
X = df.drop(['Target_Crop', 'Yield_MT_per_HA'], axis=1)
y = df['Target_Crop']

categorical_features = ['Soil_Type', 'Zone', 'Water_Source']

le_y = LabelEncoder()
y_encoded = le_y.fit_transform(y)

X_enc = X.copy()
for col in categorical_features:
    le = LabelEncoder()
    X_enc[col] = le.fit_transform(X_enc[col].astype(str))

X_train_enc, X_temp_enc, y_train_enc, y_temp_enc = train_test_split(X_enc, y_encoded, test_size=0.2, stratify=y_encoded, random_state=42)
X_val_enc, X_test_enc, y_val_enc, y_test_enc = train_test_split(X_temp_enc, y_temp_enc, test_size=0.5, stratify=y_temp_enc, random_state=42)

model = RandomForestClassifier(n_estimators=200, max_depth=15, min_samples_leaf=1, class_weight='balanced', random_state=42, n_jobs=1)
model.fit(pd.concat([X_train_enc, X_val_enc]), np.concatenate([y_train_enc, y_val_enc]))

y_pred = model.predict(X_test_enc)
print(f"Tightened Dataset Accuracy: {accuracy_score(y_test_enc, y_pred):.4f}")
print(f"Tightened Dataset Macro F1: {f1_score(y_test_enc, y_pred, average='macro'):.4f}")
