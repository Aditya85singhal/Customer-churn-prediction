"""
Trains the same model as Customer_churn.ipynb and saves it to disk
so the Next.js app can use it for predictions.

Run this once (and again any time you want to retrain):
    python train_model.py
"""

import pandas as pd
import joblib
from pathlib import Path
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

# Same source file used in the notebook
CSV_PATH = r"C:\Users\singh\Downloads\archive (2)\Churn_Modelling.csv"

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

def main():
    dataset = pd.read_csv(CSV_PATH)
    dataset = dataset.drop(columns=["CustomerId", "Surname", "Geography", "Gender", "RowNumber"])

    x = dataset[FEATURES]
    y = dataset["Exited"]

    scaler = StandardScaler()
    scaler.fit(x)
    x_scaled = pd.DataFrame(scaler.transform(x), columns=x.columns)

    x_train, x_test, y_train, y_test = train_test_split(
        x_scaled, y, test_size=0.3, random_state=42
    )

    model = RandomForestClassifier(n_estimators=100, max_depth=20, random_state=72)
    model.fit(x_train, y_train)

    train_acc = model.score(x_train, y_train) * 100
    test_acc = model.score(x_test, y_test) * 100
    print(f"Train accuracy: {train_acc:.2f}%")
    print(f"Test accuracy:  {test_acc:.2f}%")

    out_dir = Path(__file__).parent
    joblib.dump(model, out_dir / "model.pkl")
    joblib.dump(scaler, out_dir / "scaler.pkl")
    print(f"Saved model.pkl and scaler.pkl to {out_dir}")

if __name__ == "__main__":
    main()
