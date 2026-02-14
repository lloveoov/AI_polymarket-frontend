# Backend Deployment (B1)

## Overview

This document describes the B1 backend service for frontend integration testing.

## Backend Service

**Location:** `backend/`

**Stack:** Node.js + Express

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check - returns `{ ok: true, service: 'b1-backend', ts: <iso> }` |
| GET | `/` | Service info |

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 3000 |

### CORS Configuration

The backend is configured to accept requests from:
- `http://localhost:5173` (Vite dev server)
- `https://ai-polymarket-frontend.vercel.app` (Production)
- `https://ai-polymarket-frontend-*.vercel.app` (Preview deployments)

### Local Development

```bash
cd backend
npm install
npm start
```

The server will start on `http://localhost:3000`.

## Frontend Integration

### Environment Variables

To connect the frontend to the backend, set these environment variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `VITE_API_MODE` | `gateway` | Switches API to gateway mode |
| `VITE_API_BASE_URL` | `<railway-base-url>` | Base URL of the backend service |

Example:
```bash
VITE_API_MODE=gateway VITE_API_BASE_URL=https://your-backend.up.railway.app
```

## Railway Deployment

### Prerequisites

1. Install Railway CLI: `npm install -g @railway/cli`
2. Login: `railway login`
3. Create project: `railway init`

### Deployment Steps

```bash
cd backend
railway init
railway up
```

### Getting the Base URL

After deployment, get your Base URL:
```bash
railway url
```

### Set Environment Variables in Railway

```bash
railway variables set PORT=3000
```

## BLOCK Status

**Current Status:** BLOCKED

**Reason:** Railway authentication token (`RAILWAY_TOKEN`) is not available in the current environment.

**To complete deployment:**
1. Obtain a Railway token from https://railway.app/account
2. Set `RAILWAY_TOKEN` environment variable
3. Run `railway up` in the `backend/` directory
4. Update this document with the deployed Base URL
