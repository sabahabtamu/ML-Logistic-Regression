from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import joblib
import numpy as np
import os


class DiabetesInput(BaseModel):
    Pregnancies: float
    Glucose: float
    BloodPressure: float
    SkinThickness: float
    Insulin: float
    BMI: float
    DiabetesPedigreeFunction: float
    Age: float


app = FastAPI()

origins = [
    "http://localhost:3000",                      
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model once at startup
MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "logistic_model.joblib")
try:
    model = joblib.load(MODEL_PATH)
except Exception as e:
    model = None


@app.get("/api/")
def read_root():
    return {"status": "ok"}


@app.post("/api/predict")
def predict_diabetes(data: DiabetesInput):
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded on server")

    try:
        input_data = [list(data.model_dump().values())]
        prediction = int(model.predict(input_data)[0])
        probability = float(model.predict_proba(input_data)[0][1]) if hasattr(model, "predict_proba") else 0.5
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))

    return {"is_diabetic": prediction, "probability": probability}
