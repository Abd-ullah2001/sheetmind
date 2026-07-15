# TODO - Bugfix plan (sheetmind)

## Step 1: Align auth responses with tests
- Update `backend/app/middleware/auth_middleware.py` so missing/invalid token returns **403** (tests expect 403).
- Re-run `pytest` to confirm auth-related failures drop.

## Step 2: Fix agent service/test mismatch
- Update `backend/app/services/agent_service.py` to provide `initialize_agent` (or adjust agent router/tests targets by restoring a compatibility function).

## Step 3: Fix router return shapes for Supabase mocks
- Ensure routers (`agent`, `files`, `auth`) return `res.data` correctly (never `{}`/MagicMocks).
- Particularly validate:
  - `GET /api/v1/files` returns `[]` when `res.data=[]`.
  - `DELETE /api/v1/files/{file_id}` returns 404 when `res.data` empty.
  - `GET /api/v1/agent/sessions/{file_id}` returns list.
  - `GET /api/v1/auth/me` returns object with `email`.

## Step 4: Fix health endpoint behavior under mocked Supabase exceptions
- Ensure `status` becomes `error` when supabase health query throws.

## Step 5: Fix webhook router validation + inbound auth
- Ensure `create_webhook` returns proper dict values (string fields) from `res.data[0]`.
- Ensure `inbound_webhook` authorization loop works with Supabase mock responses.

## Step 6: Re-run full test suite
- Run `cd backend && pytest -q` and iterate until green.

