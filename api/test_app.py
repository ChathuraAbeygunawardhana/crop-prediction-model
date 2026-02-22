import unittest
from fastapi.testclient import TestClient
from app import app

class TestAppAPI(unittest.TestCase):
    def test_read_root(self):
        with TestClient(app) as client:
            response = client.get("/")
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.json(), {"message": "Welcome to the Crop Prediction API. Use the /docs endpoint for interactive testing."})

    def test_predict_paddy(self):
        with TestClient(app) as client:
            payload = {
                "N": 90.0,
                "P": 42.0,
                "K": 43.0,
                "pH": 6.5,
                "EC": 1.2,
                "Temperature": 24.5,
                "Humidity": 75.0,
                "Rainfall": 150.0,
                "Elevation": 500.0,
                "Soil_Type": "Loamy",
                "Zone": "Wet Zone",
                "Water_Source": 1
            }
            response = client.post("/predict", json=payload)
            self.assertEqual(response.status_code, 200)
            self.assertIn("prediction", response.json())
            self.assertEqual(response.json()["prediction"], "Paddy")

    def test_predict_kurakkan(self):
        with TestClient(app) as client:
            payload = {
                "N": 30.0,
                "P": 15.0,
                "K": 20.0,
                "pH": 7.2,
                "EC": 0.8,
                "Temperature": 32.0,
                "Humidity": 45.0,
                "Rainfall": 50.0,
                "Elevation": 100.0,
                "Soil_Type": "Sandy",
                "Zone": "Dry Zone",
                "Water_Source": 2
            }
            response = client.post("/predict", json=payload)
            self.assertEqual(response.status_code, 200)
            self.assertIn("prediction", response.json())
            self.assertEqual(response.json()["prediction"], "Kurakkan")

    def test_predict_invalid_fields(self):
        with TestClient(app) as client:
            payload = {
                "N": 30.0,
            }
            response = client.post("/predict", json=payload)
            # FastAPI returns 422 for validation errors on missing fields
            self.assertEqual(response.status_code, 422)

if __name__ == '__main__':
    unittest.main()
