from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import pandas as pd
import numpy as np
from contextlib import asynccontextmanager

# Load the model and expected feature names on startup
model_data = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load model and features
    try:
        data = joblib.load('model.joblib')
        model_data['model'] = data['model']
        model_data['features'] = data['features']
        print("Model loaded successfully.")
    except Exception as e:
        print(f"Error loading model: {e}")
    yield
    # Cleanup (if any)
    model_data.clear()

app = FastAPI(title="Crop Prediction API", lifespan=lifespan)

# Define request schema based on original dataset features (before one-hot encoding)
class CropPredictionRequest(BaseModel):
    N: float
    P: float
    K: float
    pH: float
    EC: float
    Temperature: float
    Humidity: float
    Rainfall: float
    Elevation: float
    Soil_Type: str
    Zone: str
    Water_Source: int

class CropPredictionResponse(BaseModel):
    prediction: str

@app.post("/predict", response_model=CropPredictionResponse)
def predict_crop(request: CropPredictionRequest):
    if 'model' not in model_data or 'features' not in model_data:
        raise HTTPException(status_code=500, detail="Model not loaded.")

    try:
        # 1. Convert request to DataFrame matching the pre-encoded input format
        input_data = pd.DataFrame([request.model_dump()])
        
        # 2. Re-create the dummy variables logic applied during training
        # We need to make sure the dummy variables match the training set exactly
        
        # We explicitly add the expected categories according to the dataset structure
        # (Alternatively, we handle get_dummies and then reindex)
        input_encoded = pd.get_dummies(input_data, columns=['Soil_Type', 'Zone', 'Water_Source'])
        
        # Ensure all columns required by the model are present (fill missing with 0)
        expected_features = model_data['features']
        for col in expected_features:
            if col not in input_encoded.columns:
                input_encoded[col] = 0
                
        # Reorder columns to exactly match the training set order
        input_encoded = input_encoded[expected_features]
        
        # 3. Make prediction
        prediction = model_data['model'].predict(input_encoded)[0]
        return CropPredictionResponse(prediction=prediction)
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/")
def read_root():
    return {"message": "Welcome to the Crop Prediction API. Use the /docs endpoint for interactive testing."}
