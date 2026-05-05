# ParamAI - Deployment Guide

## Vercel Deployment Instructions

### 1. Backend (Railway)

Deploy the FastAPI backend to Railway:

1. Go to [railway.app](https://railway.app) and sign up/login
2. Create a new project → "Deploy from GitHub"
3. Connect your GitHub repo containing `backend/`
4. Set environment variables:
   - `ANTHROPIC_API_KEY` = your actual API key
   - `MODEL_NAME` = `claude-haiku-4-5-20251001`
   - `CONFIDENCE_THRESHOLD` = `0.80`
   - `MAX_CANDIDATES` = `3`
5. Railway will auto-detect FastAPI and install dependencies
6. Note your Railway deployment URL (e.g., `https://paramai-backend.railway.app`)

### 2. Frontend (Vercel)

Deploy the Next.js frontend to Vercel:

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Create a new project → "Import Git Repository"
3. Connect your GitHub repo
4. Set environment variables:
   - `NEXT_PUBLIC_API_URL` = your Railway backend URL (e.g., `https://paramai-backend.railway.app`)
5. Deploy!

### 3. Update Frontend Environment

After getting Railway URL, update frontend's vercel environment:
- `NEXT_PUBLIC_API_URL` = your Railway URL

---

## Local Development

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## Project Structure

```
paramai/
├── backend/           # FastAPI backend
│   ├── main.py       # Entry point
│   ├── routers/      # API endpoints
│   ├── services/     # Business logic
│   └── data/         # BPOM rules JSON
│
├── frontend/         # Next.js 14 frontend
│   ├── app/          # Pages
│   ├── components/   # UI components
│   └── lib/          # API client & types
│
└── README.md         # This file
```

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/categories` | GET | List BPOM categories |
| `/recommend` | POST | Full classification |
| `/recommend/history` | GET | Query history |

---

## Competition

**AI Open Innovation Challenge 2026**
- Team: Group 1, President University
- Case: PT TUV Nord Indonesia (Healthcare Track - Case 4)