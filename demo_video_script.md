# Intelligent Crop Prediction Model - Demo Video Script

**Target Duration:** 3 - 5 minutes (approx. 4m 30s)
**Pacing:** ~130-150 words per minute
**Format Constraint:** 100% Screen Recording of the Application (No slides or external presentations). 
**Note:** You will verbalize the machine learning details *while* interacting with the application to meet the assignment rubric.

---

## 1. Introduction & The Problem (0:00 - 0:45)

**[Screen Action]**
*   **0:00 - 0:15:** Open the web application on the home page. slowly scroll down to show the full interface. Toggle between Light Mode and Dark Mode.
*   **0:15 - 0:45:** Hover your mouse over the input fields (N, P, K, pH, etc.) to show what the user needs to provide. 

**[Voiceover]**
"Hello, welcome to the demonstration of my machine learning assignment: an Intelligent Crop Recommendation System. The main problem I wanted to solve is that farmers sometimes get lower crop yields because they choose crops based on habit instead of using data. 
To build the model for this app, I created the 'LankaCrop Dataset' by putting together data from the official `statistics.gov.lk` website. The dataset has over 4,000 records and 12 features—like the NPK nutrients and weather details you see here. Since all the data is just about nature and the environment, there are no privacy or ethical issues."

---

## 2. Algorithm Selection (0:45 - 1:30)

**[Screen Action]**
*   **0:45 - 1:05:** Click the **"Soil Type"** dropdown menu and slowly scroll through the categorical options. 
*   **1:05 - 1:30:** Click the **"Zone"** dropdown menu to show the climatic zones. Keep the dropdown open or slowly select one.

**[Voiceover]**
"For the model, I decided not to use deep learning and instead chose the **CatBoost Classifier**. 
I picked CatBoost because basic algorithms like k-Nearest Neighbors or Logistic Regression have a hard time with categorical data—like the text in these 'Soil Type' and 'Zone' dropdowns. Basic models need large, complicated setups like One-Hot Encoding which slows things down. But CatBoost handles these text categories naturally. Also, it uses a special tree structure that acts as a strong regularizer, which stops the model from memorizing the data too much (overfitting), a problem that regular Random Forests often have."

---

## 3. Model Training & Evaluation (1:30 - 2:15)

**[Screen Action]**
*   **1:30 - 2:15:** Use the **"Quick Fill Templates"** buttons. Click "Paddy" so the form autofills. Then click "Tea" so the form autofills again. Demonstrate the ease of use. 

**[Voiceover]**
"Before putting this model to use, it was carefully trained. I used a strict 80-10-10 split: 80% of the data for training, 10% for validation, and a separate 10% just for testing. 
While tweaking the model's settings (hyperparameter tuning), I used the 10% validation set to stop the training early as soon as it started to overfit. 
The final results were great. On the new, unseen test data, the model got a 99.75% Test Accuracy and a 99.71% Macro F1-score. Because of these high scores, we can be very sure that the model will make highly accurate crop choices when we type in our data."

---

## 4. Explainability & Interpretation (2:15 - 3:00)

**[Screen Action]**
*   **2:15 - 3:00:** Manually adjust the **"Elevation"** and **"Temperature"** sliders/inputs a few times. Point your mouse cursor deliberately at the `Zone`, `Elevation`, and `Temperature` fields.

**[Voiceover]**
"It was very important that we could understand how the model makes decisions, so it's not just a 'black box'. I used SHAP—Shapley Additive Explanations—to see exactly what the model learned. 
The SHAP analysis showed that big environmental details—like 'Zone', 'Elevation', and 'Temperature'—were the most important features, even more than soil details like Nitrogen or pH. 
This makes perfect sense for farming in Sri Lanka: the weather zones and heights are the biggest factors for what crops can grow. The SHAP charts proved that the model correctly focused on weather rather than just the soil."

---

## 5. Front-End Demo Action (3:00 - 3:45)

**[Screen Action]**
*   **3:00 - 3:15:** Click one final "Quick Fill Template" (e.g., Maize). 
*   **3:15 - 3:45:** Click **"Predict Optimal Crop"**. Allow the viewer to see the loading animation, and then highlight the prediction result popping up on the screen. 

**[Voiceover]**
"Now, let's see how the whole app works together. I built this front-end website using Next.js and Tailwind CSS so people can easily use the model. The machine learning model itself lives on a fast, asynchronous FastAPI server hosted on AWS. 
When I click 'Predict', this website takes the data we typed in and sends it to the AWS server. The server runs the CatBoost model and instantly sends the final prediction back to our screen. This shows a complete, working system from start to finish."

---

## 6. Critical Discussion & Conclusion (3:45 - 4:30)

**[Screen Action]**
*   **3:45 - 4:30:** Leave the prediction result visible on the screen. Move your mouse slightly, perhaps hovering over the predicted crop name, while you deliver the final discussion. 

**[Voiceover]**
"To wrap up, it's important to talk about the system's limits. First, the data is somewhat artificial, so it might not perfectly match the crazy, unpredictable weather on real farms.
The biggest issue, though, is the risk of bias. To get such high accuracy, I had to remove rare crops like Cashews from the data during preprocessing. This means the model has a built-in algorithmic bias: it prefers to recommend common, popular crops over rare ones. This could be unfair to small farmers who want to grow different things. Since bad crop advice can cost farmers money, it's really important we are honest about this bias.
Thank you for watching my application demonstration."
