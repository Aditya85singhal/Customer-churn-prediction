"use client";

import { useState } from "react";

type FormState = {
  creditScore: string;
  age: string;
  tenure: string;
  balance: string;
  numOfProducts: string;
  hasCrCard: boolean;
  isActiveMember: boolean;
  estimatedSalary: string;
};

const initialState: FormState = {
  creditScore: "650",
  age: "35",
  tenure: "3",
  balance: "50000",
  numOfProducts: "1",
  hasCrCard: true,
  isActiveMember: true,
  estimatedSalary: "60000",
};

type Result = { churn: number; probability: number };

export default function Home() {
  const [form, setForm] = useState<FormState>(initialState);
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creditScore: Number(form.creditScore),
          age: Number(form.age),
          tenure: Number(form.tenure),
          balance: Number(form.balance),
          numOfProducts: Number(form.numOfProducts),
          hasCrCard: form.hasCrCard ? 1 : 0,
          isActiveMember: form.isActiveMember ? 1 : 0,
          estimatedSalary: Number(form.estimatedSalary),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Prediction failed");
      }

      const data: Result = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <h1 className="text-xl font-semibold mb-1">Customer Churn Prediction</h1>
        <p className="text-sm text-neutral-500 mb-8">
          Enter customer details to estimate churn risk.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Credit Score">
            <input
              type="number"
              required
              value={form.creditScore}
              onChange={(e) => update("creditScore", e.target.value)}
              className="input"
            />
          </Field>

          <Field label="Age">
            <input
              type="number"
              required
              value={form.age}
              onChange={(e) => update("age", e.target.value)}
              className="input"
            />
          </Field>

          <Field label="Tenure (years)">
            <input
              type="number"
              required
              value={form.tenure}
              onChange={(e) => update("tenure", e.target.value)}
              className="input"
            />
          </Field>

          <Field label="Balance">
            <input
              type="number"
              step="0.01"
              required
              value={form.balance}
              onChange={(e) => update("balance", e.target.value)}
              className="input"
            />
          </Field>

          <Field label="Number of Products">
            <input
              type="number"
              min={1}
              max={4}
              required
              value={form.numOfProducts}
              onChange={(e) => update("numOfProducts", e.target.value)}
              className="input"
            />
          </Field>

          <Field label="Estimated Salary">
            <input
              type="number"
              step="0.01"
              required
              value={form.estimatedSalary}
              onChange={(e) => update("estimatedSalary", e.target.value)}
              className="input"
            />
          </Field>

          <div className="flex items-center gap-6 pt-1">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.hasCrCard}
                onChange={(e) => update("hasCrCard", e.target.checked)}
              />
              Has Credit Card
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isActiveMember}
                onChange={(e) => update("isActiveMember", e.target.checked)}
              />
              Active Member
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 rounded-md bg-neutral-900 text-white py-2.5 text-sm font-medium hover:bg-neutral-700 disabled:opacity-50 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            {loading ? "Predicting..." : "Predict Churn"}
          </button>
        </form>

        {error && (
          <p className="mt-6 text-sm text-red-600">{error}</p>
        )}

        {result && (
          <div className="mt-8 rounded-lg border border-neutral-200 dark:border-neutral-800 p-5">
            <p className="text-sm text-neutral-500 mb-1">Prediction</p>
            <p className="text-2xl font-semibold mb-2">
              {result.churn === 1 ? "Likely to Churn" : "Likely to Stay"}
            </p>
            <div className="w-full h-2 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
              <div
                className="h-full bg-neutral-900 dark:bg-white"
                style={{ width: `${(result.probability * 100).toFixed(1)}%` }}
              />
            </div>
            <p className="text-xs text-neutral-500 mt-2">
              Churn probability: {(result.probability * 100).toFixed(1)}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm text-neutral-600 dark:text-neutral-400 mb-1">
        {label}
      </span>
      {children}
    </label>
  );
}
