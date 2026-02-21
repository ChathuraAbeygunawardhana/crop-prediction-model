from fastapi.testclient import TestClient
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app import app

client = TestClient(app)

def test_prediction():
    payload = {
        "N": 65.8,
        "P": 38.2,
        "K": 140.5,
        "pH": 5.43,
        "EC": 0.8,
        "Temperature": 22.1,
        "Humidity": 80.1,
        "Rainfall": 3828.3,
        "Elevation": 552.7,
        "Soil_Type": "Low Humic Gley",
        "Zone": "Wet",
        "Water_Source": 1
    }
    with client:
        response = client.post("/predict", json=payload)
    print("Status Code:", response.status_code)
    print("Response JSON:", response.json())
    if response.status_code == 200:
        print("Test passed successfully.")
    else:
        print("Test failed.")

if __name__ == "__main__":
    test_prediction()
