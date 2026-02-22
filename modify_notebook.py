import json

with open('notebooks/model.ipynb', 'r') as f:
    nb = json.load(f)

new_markdown_cell = {
    "id": "shap_markdown_01",
    "cell_type": "markdown",
    "metadata": {},
    "source": [
        "## 6. Model Explainability: SHAP\n",
        "To further explain our model's predictions beyond global feature importance, we use **SHAP (SHapley Additive exPlanations)**. SHAP values break down a prediction to show the impact of each feature. The summary plot below provides a global overview of feature importance for each crop class."
    ]
}

new_code_cell = {
    "id": "shap_code_01",
    "cell_type": "code",
    "execution_count": None,
    "metadata": {},
    "outputs": [],
    "source": [
        "import shap\n",
        "\n",
        "# Initialize the SHAP explainer with our trained CatBoost model\n",
        "explainer = shap.TreeExplainer(model)\n",
        "\n",
        "# Calculate SHAP values for the test set\n",
        "shap_values = explainer.shap_values(X_test)\n",
        "\n",
        "# Generate a summary plot to show feature importance across all classes\n",
        "shap.summary_plot(shap_values, X_test, plot_type=\"bar\")"
    ]
}

nb['cells'].append(new_markdown_cell)
nb['cells'].append(new_code_cell)

with open('notebooks/model.ipynb', 'w') as f:
    json.dump(nb, f, indent=1)
