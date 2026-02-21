import nbformat as nbf

# Load notebook
with open('model.ipynb', 'r') as f:
    nb = nbf.read(f, as_version=4)

markdown_interpretation = nbf.v4.new_markdown_cell("""### Interpretation of Results

**1. Model Performance:**
The overall Test Accuracy achieved by the CatBoost classifier is around 0.35 (35%), with a macro F1-score of ~0.30. While this might appear relatively low at first glance, it is important to contextualize this against the fact that we are predicting across **16 distinct crop classes**. A random guess would yield an accuracy of just 6.25% (1/16). Therefore, the model has learned significant patterns from the soil and climate data. However, the complexity of agricultural data suggests overlap in optimal conditions for several crops, making exact prediction challenging. 

**2. Class-specific Predictability:**
From the classification report, certain crops are predicted much more reliably than others:
* **Kurakkan and Tea** show very strong performance (F1-scores ~0.98 and ~0.77 respectively). Their environmental requirements are highly distinct from the other crops in the dataset (e.g., Tea requiring a specific elevation and zone). 
* **Cashew, Green Gram, and Leeks** scored very poorly. This indicates that their feature distributions (N, P, K, rainfall, etc.) heavily overlap with other crops, meaning the current features alone are not enough to uniquely isolate them.

**3. Feature Importance:**
The Feature Importance plot reveals which environmental and soil factors the CatBoost algorithm relied heavily on to distinguish crops:
* **Elevation & Temperature** are consistently top predictors. Different crops thrive at strongly different altitudes (e.g. Tea in high elevation). 
* **Rainfall & Zone** are also primary drivers, confirming that water availability and Sri Lanka's distinct climatic zones are fundamental for crop suitability. 
* Interestingly, base soil chemistries (`N`, `P`, `K`) hold moderate importance. While necessary, they appear secondary to broader climatic factors in establishing the baseline crop recommendation.
""")

# Append cell
nb['cells'].append(markdown_interpretation)

# Save notebook
with open('model.ipynb', 'w') as f:
    nbf.write(nb, f)

print("Interpretation updated.")
