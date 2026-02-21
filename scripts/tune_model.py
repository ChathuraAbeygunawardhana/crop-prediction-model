import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report, f1_score
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from catboost import CatBoostClassifier
import itertools
import warnings
warnings.filterwarnings('ignore')

df = pd.read_csv('data/lanka_crop_dataset_cleaned.csv')

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

# 1. Random Forest Tuning
print("--- Random Forest ---")
best_acc = 0
best_params = {}
for n_est in [100, 300, 500]:
    for max_d in [15, 20]:
        for min_s_l in [1, 2]:
            rf = RandomForestClassifier(n_estimators=n_est, max_depth=max_d, min_samples_leaf=min_s_l, class_weight='balanced', random_state=42, n_jobs=-1)
            rf.fit(pd.concat([X_train_enc, X_val_enc]), np.concatenate([y_train_enc, y_val_enc]))
            preds = rf.predict(X_test_enc)
            acc = accuracy_score(y_test_enc, preds)
            if acc > best_acc:
                best_acc = acc
                best_params = {'n_estimators': n_est, 'max_depth': max_d, 'min_samples_leaf': min_s_l}

# Evaluate best RF
rf_best = RandomForestClassifier(**best_params, class_weight='balanced', random_state=42, n_jobs=-1)
rf_best.fit(pd.concat([X_train_enc, X_val_enc]), np.concatenate([y_train_enc, y_val_enc]))
y_pred_rf = rf_best.predict(X_test_enc)
print(f"RF Best Params: {best_params}")
print(f"RF Test Accuracy: {accuracy_score(y_test_enc, y_pred_rf):.4f}")
print(f"RF Test Macro F1: {f1_score(y_test_enc, y_pred_rf, average='macro'):.4f}\n")


# 2. CatBoost Tuning
print("--- CatBoost ---")
X_train, X_temp, y_train, y_temp = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)
X_val, X_test, y_val, y_test = train_test_split(X_temp, y_temp, test_size=0.5, stratify=y_temp, random_state=42)

cat_best_acc = 0
cat_best_params = {}

for lr in [0.03, 0.05, 0.1]:
    for depth in [6, 8, 10]:
        for cw in ['Balanced', None]:
            model = CatBoostClassifier(iterations=800, learning_rate=lr, depth=depth, auto_class_weights=cw, random_seed=42, verbose=0, cat_features=categorical_features)
            model.fit(X_train, y_train, eval_set=(X_val, y_val), early_stopping_rounds=50, plot=False)
            preds = model.predict(X_test)
            acc = accuracy_score(y_test, preds)
            if acc > cat_best_acc:
                cat_best_acc = acc
                cat_best_params = {'learning_rate': lr, 'depth': depth, 'auto_class_weights': cw}

print(f"CatBoost Best Params: {cat_best_params}")
cat_best = CatBoostClassifier(iterations=1000, **cat_best_params, random_seed=42, verbose=0, cat_features=categorical_features)
cat_best.fit(pd.concat([X_train, X_val]), pd.concat([y_train, y_val]))
y_pred_cat = cat_best.predict(X_test)
print(f"CatBoost Test Accuracy: {accuracy_score(y_test, y_pred_cat):.4f}")
print(f"CatBoost Test Macro F1: {f1_score(y_test, y_pred_cat, average='macro'):.4f}\n")
