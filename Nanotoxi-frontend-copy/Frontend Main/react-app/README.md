NanoTox Bulk Prediction React Demo

This is a small React (Vite) project that provides a UI for uploading a CSV of nanoparticle parameters and calling the backend `POST /predict/bulk` endpoint. It then fetches the processed CSV and offers it for download.

Quick start (requires Node.js >=16 and npm/yarn):

```bash
cd nanotox-ai-backend/frontend/react-app
npm install
npm run dev
# open the printed URL (default: http://localhost:5173)
```

Notes:
- The UI expects the backend at `http://localhost:5000` by default; edit the Base URL in the page if different.
- Uses `X-API-Token` header for auth. Default token used in examples: `premium_nanotox_key`.
- The backend must expose `/predict/bulk` and `/downloads/<filename>` (both present in `main.py`).

If you prefer a plain static single-file UI, see `../index.html` (already present).