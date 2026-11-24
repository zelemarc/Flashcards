# Flashcards

An Anki-inspired flashcard app built with SvelteKit and a Python FastAPI backend.

## Requirements

- Node.js 22.17 or newer and npm
- Python 3.10 or newer

## Run locally

### 1. Start the FastAPI backend

From the repository root, create a virtual environment and install the backend dependencies:

```bash
python3 -m venv backend/venv
source backend/venv/bin/activate
python -m pip install -r backend/requirements.txt
```

Start the API from the `backend` directory so its SQLite database is created at `backend/flashcards.db`:

```bash
cd backend
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

FastAPI creates its tables and development seed data when it starts. Interactive API documentation is available at <http://127.0.0.1:8000/docs>.

### 2. Start the SvelteKit frontend

In a second terminal, from the repository root:

```bash
npm install
BACKEND_URL=http://127.0.0.1:8000 npm run dev -- --host 127.0.0.1 --port 5173
```

Open <http://127.0.0.1:5173>. `BACKEND_URL` is used by SvelteKit server-side code to contact FastAPI; if it is not set, the frontend defaults to `http://127.0.0.1:8000`.

## Authentication

Login and registration are submitted through SvelteKit server actions. The FastAPI access token is stored in an HttpOnly, SameSite=Lax cookie named `access_token`. SvelteKit checks that token against FastAPI's `/auth/me` endpoint on incoming requests. The cookie expires after 24 hours, matching the backend token lifetime.

For local development, the seed data includes this demo account:

- Email: `agnieszka@example.com`
- Password: `haslo123`

These are development-only credentials; do not use them in production.

## Production build

Build the SvelteKit Node server with:

```bash
npm run build
```

Run the built frontend with FastAPI available at the configured backend URL:

```bash
BACKEND_URL=http://127.0.0.1:8000 node build
```

Set `BACKEND_URL` to the reachable FastAPI address in your deployment environment. Keep the API URL private to the server.

## Current integration status

Authentication, the home deck tree, study-card loading and grading, card creation/editing/deletion, deck rename/privacy/copy, search, and statistics are connected to FastAPI through SvelteKit server-side requests. The example files remain as unused development fixtures. Deck settings that have no matching backend feature are still placeholders.
