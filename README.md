# Flashcards

An Anki-inspired flashcard app built with SvelteKit, a Node.js server, and a Python FastAPI API. The frontend talks to FastAPI from server-side code; the API bearer token stays in an HttpOnly cookie rather than browser storage.

## Features

- Create and organize cards in nested decks.
- Keep decks private or make them public. Signed-in users can search and read public decks from other users; private decks are not included in other users' search results.
- View public decks read-only, see their creator's email, and copy a public deck into your own account. Copies are independent and private.
- Study new and due cards. A deck menu also offers **reshuffle & play all** and **reverse & play all** for a shuffled session with every card in the deck tree. Reverse mode puts the answer on the front and question on the back; choose it before the session starts.
- Track study statistics and change your password in Settings.

## Run with Docker

Requirements: Docker Engine/Desktop and the Docker Compose plugin.

From the repository root:

```bash
docker compose up --build
```

Open the app at <http://localhost:3000>. FastAPI's interactive docs are at <http://localhost:8000/docs>. Compose waits for the API health check before starting the frontend.

The first backend startup creates the SQLite database and development seed account. The database and generated JWT signing key are stored in the `flashcards-data` Docker volume and survive container restarts. Stop the services with `Ctrl+C` or `docker compose down`; restart them with `docker compose up`. **To permanently delete the database and signing key**, run `docker compose down -v`.

The published ports bind to localhost by default. To access the app from other devices or through a reverse proxy, change the frontend port mapping in `compose.yaml` and set the trusted browser-facing origin when building. For example:

```bash
CSRF_TRUSTED_ORIGINS=https://cards.example.com docker compose up --build
```

For multiple trusted origins, provide a comma-separated list. Only include origins you control. The default build trusts `http://localhost:3000` and `http://127.0.0.1:3000`; SvelteKit's cross-site form protection remains enabled.

Useful Docker commands:

```bash
docker compose logs -f           # follow service logs
docker compose down              # stop and remove containers
docker compose up -d             # start in the background
```

## Run locally with Node.js and Python

Requirements: Node.js 22.17 or newer, npm, and Python 3.10 or newer.

### 1. Start FastAPI

From the repository root, create a virtual environment and install the API dependencies:

```bash
python3 -m venv backend/venv
source backend/venv/bin/activate
python -m pip install -r backend/requirements.txt
```

Run the API from the `backend` directory. Its SQLite database and generated signing key will be stored there:

```bash
cd backend
venv/bin/uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

FastAPI creates the database tables and seed data at startup. API docs are available at <http://127.0.0.1:8000/docs>.

### 2. Start SvelteKit

In a second terminal, from the repository root:

```bash
npm ci
BACKEND_URL=http://127.0.0.1:8000 npm run dev -- --host 127.0.0.1 --port 5173
```

The lockfile includes public GitHub and GitLab icon packages. If `npm ci` cannot fetch them over SSH, install Git and configure HTTPS rewrites:

```bash
git config --global url."https://github.com/".insteadOf "ssh://git@github.com/"
git config --global url."https://gitlab.com/".insteadOf "ssh://git@gitlab.com/"
```

Open <http://127.0.0.1:5173>. `BACKEND_URL` is used by SvelteKit server-side code to contact FastAPI. It defaults to `http://127.0.0.1:8000`.

## Accounts and authentication

The seed data includes this development-only demo account:

- Email: `agnieszka@example.com`
- Password: `haslo123`

Use the registration form to create another account. It requires a matching password between 8 and 32 characters containing uppercase and lowercase letters, a number, and a special character. Do not use the demo account or its password for a public deployment

Login and registration are handled by SvelteKit server actions. The FastAPI JWT is stored in an HttpOnly, SameSite=Lax cookie named `access_token`, with a 24-hour lifetime. On incoming requests SvelteKit validates the token with FastAPI. Cookies are marked Secure when the browser-facing request uses HTTPS.

## Production build without Docker

Build the Node server:

```bash
npm ci
npm run build
```

Run it with FastAPI reachable from the same host or network:

```bash
BACKEND_URL=http://127.0.0.1:8000 HOST=0.0.0.0 PORT=3000 node build
```

Set `BACKEND_URL` to a private, server-reachable API URL in deployment. If the browser reaches the app through another origin, configure `CSRF_TRUSTED_ORIGINS` at build time with only the exact origins you control.

## Project layout

- `src/` — SvelteKit pages, server actions, API proxy endpoints, and UI components.
- `backend/` — FastAPI routers, authentication, SQLite models, seed data, and requirements.
- `Dockerfile` — SvelteKit Node server image.
- `backend/Dockerfile` — FastAPI image.
- `compose.yaml` — local multi-container setup with persistent data.
