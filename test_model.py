import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report, f1_score
from catboost import CatBoostClassifier

df = pd.read_csv('data/lanka_crop_dataset_cleaned.csv')

X = df.drop(['Target_Crop', 'Yield_MT_per_HA'], axis=1)
y = df['Target_Crop']
categorical_features = ['Soil_Type', 'Zone', 'Water_Source']

X_train, X_temp, y_train, y_temp = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)
X_val, X_test, y_val, y_test = train_test_split(X_temp, y_temp, test_size=0.5, stratify=y_temp, random_state=42)

# Try without class weights
model = CatBoostClassifier(
    iterations=1000,
    learning_rate=0.05,
    depth=8,
    cat_features=categorical_features,
    random_seed=42,
    verbose=0
)

model.fit(X_train, y_train, eval_set=(X_val, y_val), early_stopping_rounds=100, plot=False)
y_pred = model.predict(X_test)

accuracy = accuracy_score(y_test, y_pred)
macro_f1 = f1_score(y_test, y_pred, average='macro')
print("Without Balanced Weights:")
print(f"Test Accuracy: {accuracy:.4f}")
print(f"Test Macro F1-Score: {macro_f1:.4f}\n")

# Try SMOTE? SMOTE requires encoding categorical features first.
# Try Random Forest?
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
X_enc = X.copy()
le_soil = LabelEncoder()
le_zone = LabelEncoder()
X_enc['Soil_Type'] = le_soil.fit_transform(X_enc['Soil_Type'])
X_enc['Zone'] = le_zone.fit_transform(X_enc['Zone'])

X_train_enc, X_temp_enc, y_train_enc, y_temp_enc = train_test_split(X_enc, y, test_size=0.2, stratify=y, random_state=42)
X_val_enc, X_test_enc, y_val_enc, y_test_enc = train_test_split(X_temp_enc, y_temp_enc, test_size=0.5, stratify=y_temp_enc, random_state=42)

rf = RandomForestClassifier(n_estimators=200, max_depth=15, random_state=42, class_weight='balanced')
rf.fit(X_train_enc, y_train_enc)
y_pred_rf = rf.predict(X_test_enc)
print("Random Forest (Balanced):")
print(f"Test Accuracy: {accuracy_score(y_test_enc, y_pred_rf):.4f}")
print(f"Test Macro F1-Score: {f1_score(y_test_enc, y_pred_rf, average='macro'):.4f}\n")

rf_unbal = RandomForestClassifier(n_estimators=200, max_depth=15, random_state=42)
rf_unbal.fit(X_train_enc, y_train_enc)
y_pred_rf_unbal = rf_unbal.predict(X_test_enc)
print("Random Forest (Unbalanced):")
print(f"Test Accuracy: {accuracy_score(y_test_enc, y_pred_rf_unbal):.4f}")
print(f"Test Macro F1-Score: {f1_score(y_test_enc, y_pred_rf_unbal, average='macro'):.4f}\n")

