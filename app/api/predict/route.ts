import { NextRequest, NextResponse } from "next/server";

<<<<<<< HEAD
const MODEL_API_URL = process.env.MODEL_API_URL ?? "https://churn-prediction-api-yp2i.onrender.com/";
=======
const MODEL_API_URL = process.env.MODEL_API_URL ?? "https://churn-prediction-api-yp2i.onrender.com";
>>>>>>> c19061c71afe0ad5236f118479cef24d259c6724

type ChurnInput = {
  creditScore: number;
  age: number;
  tenure: number;
  balance: number;
  numOfProducts: number;
  hasCrCard: 0 | 1;
  isActiveMember: 0 | 1;
  estimatedSalary: number;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ChurnInput;

    const payload = {
      CreditScore: Number(body.creditScore),
      Age: Number(body.age),
      Tenure: Number(body.tenure),
      Balance: Number(body.balance),
      NumOfProducts: Number(body.numOfProducts),
      HasCrCard: Number(body.hasCrCard),
      IsActiveMember: Number(body.isActiveMember),
      EstimatedSalary: Number(body.estimatedSalary),
    };

    const res = await fetch(`${MODEL_API_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(text || `Model API returned ${res.status}`);
    }

    const result = await res.json();
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Prediction failed. Is the FastAPI server running on port 8000?" },
      { status: 500 }
    );
  }
}
