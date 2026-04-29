import pandas as pd
import numpy as np
import joblib
from xgboost import XGBRegressor
from sklearn.model_selection import train_test_split, KFold, cross_val_score
from sklearn.metrics import mean_squared_error, r2_score
from src.features import add_features
from src.pipeline import get_preprocessing_pipeline
import os

def train():
    print("🚀 Starting House Price Prediction Training Pipeline...")
    
    # 1. Load Data
    data_path = 'data/houses.csv'
    if not os.path.exists(data_path):
        print(f"❌ Error: {data_path} not found. Please place the Ames dataset in the data folder.")
        return

    df = pd.read_csv(data_path)
    
    # 2. Preprocessing & Feature Engineering
    df = add_features(df)
    
    # Target and Features
    target = 'SalePrice'
    X = df.drop(columns=[target, 'Id'], errors='ignore')
    y = df[target]
    
    # Log transform target
    y_log = np.log1p(y)
    
    numeric_features = X.select_dtypes(include=['int64', 'float64']).columns.tolist()
    categorical_features = X.select_dtypes(include=['object', 'category']).columns.tolist()
    
    # 3. Build Pipeline
    preprocessor = get_preprocessing_pipeline(numeric_features, categorical_features)
    
    # 4. Model Selection (XGBoost)
    model = XGBRegressor(
        n_estimators=1000,
        learning_rate=0.05,
        max_depth=6,
        subsample=0.8,
        colsample_bytree=0.8,
        n_jobs=-1,
        random_state=42
    )
    
    full_pipeline = Pipeline(steps=[
        ('pre', preprocessor),
        ('model', model)
    ])
    
    # 5. Cross-Validation
    print("📊 Evaluating model with 5-fold Cross-Validation...")
    cv = KFold(n_splits=5, shuffle=True, random_state=42)
    scores = cross_val_score(full_pipeline, X, y_log, cv=cv, scoring='neg_mean_squared_error')
    rmse_scores = np.sqrt(-scores)
    
    print(f"✅ CV RMSE: {rmse_scores.mean():.4f} (+/- {rmse_scores.std():.4f})")
    
    # 6. Final Fit & Save
    full_pipeline.fit(X, y_log)
    
    if not os.path.exists('models'):
        os.makedirs('models')
        
    joblib.dump(full_pipeline, 'models/house_price_xgb.joblib')
    print("💾 Model saved to models/house_price_xgb.joblib")

from sklearn.pipeline import Pipeline # Inner import for script demo

if __name__ == "__main__":
    train()
