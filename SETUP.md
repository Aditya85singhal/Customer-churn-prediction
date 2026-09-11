# Setup & Deployment

## Local development

**1. One-time: install deps and train the model**

```bash
cd model
pip install -r requirements.txt
python train_model.py
```

**2. Start the model API (terminal 1)**

```bash
cd model
uvicorn main:app --reload --port 8000
```

Check http://localhost:8000/health -> `{"status":"ok"}`

**3. Start the Next.js app (terminal 2)**

```bash
npm run dev
```

Open http://localhost:3000.

---

## Deploying

The two pieces deploy separately: FastAPI on Render, Next.js on Vercel.
Vercel's serverless functions can't run a long-lived process that keeps
the model loaded in memory, which is what FastAPI needs.

### 1. Push this project to GitHub

`model.pkl` and `scaler.pkl` are already committed (not gitignored) so
Render doesn't need access to your local CSV to build the model.

### 2. Deploy the model API to Render

- Go to https://render.com -> New -> Blueprint
- Point it at your repo — it will read `render.yaml` at the root and
  configure everything automatically (Docker build from `model/`,
  health check on `/health`)
- Alternatively, without the blueprint: New -> Web Service -> set
  **Root Directory** to `model`, **Runtime** to Docker
- Once deployed, Render gives you a URL like
  `https://churn-prediction-api-xxxx.onrender.com`
- Confirm it works: visit `<that-url>/health`

Note: the free plan spins down after inactivity, so the first request
after idle can take 20-30s to wake up.

### 3. Deploy the Next.js app to Vercel

- Go to https://vercel.com -> New Project -> import your repo
- In Project Settings -> Environment Variables, add:
  ```
  MODEL_API_URL = https://churn-prediction-api-xxxx.onrender.com
  ```
  (use the actual URL Render gave you)
- Deploy

That's it — the Vercel-hosted UI calls your Render-hosted model API.

### Retraining later

If you retrain locally (`python train_model.py` again), commit the
updated `model.pkl` / `scaler.pkl` and push — Render will redeploy
automatically on push if auto-deploy is on.
