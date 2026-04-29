# House Price Prediction using Regression Models

> **End-to-end Machine Learning Portfolio Project**
> Featuring XGBoost Regression, Optuna Hyperparameter Tuning, SHAP Explainability, and a FastAPI Serving Layer.

## 1. Project Overview
House Price Prediction is a supervised machine learning project that estimates the sale price of a residential property from its physical and locational features. This project is built using the **Ames Housing Dataset** (1,460 rows, 79 features) and is meant to serve as a high-quality "proof of work" for Data Science, ML Engineering, and Analyst roles.

### 1.1 Problem Statement
Real estate pricing is traditionally done by human appraisers, which introduces 20-30% error margins, inconsistency, and time delays. This project solves this by learning patterns from historical sales data and producing fast, consistent price estimates using state-of-the-art gradient boosting algorithms.

### 1.2 Business Impact
- **Real Estate Portals:** Automated listing price suggestions (iBuyer programs).
- **Banks & Lenders:** Collateral valuation and loan underwriting review.
- **Investors:** Renovation ROI calculation and market timing.

---

## 2. Tech Stack
| Category | Tool / Library |
| :--- | :--- |
| **Language** | Python 3.11+ |
| **Data Mastery** | Pandas, NumPy, PyArrow (Parquet) |
| **Visualization** | Matplotlib, Seaborn, Recharts (Web UI) |
| **ML Framework** | Scikit-learn, XGBoost |
| **Optimization** | Optuna (40-trial Automated Tuning) |
| **Explainability** | SHAP (Shapley Additive Explanations) |
| **Serving** | FastAPI + Uvicorn |
| **Frontend** | React + Tailwind + Motion (Portfolio Dashboard) |

---

## 3. Results & Performance
The model was evaluated using 5-fold Cross-Validation (Shuffle=True, RandomState=42).

| Model | RMSE (Target Variable) | R² Score |
| :--- | :--- | :--- |
| Linear Regression | ~$34,800 | 0.81 |
| Ridge (alpha=5) | ~$29,600 | 0.87 |
| Random Forest | ~$22,100 | 0.92 |
| **XGBoost (Optuna Tuned)** | **$18,430** | **0.942** |

*Note: RMSE (Root Mean Squared Error) is our primary metric as it penalizes large pricing errors more heavily, which is critical in real estate.*

---

## 4. Key Features & Engineering
- **Domain Derived Features:** 
  - `Age`: Time since construction (2025 - YearBuilt).
  - `BathsTotal`: Total weighted bathrooms (Full + 0.5 * Half).
  - `RoomsPerArea`: Room density per sq. ft.
  - `GarageScore`: Interaction between car capacity and area.
- **Robust Pipeline:** Uses `ColumnTransformer` with `PowerTransformer` (Yeo-Johnson) for skew correction and `OneHotEncoder` for handling categorical features at inference.
- **Outlier Strategy:** Removed top 1% of `GrLivArea` and `LotArea` to prevent model distortion.

---

## 5. Model Explainability
This project goes beyond "black box" modeling using **SHAP**. 
- **Top Driver:** `OverallQual` (Material and finish quality).
- **Secondary Driver:** `GrLivArea` (Living area square footage).
- **Local Insight:** For individual predictions, the model explains exactly how much each feature (e.g., Neighborhood, YearBuilt) pushed the price up or down.

---

## 6. Project Structure
```bash
house-price-prediction/
├── data/                  # Raw and processed Parquet files
├── notebooks/             # EDA and Ingestion scripts
├── serving/               # FastAPI /predict and /explain endpoints
├── src/                   # Core ML Logic (Pipeline, Features)
├── models/                # Trained .joblib artifacts
├── outputs/               # Visualizations (Actual vs Predicted, SHAP)
├── package.json           # Frontend dependencies
├── main.py                # Entry point for training
└── README.md              # Project documentation
```

---

## 7. Getting Started

### Prerequisites
- Python 3.11+
- Node.js (for Dashboard)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/house-price-prediction-ml.git
   cd house-price-prediction-ml
   ```

2. Setup Python environment and install dependencies:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. Run the training pipeline:
   ```bash
   python notebooks/01_ingest.py
   python main.py
   ```

4. Start the API Server:
   ```bash
   uvicorn serving.app:app --reload --port 8000
   ```

5. (Optional) Run the Dashboard:
   ```bash
   npm install
   npm run dev
   ```

---

## 8. API Endpoints
- **GET** `/` : API Health Check.
- **POST** `/predict` : Takes JSON house features and returns price.
- **POST** `/explain` : Returns SHAP feature importance for the prediction.

---

## 9. Future Roadmap
- [ ] Implement Docker containerization for the API.
- [ ] Add a Stacking Regressor (Ridge + XGBoost).
- [ ] Deploy to Cloud Run for public accessibility.

---
**Author:** [Your Name/Email]  
**License:** Apache-2.0
