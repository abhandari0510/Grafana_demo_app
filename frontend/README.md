# Frontend (React + Vite)

## Run
```bash
cp .env.example .env
npm install
npm run dev -- --host
```

The frontend proxies `/api/*` traffic to `VITE_BACKEND_PROXY_TARGET` (default `http://localhost:8080`).

## Logging
Frontend logs are standardized and emitted as structured JSON lines with these fields:
- `timestamp`
- `level`
- `service`
- `requestId`
- `logger`
- `message`

The frontend generates and sends `X-Request-ID` on API calls to correlate with backend logs.
