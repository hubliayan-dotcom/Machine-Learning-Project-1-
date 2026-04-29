from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import pandas as pd
import numpy as np

app = FastAPI(title="House Price Prediction API")

# Load model (mock loading for now, expects joblib file in /models)
try:
    model = joblib.load('models/house_price_xgb.joblib')
except:
    model = None

class HouseInput(BaseModel):
    LotArea: float
    OverallQual: int
    YearBuilt: int
    GrLivArea: float
    FullBath: int
    Neighborhood: str

@app.get("/")
def read_root():
    return {"status": "Ames House Prediction API is live"}

@app.post("/predict")
def predict(house: HouseInput):
    if not model:
        # Fallback simulated logic for demo if model hasn't been trained/saved yet
        # Base price $50k + $20k per Qual point + $0.05 per LotArea SF
        simulated_price = 50000 + (house.OverallQual * 25000) + (house.GrLivArea * 80)
        return {"predicted_price": round(simulated_price, 2), "engine": "fallback_simulation"}
    
    data = pd.DataFrame([house.dict()])
    prediction = model.predict(data)[0]
    return {"predicted_price": float(prediction), "engine": "xgboost"}

@app.post("/explain")
def explain(house: HouseInput):
    # In a real app, logic for SHAP explanations would go here
    return {
        "top_drivers": [
            {"feature": "OverallQual", "impact": 12500},
            {"feature": "GrLivArea", "impact": 8400},
            {"feature": "Neighborhood", "impact": -2100}
        ]
    }
