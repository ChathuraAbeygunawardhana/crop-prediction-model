import pandas as pd

# 1. Load the original dataset
df = pd.read_csv('data/lanka_crop_dataset.csv')

# 2. Group Target Classes
# We group all "Paddy" variants into a single "Paddy" class.
df['Target_Crop'] = df['Target_Crop'].replace({
    'Paddy (Nadu)': 'Paddy',
    'Paddy (Samba)': 'Paddy',
    'Paddy (Mawel)': 'Paddy'
})

# 3. Drop rare/overlapping minority classes to focus on major crops
# Let's see the current counts
counts = df['Target_Crop'].value_counts()
print("Original grouped counts:\\n", counts)

# Keep only crops that have more than 100 samples (example threshold)
# Alternatively, let's explicitly keep the top 8 distinct crops that make up the vast majority of Sri Lankan agriculture.
top_crops = ['Maize', 'Paddy', 'Coconut', 'Tea', 'Rubber', 'Cinnamon', 'Chilli', 'Kurakkan']

filtered_df = df[df['Target_Crop'].isin(top_crops)].copy()

# Print new counts to verify
print("\\nNew filtered counts:\\n", filtered_df['Target_Crop'].value_counts())

# Save it over the original file (or as a new file if preferred)
filtered_df.to_csv('data/lanka_crop_dataset_cleaned.csv', index=False)
print("Saved cleaned dataset to data/lanka_crop_dataset_cleaned.csv")

