import nbformat
import sys

def extract_model(notebook_path):
    with open(notebook_path, 'r', encoding='utf-8') as f:
        nb = nbformat.read(f, as_version=4)
    for cell in nb.cells:
        if cell.cell_type == 'code':
            if 'model.fit' in cell.source or 'joblib' in cell.source:
                print(f"--- Cell Source ---\n{cell.source}\n-------------------")

if __name__ == '__main__':
    extract_model('model.ipynb')
