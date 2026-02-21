import pandas as pd
from sklearn.model_selection import train_test_split
from catboost import CatBoostClassifier
from sklearn.metrics import accuracy_score, classification_report, f1_score, confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns
import nbformat as nbf
import json
import os

# Load notebook
with open('model.ipynb', 'r') as f:
    nb = nbf.read(f, as_version=4)

# Create cells
markdown_intro = nbf.v4.new_markdown_cell("""## 1. Data Preprocessing and Splitting
We will drop `Yield_MT_per_HA` as it is a target for regression. We will identify `Soil_Type`, `Zone`, and `Water_Source` as categorical features. We use a 70% Train, 15% Validation, and 15% Test split. Stratified sampling ensures balanced classes.""")

code_split = nbf.v4.new_code_cell("""from sklearn.model_selection import train_test_split

X = df.drop(['Target_Crop', 'Yield_MT_per_HA'], axis=1)
y = df['Target_Crop']

categorical_features = ['Soil_Type', 'Zone', 'Water_Source']

# Split: 70% Train, 30% Temp (Validation + Test)
X_train, X_temp, y_train, y_temp = train_test_split(X, y, test_size=0.3, stratify=y, random_state=42)

# Split Temp into 50% Val, 50% Test (15% overall each)
X_val, X_test, y_val, y_test = train_test_split(X_temp, y_temp, test_size=0.5, stratify=y_temp, random_state=42)

print(f"Train size: {X_train.shape[0]}, Validation size: {X_val.shape[0]}, Test size: {X_test.shape[0]}")
""")

markdown_model = nbf.v4.new_markdown_cell("""## 2. Model Training
We use **CatBoostClassifier** due to its excellent handling of categorical features natively without requiring extensive encoding.
### Hyperparameter Choices:
- `iterations=500`: Enough epochs to learn, but early stopping will halt if it converges sooner.
- `learning_rate=0.1`: A standard starting learning rate for CatBoost.
- `depth=6`: Default depth, provides a good balance between model complexity and performance.
- `cat_features`: Explicitly tell the model which columns are categorical.
- `early_stopping_rounds=50`: Prevents overfitting by stopping training if validation metric stops improving.
""")

code_model = nbf.v4.new_code_cell("""from catboost import CatBoostClassifier

# Initialize CatBoostClassifier
model = CatBoostClassifier(
    iterations=500,
    learning_rate=0.1,
    depth=6,
    cat_features=categorical_features,
    random_seed=42,
    verbose=50 
)

# Train the model
model.fit(
    X_train, y_train,
    eval_set=(X_val, y_val),
    early_stopping_rounds=50,
    plot=False # set to False to avoid errors in headless execution, we will visualize manually if needed
)
""")

markdown_eval = nbf.v4.new_markdown_cell("""## 3. Model Evaluation
Evaluate the model on the unseen Test set using Accuracy and Macro F1-score. We also print an extensive classification report.""")

code_eval = nbf.v4.new_code_cell("""from sklearn.metrics import accuracy_score, classification_report, f1_score
import warnings
warnings.filterwarnings('ignore')

# Predict on test set
y_pred = model.predict(X_test)

# Calculate metrics
accuracy = accuracy_score(y_test, y_pred)
macro_f1 = f1_score(y_test, y_pred, average='macro')

print(f"Test Accuracy: {accuracy:.4f}")
print(f"Test Macro F1-Score: {macro_f1:.4f}\\n")
print("Classification Report:\\n")
print(classification_report(y_test, y_pred))
""")

markdown_viz = nbf.v4.new_markdown_cell("""## 4. Visualizations
Visualizing the confusion matrix and feature importance to understand model behavior.""")

code_viz = nbf.v4.new_code_cell("""import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import confusion_matrix
import numpy as np

# Confusion Matrix
plt.figure(figsize=(12, 10))
cm = confusion_matrix(y_test, y_pred)
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=np.unique(y_test), yticklabels=np.unique(y_test))
plt.title('Confusion Matrix - CatBoost')
plt.ylabel('Actual Label')
plt.xlabel('Predicted Label')
plt.xticks(rotation=45)
plt.show()

# Feature Importance
plt.figure(figsize=(10, 6))
feature_importance = model.get_feature_importance()
sorted_idx = np.argsort(feature_importance)
plt.barh(range(len(sorted_idx)), feature_importance[sorted_idx], align='center')
plt.yticks(range(len(sorted_idx)), np.array(X.columns)[sorted_idx])
plt.title('Feature Importance')
plt.show()
""")

# Append cells
nb['cells'].extend([markdown_intro, code_split, markdown_model, code_model, markdown_eval, code_eval, markdown_viz, code_viz])

# Save notebook
with open('model.ipynb', 'w') as f:
    nbf.write(nb, f)

print("Notebook updated.")
