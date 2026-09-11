"""
FastAPI service that loads the trained model once at startup and
serves predictions over HTTP.

Run with:
    uvicorn main:app --reload --port 8000
"""

from pathlib import Path
from contextlib import asynccontextmanager

import joblib
import pandas as pd
from fastapi import FastAPI
from pydantic import BaseModel

FEATURES = [
    "CreditScore",
    "Age",
    "Tenure",
    "Balance",
    "NumOfProducts",
    "HasCrCard",
    "IsActiveMember",
    "EstimatedSalary",
]

ml_models = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    base = Path(__file__).parent
    ml_models["model"] = joblib.load(base / "model.pkl")
    ml_models["scaler"] = joblib.load(base / "scaler.pkl")
    yield
    ml_models.clear()

app = FastAPI(lifespan=lifespan)


class ChurnInput(BaseModel):
    CreditScore: float
    Age: float
    Tenure: float
    Balance: float
    NumOfProducts: float
    HasCrCard: int
    IsActiveMember: int
    EstimatedSalary: float


class ChurnOutput(BaseModel):
    churn: int
    probability: float


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/predict", response_model=ChurnOutput)
def predict(payload: ChurnInput):
    row = pd.DataFrame([[getattr(payload, f) for f in FEATURES]], columns=FEATURES)
    scaled = ml_models["scaler"].transform(row)

    model = ml_models["model"]
    pred = int(model.predict(scaled)[0])
    prob = float(model.predict_proba(scaled)[0][1])

    return ChurnOutput(churn=pred, probability=prob)
