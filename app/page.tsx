"use client";

import { useState } from "react";
import Navbar from "./components/Navbar";
import RadarIllustration from "./components/RadarIllustration";
import Gauge from "./components/Gauge";

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
      setError(err.message ?? "Something went wrong. Check the model API is running.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />

      <main className="flex-1">
        <section id="predict" className="mx-auto max-w-5xl px-6 pt-16 pb-20 grid md:grid-cols-2 gap-14">
          {/* Left: description + illustration */}
          <div className="flex flex-col">
            <h1 className="font-display text-4xl md:text-[2.6rem] leading-[1.1] font-semibold max-w-sm">
              See who's about to leave before they do.
            </h1>
            <p className="mt-5 text-[var(--text-muted)] leading-relaxed max-w-sm">
              Enter a customer's account details below and a random forest
              model — trained on ten thousand historical accounts — scores
              their likelihood of churning in the next cycle.
            </p>

            <div className="mt-10 flex justify-center md:justify-start">
              <RadarIllustration />
            </div>

            <dl className="mt-10 space-y-4 max-w-sm">
              <div className="flex gap-2 text-sm">
                <dt className="text-[var(--risk-low)] shrink-0">●</dt>
                <dd className="text-[var(--text-muted)]">Low risk — likely to stay active</dd>
              </div>
              <div className="flex gap-2 text-sm">
                <dt className="text-[var(--risk-mid)] shrink-0">●</dt>
                <dd className="text-[var(--text-muted)]">Moderate — worth a retention check-in</dd>
              </div>
              <div className="flex gap-2 text-sm">
                <dt className="text-[var(--risk-high)] shrink-0">●</dt>
                <dd className="text-[var(--text-muted)]">High risk — flag for immediate outreach</dd>
              </div>
            </dl>
          </div>

          {/* Right: form + result */}
          <div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--panel)] p-6 md:p-7">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Credit score">
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
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Tenure (years)">
                    <input
                      type="number"
                      required
                      value={form.tenure}
                      onChange={(e) => update("tenure", e.target.value)}
                      className="input"
                    />
                  </Field>

                  <Field label="Products held">
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
                </div>

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

                <Field label="Estimated salary">
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
                  <label className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                    <input
                      type="checkbox"
                      className="checkbox-row"
                      checked={form.hasCrCard}
                      onChange={(e) => update("hasCrCard", e.target.checked)}
                    />
                    Has credit card
                  </label>

                  <label className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                    <input
                      type="checkbox"
                      className="checkbox-row"
                      checked={form.isActiveMember}
                      onChange={(e) => update("isActiveMember", e.target.checked)}
                    />
                    Active member
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 rounded-lg py-2.5 text-sm font-medium transition-colors disabled:opacity-50"
                  style={{ background: "var(--brand)", color: "#1a1206" }}
                >
                  {loading ? "Scoring…" : "Predict churn"}
                </button>
              </form>

              {error && <p className="mt-5 text-sm text-[var(--risk-high)]">{error}</p>}
            </div>

            {result && (
              <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--panel)] p-6 md:p-7">
                <Gauge probability={result.probability} />
              </div>
            )}
          </div>
        </section>

        <section id="about" className="border-t border-[var(--border)]">
          <div className="mx-auto max-w-5xl px-6 py-16 grid md:grid-cols-3 gap-8">
            <h2 className="font-display text-xl font-semibold md:col-span-1">
              How it works
            </h2>
            <div className="md:col-span-2 grid sm:grid-cols-3 gap-8 text-sm">
              <Step
                n="1"
                title="Eight signals"
                text="Credit score, age, tenure, balance, product count, card ownership, activity, and salary."
              />
              <Step
                n="2"
                title="Same scale, always"
                text="Every value is standardized the same way the training data was, so the model reads it consistently."
              />
              <Step
                n="3"
                title="Random forest score"
                text="A forest of 100 trees votes on the outcome; the share that vote 'churn' becomes the probability shown above."
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--border)]">
        <div className="mx-auto max-w-5xl px-6 py-8 text-sm text-[var(--text-faint)] flex flex-wrap items-center justify-between gap-4">
          <span>Churn Radar — a personal ML project.</span>
          <a
            href="https://github.com/Aditya85singhal/Customer-churn-prediction"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[var(--text-muted)] transition-colors"
          >
            Source on GitHub
          </a>
        </div>
      </footer>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm text-[var(--text-muted)] mb-1.5">{label}</span>
      {children}
    </label>
  );
}

function Step({ n, title, text }: { n: string; title: string; text: string }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <span
          className="flex items-center justify-center w-5 h-5 rounded-full text-[11px] font-medium shrink-0"
          style={{ background: "var(--panel-raised)", color: "var(--text-muted)" }}
        >
          {n}
        </span>
        <h3 className="font-medium">{title}</h3>
      </div>
      <p className="text-[var(--text-muted)] leading-relaxed">{text}</p>
    </div>
  );
}
