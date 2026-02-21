with open('model.ipynb', 'r') as f:
    c = f.read()
c = c.replace("n_jobs=-1", "n_jobs=1")
with open('model.ipynb', 'w') as f:
    f.write(c)
