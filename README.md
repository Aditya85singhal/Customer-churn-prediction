# Churn Radar

A customer churn prediction tool. Enter a customer's account details and a
random forest model trained on historical churn data scores their
likelihood of leaving.

**Live app:** https://customer-churn-prediction-two-lime.vercel.app/

## What it does

Churn Radar takes eight signals about a customer — credit score, age,
tenure, balance, number of products, credit card ownership, activity
status, and estimated salary — and returns a churn probability along with
a risk band (low / moderate / high).

The model is a `RandomForestClassifier` (100 trees, max depth 20) trained
on the [Churn Modelling dataset](https://www.kaggle.com/datasets/shrutimechlearn/churn-modelling),
10,000 bank customer records, scaled with `StandardScaler`. It scores
~86% accuracy on a held-out test set.

## How it's built

The app is split into two deployed pieces:

| Piece | Stack | Hosted on |
|---|---|---|
| UI | Next.js (App Router), TypeScript, Tailwind CSS | Vercel |
| Model API | FastAPI, scikit-learn, joblib | Render |

The Next.js app has no ML code in it — its `/api/predict` route simply
forwards form input to the FastAPI service, which holds the trained
model in memory and returns a prediction. This split exists because
Vercel's serverless functions can't keep a model loaded in memory
between requests the way a long-running FastAPI process on Render can.

```
Browser
  │
  ▼
Next.js UI (Vercel)
  │  POST /api/predict
  ▼
Next.js API route  ──fetch──▶  FastAPI model service (Render)
                                  │
                                  ▼
                          model.pkl + scaler.pkl
                          (RandomForestClassifier)
```

## Project structure

```
my-app/
├── app/
│   ├── page.tsx              # UI: form + result
│   ├── layout.tsx            # fonts, metadata
│   ├── globals.css           # design tokens
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── RadarIllustration.tsx
│   │   └── Gauge.tsx
│   └── api/predict/route.ts  # forwards requests to the model API
├── model/
│   ├── train_model.py        # trains + saves model.pkl / scaler.pkl
│   ├── main.py                # FastAPI app (/predict, /health)
│   ├── model.pkl / scaler.pkl # trained artifacts (committed)
│   ├── requirements.txt
│   └── Dockerfile
├── render.yaml                # Render Blueprint config
└── SETUP.md                   # local + deployment instructions
```

## Running locally

See [SETUP.md](./SETUP.md) for full instructions. Short version:

```bash
# terminal 1 — model API
cd model
pip install -r requirements.txt
python train_model.py     # only needed once, or to retrain
uvicorn main:app --reload --port 8000

# terminal 2 — UI
npm install
npm run dev
```

Open http://localhost:3000.

## Deployment

- **Model API**: deployed to Render via `render.yaml` (Docker, one-click Blueprint).
- **UI**: deployed to Vercel, with `MODEL_API_URL` set as an environment
  variable pointing at the Render service.

Full walkthrough in [SETUP.md](./SETUP.md).

## Notes

- Render's free tier spins down after inactivity — the first request
  after idle can take 20–30s while it wakes back up.
- To retrain on new data, edit the CSV path in `model/train_model.py`,
  re-run it, then commit the updated `model.pkl` / `scaler.pkl`.
