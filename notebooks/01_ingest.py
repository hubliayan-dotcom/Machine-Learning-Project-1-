import pandas as pd

SCHEMA = {
    'OverallQual': 'int64', 'OverallCond': 'int64',
    'YearBuilt': 'int64',   'YearRemodAdd': 'int64',
    'GrLivArea': 'float64', 'TotalBsmtSF': 'float64',
    'LotArea': 'float64',   'GarageCars': 'float64',
    'SalePrice': 'float64', 'MSZoning': 'category',
    'Neighborhood': 'category', 'BldgType': 'category'
}

def ingest_data(file_path='data/houses.csv'):
    print(f"Loading data from {file_path}...")
    try:
        df = pd.read_csv(file_path)
        for col, dtype in SCHEMA.items():
            if col in df.columns:
                df[col] = df[col].astype(dtype)
        
        output_path = 'data/houses.parquet'
        df.to_parquet(output_path)
        print(f"Successfully exported to {output_path}")
        return df
    except FileNotFoundError:
        print("Warning: houses.csv not found in data/ folder.")
        return None

if __name__ == "__main__":
    ingest_data()
