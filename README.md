# SheetMind

**AI-powered spreadsheet automation platform.** Control Microsoft Excel and Google Sheets using plain English — powered by a LangChain agent, NVIDIA NIM, and a full-stack Next.js + FastAPI architecture.

---

## Overview

SheetMind lets users connect their Excel files or Google Sheets and interact with them through a natural language query interface. A LangChain ReAct agent interprets each query, selects the appropriate tools from a typed registry of 30+ spreadsheet operations, and executes them — from writing formulas and formatting cells to generating charts and sorting data — with no manual configuration required.

---

## Features

- **Natural Language Queries** — Plain English → agent tool execution (e.g. *"Sum column B and highlight values above 500 in red"*)
- **Dual Platform Support** — Local Excel (`.xlsx`) and Google Sheets, switchable from the dashboard
- **OAuth Auto-Discovery** — Login with Google or Microsoft and your files are automatically populated
- **30+ Spreadsheet Operations** — Cell I/O, formulas, formatting, sorting, filtering, charts, pivot summaries, conditional formatting, freeze panes, data validation, and more
- **Zapier Webhook Integration** — Bidirectional: outbound event triggers and inbound query execution
- **Audit Logs** — Every query logged with tools called, tokens used, latency, and full response
- **Session Memory** — Conversational context preserved across multi-turn queries
- **Redis Caching** — LLM responses cached by query hash; invalidated on write operations
- **Async Task Queue** — Heavy operations (file parsing, webhook delivery) processed via Celery

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui, Framer Motion |
| Spreadsheet UI | AG Grid Community |
| State Management | Zustand |
| Backend API | FastAPI (Python 3.11), Uvicorn, Gunicorn |
| LLM / Agent | NVIDIA NIM (Llama 3.1 70B), LangChain (OPENAI_FUNCTIONS agent) |
| Excel Engine | openpyxl, Microsoft Graph API |
| Sheets Engine | gspread, Google Sheets API v4 |
| Authentication | NextAuth.js, JWT (python-jose, HS256), OAuth 2.0 |
| Database | Supabase (PostgreSQL 15) |
| File Storage | AWS S3 (presigned URLs, versioning enabled) |
| Cache | Upstash Redis (serverless) |
| Task Queue | Celery + Redis |
| Logging | structlog (JSON), AWS CloudWatch |
| Error Tracking | Sentry |
| Reverse Proxy | Nginx (SSL termination via Let's Encrypt) |
| Deployment | Vercel (frontend), AWS EC2 t2.micro (backend), Docker |

---

## Architecture

```
Browser (Vercel)
      │  HTTPS + JWT (httpOnly cookie)
      ▼
Nginx → FastAPI (EC2)
      │
      ├── Supabase PostgreSQL   — users, files, tokens, logs, sessions, webhooks
      ├── AWS S3                — Excel file storage (versioned)
      ├── Upstash Redis         — LLM cache + Celery task broker
      ├── NVIDIA NIM API        — LLM inference (Llama 3.1 70B)
      └── Google / Microsoft    — OAuth + Sheets / OneDrive APIs
```

**Upload flow:** Browser → FastAPI (presigned URL) → direct PUT to S3 → confirm → Celery parses metadata

**Query flow:** User query → Redis cache check → LangChain agent → tool execution → Google Sheets / S3 → log to PostgreSQL → return response

---

## Project Structure

```
sheetmind/
├── backend/
│   ├── app/
│   │   ├── main.py               # FastAPI app, middleware, router mounting
│   │   ├── config.py             # Pydantic settings (all env vars)
│   │   ├── database.py           # Supabase client
│   │   ├── redis_client.py       # Upstash Redis client
│   │   ├── s3_client.py          # boto3 S3 client
│   │   ├── routers/              # auth, files, sheets, agent, webhooks, logs, health
│   │   ├── services/             # excel, sheets, agent, auth, s3, cache, webhook, log
│   │   ├── tools/                # LangChain tool registry (file, sheet, cell, formula, data, advanced)
│   │   ├── models/               # Pydantic request/response models
│   │   ├── middleware/           # JWT auth, logging, rate limiting
│   │   └── tasks/                # Celery app, file tasks, webhook tasks
│   ├── tests/
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx              # Login (Google + Microsoft OAuth)
│   │   ├── dashboard/            # File picker with platform toggle
│   │   ├── workspace/[fileId]/   # Spreadsheet viewer + NLP query bar
│   │   ├── logs/                 # Query audit log
│   │   └── settings/             # Account, OAuth connections, webhooks
│   ├── components/
│   │   ├── dashboard/            # PlatformSelector, FileCard, FileUploadZone
│   │   ├── workspace/            # SpreadsheetViewer, QueryBar, ResultPanel, ToolCallTrace
│   │   └── shared/               # Navbar, LoadingSpinner
│   ├── lib/
│   │   ├── api.ts                # Typed fetch client for all backend endpoints
│   │   ├── auth.ts               # NextAuth config (Google + Azure AD providers)
│   │   └── store.ts              # Zustand global state
│   └── types/index.ts            # Shared TypeScript types
│
└── docker-compose.yml
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- Python 3.11+
- Docker and Docker Compose
- Accounts required (all have free tiers): Supabase, AWS, Upstash, NVIDIA NIM, Google Cloud, Azure, Sentry

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/sheetmind.git
cd sheetmind
```

### 2. Backend Setup

```bash
cd backend
python3.11 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # Fill in all values (see Environment Variables below)
```

### 3. Frontend Setup

```bash
cd frontend
npm install
cp .env.local.example .env.local  # Fill in all values
```

### 4. Run Database Migrations

In your Supabase SQL editor, run the schema file located at `backend/database/schema.sql`.

### 5. Start Development Servers

**Option A — Docker (recommended)**
```bash
# From project root
docker compose up
```
This starts the FastAPI backend (port 8000), Celery worker, and Redis.

**Option B — Manual**
```bash
# Terminal 1 — Backend
cd backend && source venv/bin/activate
uvicorn app.main:app --reload --port 8000

# Terminal 2 — Celery worker
cd backend && source venv/bin/activate
celery -A app.tasks.celery_app worker --loglevel=info

# Terminal 3 — Frontend
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

### `backend/.env`

```env
APP_ENV=development
SECRET_KEY=                        # Random 64-char string

# Supabase
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_KEY=

# AWS S3
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET_NAME=sheetmind-files
AWS_REGION=us-east-1

# Upstash Redis
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# NVIDIA NIM
NVIDIA_API_KEY=
NVIDIA_BASE_URL=https://integrate.api.nvidia.com/v1
NVIDIA_MODEL=meta/llama-3.1-70b-instruct

# OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
AZURE_AD_CLIENT_ID=
AZURE_AD_CLIENT_SECRET=
AZURE_AD_TENANT_ID=

# JWT
JWT_SECRET=                        # Random 64-char string (different from SECRET_KEY)
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=60

# Sentry
SENTRY_DSN=
```

### `frontend/.env.local`

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=                   # Random string

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
AZURE_AD_CLIENT_ID=
AZURE_AD_CLIENT_SECRET=
AZURE_AD_TENANT_ID=

NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SENTRY_DSN=
```

---

## OAuth Setup

### Google

1. Create a project at [console.cloud.google.com](https://console.cloud.google.com)
2. Enable **Google Sheets API** and **Google Drive API**
3. Create an OAuth 2.0 Client ID (Web Application)
4. Add redirect URI: `http://localhost:3000/api/auth/callback/google`
5. Required scopes: `openid email profile spreadsheets drive.readonly`

### Microsoft (Azure AD)

1. Register an app at [portal.azure.com](https://portal.azure.com) → Azure Active Directory → App Registrations
2. Add redirect URI: `http://localhost:3000/api/auth/callback/azure-ad`
3. Add Microsoft Graph permissions: `openid profile email offline_access Files.ReadWrite.All Sites.ReadWrite.All`
4. Grant admin consent

For production, add your Vercel domain to both providers' allowed redirect URIs.

---

## API Reference

Base URL: `http://localhost:8000/api/v1`  
Interactive docs: `http://localhost:8000/docs`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/{provider}/callback` | OAuth exchange → JWT |
| `GET` | `/auth/me` | Current user profile |
| `GET` | `/files` | List files (auto-syncs from Drive/OneDrive) |
| `POST` | `/files/upload-url` | Get presigned S3 upload URL |
| `POST` | `/files/confirm-upload` | Register uploaded file |
| `POST` | `/files/connect-google` | Connect existing Google Sheet |
| `POST` | `/files/connect-microsoft` | Connect existing OneDrive file |
| `GET` | `/sheets/{fileId}/info` | Sheet names and dimensions |
| `GET` | `/sheets/{fileId}/range` | Read cell range as 2D array |
| `POST` | `/sheets/{fileId}/operation` | Direct programmatic operation |
| `POST` | `/agent/query` | NLP query → agent execution |
| `GET` | `/agent/sessions/{fileId}` | Conversation history |
| `DELETE` | `/agent/sessions/{fileId}` | Clear session |
| `GET` | `/logs` | Paginated query audit log |
| `GET` | `/webhooks` | List webhook configs |
| `POST` | `/webhooks` | Create Zapier webhook |
| `POST` | `/webhooks/inbound` | Inbound Zapier execution (no auth) |
| `GET` | `/health` | Service health check |

All endpoints except `/health` and `/webhooks/inbound` require `Authorization: Bearer <jwt>`.

---

## Zapier Integration

### Outbound (SheetMind → Zapier)

1. Go to **Settings → Webhooks → Add Webhook**
2. Paste your Zapier catch hook URL
3. Select events to subscribe to: `file_created`, `sheet_edited`, `formula_applied`, `row_added`, `export_completed`
4. Copy the HMAC secret shown once on creation
5. In Zapier, verify the `X-SheetMind-Signature` header using the secret

### Inbound (Zapier → SheetMind)

Use the Zapier "Webhooks by Zapier" action to POST to:
```
POST /api/v1/webhooks/inbound
Body: { "user_id": "...", "file_id": "...", "query": "Sum column B", "signature": "..." }
```
The endpoint verifies the HMAC signature and runs the agent query on behalf of the user.

---

## Deployment

### Backend (AWS EC2)

```bash
# On your EC2 instance (Ubuntu 22.04)
git clone https://github.com/yourusername/sheetmind.git
cd sheetmind/backend

# With Docker
docker build -t sheetmind-backend .
docker compose up -d

# Configure Nginx to proxy :443 → :8000
# Run certbot for Let's Encrypt SSL
sudo certbot --nginx -d api.yourdomain.com
```

### Frontend (Vercel)

1. Push to GitHub
2. Import project at [vercel.com](https://vercel.com), set root directory to `frontend`
3. Add all `frontend/.env.local` variables in Vercel's environment settings
4. Set `NEXT_PUBLIC_API_URL` to `https://api.yourdomain.com`
5. Deploy — Vercel handles CI/CD on every push to `main`

---

## Testing

```bash
cd backend
pytest tests/ -v --asyncio-mode=auto
```

Test coverage includes: health checks, JWT auth flow, file upload/confirm, agent query with mocked LLM, webhook HMAC verification, Excel service unit tests, and Sheets service unit tests.

---

## Database Schema

Six tables in PostgreSQL: `users`, `oauth_tokens`, `files`, `query_logs`, `webhook_configs`, `agent_sessions`.

Full schema with indexes: `backend/database/schema.sql`

---

## Security

- OAuth tokens stored encrypted at rest in PostgreSQL
- JWTs issued by the backend, stored in `httpOnly` cookies on the frontend
- S3 bucket is private; all access via time-limited presigned URLs
- Inbound webhooks verified with HMAC-SHA256 before execution
- All protected routes require valid JWT; middleware rejects expired or tampered tokens
- CORS restricted to the configured frontend origin

---

## License

MIT License. See [LICENSE](./LICENSE) for details.

---

## Acknowledgements

- [NVIDIA NIM](https://build.nvidia.com) — LLM inference API
- [LangChain](https://langchain.com) — Agent orchestration framework
- [Supabase](https://supabase.com) — PostgreSQL hosting
- [Upstash](https://upstash.com) — Serverless Redis
- [AG Grid](https://ag-grid.com) — Spreadsheet rendering
