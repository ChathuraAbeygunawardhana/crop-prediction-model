# Machine Learning Assignment Report: Intelligent Crop Prediction Model

## 1. Problem Definition & Dataset Collection

### Problem Description and Relevance
The agricultural sector in Sri Lanka faces challenges in optimizing yield due to suboptimal crop selection. The objective of this project is to develop an intelligent crop recommendation system. Recommending the optimal crop based on granular soil chemistry and regional climatic data allows farmers to maximize their yield potential and reduce the risk of crop failure, directly addressing modern agricultural efficiency and food security.

### Dataset Collection and Source
The primary agricultural data was initially obtained from the official Sri Lankan statistics portal, 'statistics.gov.lk'. This data was originally acquired as multiple disparate files, which had to be systematically combined and synthesized into a single cohesive dataset named "LankaCrop Dataset". This integration was strictly compiled utilizing Python data processing scripts to accurately reflect the real-world statistical distributions of Sri Lanka's distinct agro-ecological zones, elevation bands, and soil characteristics. 

### Features, Target Variable, and Size
- **Features:** The dataset comprises 12 independent variables capturing both soil chemistry and environmental metrics: `N` (Nitrogen), `P` (Phosphorus), `K` (Potassium), `pH`, `EC` (Electrical Conductivity), `Temperature`, `Humidity`, `Rainfall`, `Elevation`, `Soil_Type`, `Zone`, and `Water_Source`.
- **Target Variable:** `Target_Crop` (Categorical variable indicating the recommended crop).
- **Dataset Size:** The final curated dataset contains 4,047 high-quality tabular records.

### Data Preprocessing
Extensive data curation was performed to secure robust model generalization:
1. **Target Consolidation:** Highly overlapping sub-varieties (e.g., Paddy (Nadu), Paddy (Samba), Paddy (Mawel)) which could not be statistically differentiated on basic NPK values were merged into a single `Paddy` macro-class.
2. **Class Reduction:** Statistically insignificant minority classes (e.g., Cashew, Leeks) lacking sufficient data to generalize were dropped, focusing the model on the top 8 major Sri Lankan crops.
3. **Feature Dropping:** The target leakage variable (`Yield_MT_per_HA`) was completely removed prior to model training to prevent artificial inflation of accuracy metrics. 

### Ethical Data Use
As the dataset comprises strictly environmental, soil, and synthetically generated geographic metrics to simulate crop growth, no personal, identifiable, or sensitive human data was collected or utilized, ensuring absolute ethical compliance.

---

## 2. Selection of a New Machine Learning Algorithm

### Chosen Algorithm
The selected algorithm is the **CatBoost (Categorical Boosting) Classifier**, an advanced gradient boosting ensemble based on decision trees. Deep learning models were explicitly avoided in favor of this highly interpretable, tree-based boosting model.

### Justification and Differentiation
Unlike standard algorithms typically taught in foundational curriculums (such as basic Decision Trees, Logistic Regression, or k-Nearest Neighbors), CatBoost introduces sophisticated internal mechanisms:
- **Native Categorical Handling:** Standard models and even algorithms like XGBoost typically require explicit One-Hot Encoding for categorical features. CatBoost processes categorical string data natively (such as our `Soil_Type` and `Zone` features) using target-based statistics, drastically reducing memory usage and the risk of the "curse of dimensionality" from sparse matrices.
- **Oblivious Trees:** By utilizing symmetric (oblivious) decision trees, CatBoost inherently acts as a robust regularizer, preventing common overfitting issues observed in standard, asymmetric decision trees and Random Forest architectures.

---

## 3. Model Training and Evaluation

### Train / Validation / Test Split
To ensure unbiased evaluation, the 4,047 samples were allocated using a robust, stratified approach to maintain class proportions:
- **Train Set (80% / 3,236 samples):** Utilized by CatBoost for gradient optimization.
- **Validation Set (10% / 405 samples):** Used as an unseen benchmark during training for early stopping criteria.
- **Test Set (10% / 405 samples):** Strictly isolated for final, objective evaluation after model compilation.

### Hyperparameter Optimization
The model was instantiated emphasizing conservative but deep learning adjustments:
- `iterations=10000`: Governed by an `early_stopping_rounds=100` parameter utilizing the validation set to halt training precisely when overfitting begins.
- `learning_rate=0.1`: To ensure the gradient steps locate a stable global minimum.
- `depth=8`: Increased model depth was utilized to capture complex, non-linear interactions between soil conditions and environmental climate constraints.
- `auto_class_weights='Balanced'`: Instructs the algorithm to apply heavier loss penalties for misclassifying minority classes (e.g., Chilli), counteracting class imbalances organically.

### Performance Metrics and Results
Testing against the isolated Test Set yielded the following metrics:
- **Test Accuracy:** 0.9975 (99.75%)
- **Test Macro F1-Score:** 0.9971
Precision and Recall across the 8 varied classes consistently scored between 0.98 and 1.00. The exceptionally high variance capture indicates that curating down to the 8 structural crops successfully removed structural noise, resulting in a highly confident and delineable classification boundary.

---

## 4. Explainability & Interpretation

### Applied Explainability Methods
Machine learning models inherently operate as "black boxes." To overcome this, two techniques were integrated:
1. **Global Feature Importance Analysis** natively via CatBoost.
2. **SHAP (SHapley Additive exPlanations)** to dissect localized marginal contributions of individual features across the predictions.

### Interpretation of Model Learning
- **Influential Features:** The feature importance and SHAP summary analysis revealed that primary geographical boundaries—specifically `Zone`, `Elevation`, and `Temperature`—dictate the target crop far more heavily than granular soil metrics like `pH` or `EC`. 
- **Domain Knowledge Alignment:** The algorithm's behavior aligns perfectly with real-world agricultural topography. In Sri Lanka, the overarching climate (Wet, Dry, or Intermediate zones) and the altitudinal elevation bands (Low, Mid, High) serve as hard biological limits for what crops can be sustained, regardless of how perfectly balanced the local NPK soil nutrients might be. The model successfully prioritized macroeconomic weather trends over micro-soil characteristics.

---

## 5. Critical Discussion

### Limitations and Data Quality Issues
While the model achieved an exceptional 99.75% accuracy, this points to a core limitation: the data is synthetic. Because the dataset was logically engineered to follow standard botanical statistics, it arguably lacks the true "noisy variance"—such as unpredictable disease outbreaks, poor farming practices, or highly erratic, localized weather anomalies—found in empirical, real-world field sampling. The model may exhibit slight overconfidence if deployed into highly volatile, unstructured authentic environments.

### Risks of Bias or Unfairness
A significant modeling decision was to merge overlapping categories and drop minority classes (like Leeks and Cashews) to boost global accuracy. Consequently, the model is inherently biased toward recommending massive, commercial staple crops. Smallholder farmers desiring to cultivate niche or minority crops would receive a disadvantageous output profile, representing an intrinsic algorithmic bias resulting from our data curation choices.

### Real-World Impact and Ethical Considerations
Deploying an intelligent recommendation model directly carries immense economic stakes. A localized failure or false-positive recommendation could theoretically bankrupt a smallholder farmer who entirely pivots their yield based on algorithmic advice. Therefore, transparent execution—achieved through the SHAP explainability matrices—is a mandatory ethical consideration to ensure users understand the "why" behind their computational agricultural advice.

---

## 6. Front-End Integration

To elevate the practicality of the machine learning model, a fully cohesive full-stack infrastructure was developed and successfully deployed to live production environments.

1. **Backend Integration & AWS Deployment:** The saved CatBoost model (`model.joblib`) was mounted into a custom, highly asynchronous RESTful API built on the Python FastAPI framework. This backend infrastructure was deployed on **AWS (Amazon Web Services)**, supporting robust computation for predictive modeling while efficiently type-checking incoming JSON payload structures matching the input vector matrices.
2. **Frontend User Interface & Vercel Deployment:** A professional web application was developed utilizing Next.js 16 (React 19) and meticulously styled using modern Tailwind CSS to provide a highly interactive dashboard. The complete frontend was deployed on **Vercel** and is accessible interactively via the live URL: [https://crop-prediction-model-six.vercel.app](https://crop-prediction-model-six.vercel.app).
3. **User Flow Data Interaction:** Users can navigate to the live prediction dashboard and input their precise agricultural metrics using dedicated inputs and dropdowns. This triggers a dynamic HTTP POST request to the AWS-hosted API, returning and rendering the machine learning prediction back onto the UI dashboard with high responsivity, facilitating ease of use for agricultural stakeholders natively in the browser.
