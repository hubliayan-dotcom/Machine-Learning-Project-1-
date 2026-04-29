import numpy as np

def add_features(df):
    """
    Domain-informed feature engineering for house price prediction.
    """
    df = df.copy()
    
    # Calculate building age at time of hypothetical valuation (2025)
    df['Age']          = 2025 - df['YearBuilt']
    df['RemodAge']     = 2025 - df['YearRemodAdd']
    
    # Total bathrooms (Full + 0.5 * Half)
    df['BathsTotal']   = df['FullBath'] + (0.5 * df['HalfBath'])
    
    # Density metric: Rooms per square foot
    df['RoomsPerArea'] = df['TotRmsAbvGrd'] / df['GrLivArea'].replace(0, 1)
    
    # Interaction: Garage quality metric
    df['GarageScore']  = df['GarageCars'].fillna(0) * (df['GarageArea'].fillna(0) / 200)
    
    return df
