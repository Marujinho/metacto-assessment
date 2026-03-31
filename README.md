# Feature Voting System

A full-stack application that allows users to submit, discover, and prioritize product feature requests through a voting system. Built with Django REST Framework and React.

## Table of Contents

- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Getting Started (Local Development)](#getting-started-local-development)
- [Getting Started (Docker)](#getting-started-docker)
- [Docker Infrastructure](#docker-infrastructure)
- [API Reference](#api-reference)
- [Authentication Flow](#authentication-flow)
- [Environment Variables](#environment-variables)
- [Useful Commands](#useful-commands)
- [Troubleshooting](#troubleshooting)

## Architecture

```
Browser (:3000)
   │
   ├── Static assets ──▶ Vite dev server / nginx (production)
   │
   └── /api/* ──────────▶ Django + Gunicorn (:8000)
                              │
                              └──▶ MySQL 8 (:3306) or SQLite (local dev)
```

The frontend is a React SPA that communicates with the Django backend exclusively through REST API calls under `/api/`. In local development, Vite proxies `/api` requests to the Django dev server. In production (Docker), nginx handles this proxy.

**Two ways to run the application:**

| Mode | Database | Frontend served by | Backend served by | Best for |
|------|----------|--------------------|-------------------|----------|
| Local dev | SQLite | Vite dev server (:3000) | `manage.py runserver` (:8000) | Day-to-day development |
| Docker | MySQL 8 | nginx (:3000 → :80) | Gunicorn (:8000) | Production-like testing |

## Tech Stack

**Backend**
- Python 3.12, Django 5.1, Django REST Framework
- MySQL 8 (Docker) / SQLite (local dev)
- Session-based authentication (no JWT)
- Gunicorn (production WSGI server)

**Frontend**
- React 19, TypeScript, Vite 8
- Tailwind CSS 4
- TanStack React Query (server state management)
- React Router 7, React Hook Form, React Hot Toast
- Lucide React (icons)

**Infrastructure**
- Docker with multi-stage builds
- Docker Compose with healthchecks and dependency ordering
- nginx (production reverse proxy + SPA serving)

## Prerequisites

### For local development (without Docker)

- **Python 3.12+** with `pip`
- **Node.js 20+** with `npm`
- **Git**

### For Docker setup

- **Docker** and **Docker Compose v2**

## Project Structure

```
metacto-test/
├── backend/                    # Django project
│   ├── Dockerfile              # python:3.12-slim + gunicorn
│   ├── .dockerignore
│   ├── manage.py
│   ├── requirements.txt
│   ├── config/                 # Django settings, URLs, WSGI
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── exceptions.py       # Custom DRF exception handler
│   │   └── wsgi.py
│   ├── accounts/               # User auth (register, login, logout, CSRF)
│   │   ├── models.py           # Custom User model
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   └── features/               # Feature requests and voting
│       ├── models.py           # FeatureRequest, Vote
│       ├── services.py         # VoteService (transactional logic)
│       ├── serializers.py
│       ├── views.py
│       ├── permissions.py      # IsAuthor permission
│       └── urls.py
│
├── frontend/                   # React + Vite project
│   ├── Dockerfile              # Multi-stage: node:20-alpine → nginx:alpine
│   ├── .dockerignore
│   ├── nginx.conf              # Reverse proxy config for production
│   ├── package.json
│   ├── vite.config.ts
│   └── src/
│       ├── api.ts              # Axios instance (CSRF + 401 interceptors)
│       ├── queryClient.ts      # React Query config
│       ├── main.tsx            # App entry point
│       ├── App.tsx             # Route definitions
│       ├── context/            # AuthContext (thin, backed by React Query)
│       ├── hooks/              # React Query hooks (features, votes, auth)
│       ├── components/         # UI components (auth, features, layout, ui)
│       ├── pages/              # Route pages
│       ├── types/              # TypeScript interfaces
│       └── lib/                # Shared utilities
│
├── docker-compose.yml          # 3 services: db, backend, frontend
├── .env.example                # Environment variable template
├── .gitignore
└── README.md
```

## Getting Started (Local Development)

This setup uses SQLite as the database, so no MySQL installation is required.

### 1. Clone the repository

```bash
git clone <repository-url>
cd metacto-test
```

### 2. Set up the backend

```bash
cd backend

# Create and activate a virtual environment
python3 -m venv .venv
source .venv/bin/activate    # On Windows: .venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Run database migrations
python manage.py migrate

# Create a superuser (for Django admin access)
python manage.py createsuperuser

# Start the development server
python manage.py runserver
```

The backend will be available at `http://localhost:8000`.
The Django admin panel is at `http://localhost:8000/admin/`.

> **Note:** Without MySQL environment variables set, Django automatically falls back to SQLite. No extra database setup is needed for local development.

### 3. Set up the frontend (in a separate terminal)

```bash
cd frontend

# Install Node dependencies
npm install

# Start the Vite development server
npm run dev
```

The frontend will be available at `http://localhost:3000`.

Vite is configured to proxy all `/api/*` requests to `http://localhost:8000`, so the frontend and backend communicate seamlessly during development.

### 4. Use the application

1. Open `http://localhost:3000` in your browser.
2. Click **Sign up** to create an account.
3. After registration, log in with your credentials.
4. Click **New feature** to submit a feature request.
5. Browse and vote on features submitted by other users.

## Getting Started (Docker)

This runs the full production-like stack: MySQL 8 + Django/Gunicorn + React/nginx.

### 1. Create the environment file

```bash
cp .env.example .env
```

Edit `.env` and replace the placeholder values with real secrets:

```bash
# Generate a random Django secret key
python3 -c "import secrets; print(secrets.token_urlsafe(50))"
```

At minimum, update these three values in `.env`:

```
MYSQL_ROOT_PASSWORD=<strong-root-password>
MYSQL_PASSWORD=<strong-app-password>
DJANGO_SECRET_KEY=<generated-secret-key>
```

### 2. Build and start all services

```bash
docker compose up --build
```

This builds and starts three containers:

| Service | Image | Port | Description |
|---------|-------|------|-------------|
| **db** | `mysql:8` | 3306 | MySQL database with healthcheck |
| **backend** | `python:3.12-slim` + gunicorn | 8000 | Django REST API (waits for db to be healthy) |
| **frontend** | `node:20-alpine` build → `nginx:alpine` | 3000 | React SPA + reverse proxy to backend |

### 3. Run database migrations (first time only)

In a separate terminal, while the containers are running:

```bash
docker compose exec backend python manage.py migrate
docker compose exec backend python manage.py createsuperuser
```

### 4. Access the application

| URL | What |
|-----|------|
| `http://localhost:3000` | Frontend (React SPA) |
| `http://localhost:8000/api/` | Backend API directly |
| `http://localhost:8000/admin/` | Django admin panel |

### 5. Stop the application

```bash
docker compose down          # Stop containers (data preserved in volumes)
docker compose down -v       # Stop and remove volumes (destroys database)
```

## Docker Infrastructure

### Service dependency chain

```
db (mysql:8)
  └── healthcheck: mysqladmin ping (interval: 5s, retries: 10)
        │
        ▼  (service_healthy)
backend (gunicorn)
        │
        ▼  (depends_on)
frontend (nginx)
```

The backend only starts after MySQL passes its healthcheck. This prevents connection errors during startup.

### Backend Dockerfile

- Base image: `python:3.12-slim`
- Installs system dependencies for `mysqlclient` (gcc, libmysqlclient-dev)
- Copies `requirements.txt` first for layer caching
- Runs `collectstatic` at build time
- Serves with gunicorn (3 workers, 120s timeout)

### Frontend Dockerfile (multi-stage)

- **Stage 1 (builder)**: `node:20-alpine` — installs deps with `npm ci`, runs `npm run build`
- **Stage 2 (serve)**: `nginx:alpine` — copies built assets from stage 1, applies custom `nginx.conf`

Final image is ~48MB (only nginx + static HTML/JS/CSS).

### nginx Configuration

The `frontend/nginx.conf` does two things:

1. **`/api/*`** — reverse-proxied to `http://backend:8000` (Docker internal DNS)
2. **Everything else** — serves the React SPA with `try_files $uri $uri/ /index.html` (supports client-side routing)

### Volumes

| Volume | Purpose |
|--------|---------|
| `db_data` | Persists MySQL data across container restarts |
| `static_files` | Django collectstatic output |

## API Reference

All endpoints are under `/api/`. The API uses Django's session-based authentication with CSRF protection.

### Authentication

| Method | Endpoint         | Auth     | Description                          |
|--------|------------------|----------|--------------------------------------|
| GET    | `/api/csrf/`     | Public   | Sets `csrftoken` cookie              |
| POST   | `/api/register/` | Public   | Create a new user account            |
| POST   | `/api/login/`    | Public   | Log in (sets session cookie)         |
| POST   | `/api/logout/`   | Auth     | Log out (clears session)             |
| GET    | `/api/me/`       | Auth     | Get current user info                |

### Feature Requests

| Method | Endpoint                        | Auth       | Description                               |
|--------|---------------------------------|------------|-------------------------------------------|
| GET    | `/api/features/`                | Public     | List features (paginated, sortable)       |
| POST   | `/api/features/`                | Auth       | Create a new feature request              |
| GET    | `/api/features/{slug}/`         | Public     | Get feature detail                        |
| PATCH  | `/api/features/{slug}/`         | Owner      | Update a feature (title, description)     |
| DELETE | `/api/features/{slug}/`         | Owner      | Soft-delete a feature                     |

**Query parameters for `GET /api/features/`:**

| Param    | Values                | Default  | Description                    |
|----------|-----------------------|----------|--------------------------------|
| `page`   | integer               | 1        | Page number                    |
| `sort`   | `top`, `newest`       | `top`    | Sort by votes or creation date |
| `status` | `open`, `planned`, `in_progress`, `completed`, `declined` | all | Filter by status |
| `search` | string                | none     | Search by title                |

### Voting

| Method | Endpoint                           | Auth  | Description        |
|--------|------------------------------------|-------|--------------------|
| POST   | `/api/features/{slug}/vote/`       | Auth  | Vote on a feature  |
| DELETE | `/api/features/{slug}/vote/`       | Auth  | Remove your vote   |

**Constraints:** You cannot vote on your own feature request. Each user can only vote once per feature.

## Authentication Flow

This application uses **session-based authentication** with CSRF protection, not JWT.

```
1. Frontend loads     →  GET /api/csrf/         →  Browser receives csrftoken cookie
2. User registers     →  POST /api/register/    →  Account created (not auto-logged in)
3. User logs in       →  POST /api/login/       →  Browser receives sessionid cookie
4. Authenticated call →  POST /api/features/    →  Session cookie sent automatically
                         + X-CSRFToken header       (read from csrftoken cookie)
5. User logs out      →  POST /api/logout/      →  Session cookie cleared
```

The frontend Axios instance is configured with `withCredentials: true` and automatically reads the `csrftoken` cookie to attach the `X-CSRFToken` header on all mutating requests (POST, PUT, PATCH, DELETE).

## Environment Variables

| Variable                | Required | Default                    | Description                                 |
|-------------------------|----------|----------------------------|---------------------------------------------|
| `MYSQL_ROOT_PASSWORD`   | Docker   | -                          | MySQL root password                         |
| `MYSQL_DATABASE`        | Docker   | -                          | Database name                               |
| `MYSQL_USER`            | Docker   | -                          | Database user                               |
| `MYSQL_PASSWORD`        | Docker   | -                          | Database password                            |
| `MYSQL_HOST`            | Docker   | `127.0.0.1`               | Database host (set to `db` in compose)      |
| `MYSQL_PORT`            | No       | `3306`                     | Database port                               |
| `DJANGO_SECRET_KEY`     | Prod     | `django-insecure-dev-...`  | Django secret key                           |
| `DJANGO_DEBUG`          | No       | `1` (local) / `0` (Docker) | Enable debug mode                          |
| `ALLOWED_HOSTS`         | No       | `localhost,127.0.0.1`     | Comma-separated allowed hosts               |
| `CORS_ALLOWED_ORIGINS`  | No       | `http://localhost:3000`    | Comma-separated CORS origins                |
| `CSRF_TRUSTED_ORIGINS`  | No       | `http://localhost:3000`    | Comma-separated CSRF trusted origins        |

When no `MYSQL_DATABASE` environment variable is set, Django automatically uses SQLite, making local development possible without any database setup.

## Useful Commands

### Local development

```bash
# Backend
cd backend
source .venv/bin/activate
python manage.py runserver              # Start dev server
python manage.py migrate                # Apply migrations
python manage.py createsuperuser        # Create admin user
python manage.py shell                  # Django shell

# Frontend
cd frontend
npm run dev                             # Start Vite dev server
npm run build                           # Production build
npm run lint                            # Run ESLint
```

### Docker

```bash
docker compose up --build               # Build and start all services
docker compose up -d                    # Start in background (detached)
docker compose down                     # Stop all services
docker compose down -v                  # Stop and remove volumes (resets DB)
docker compose logs -f backend          # Follow backend logs
docker compose logs -f db               # Follow database logs
docker compose exec backend python manage.py migrate
docker compose exec backend python manage.py createsuperuser
docker compose exec backend python manage.py shell
docker compose exec db mysql -u featurevote -p featurevote  # MySQL CLI
```

## Troubleshooting

### Backend won't start in Docker ("connection refused" to MySQL)

The backend depends on the `db` service with `condition: service_healthy`. If MySQL takes too long to initialize (first run creates the database), the healthcheck may time out. Wait and try again:

```bash
docker compose down
docker compose up --build
```

### CSRF token errors (403 Forbidden)

Make sure:
1. The frontend calls `GET /api/csrf/` on mount (handled by `AuthContext`).
2. Axios is configured with `withCredentials: true`.
3. `CORS_ALLOWED_ORIGINS` and `CSRF_TRUSTED_ORIGINS` include the frontend URL.
4. The `X-CSRFToken` header is set on POST/PATCH/DELETE requests (handled by the Axios interceptor).

### "Session expired" errors during use

If a mutation returns 401, the Axios response interceptor clears the auth state and the user is prompted to log in again. This happens if the Django session expires or the backend restarts.

### Frontend shows blank page in Docker

Check that `frontend/nginx.conf` has the `try_files $uri $uri/ /index.html` fallback. Without it, client-side routes like `/features/my-feature` return 404 from nginx.

### Port conflicts

The default ports are 3000 (frontend), 8000 (backend), and 3306 (MySQL). If any are in use, either stop the conflicting service or change the host-side port in `docker-compose.yml`:

```yaml
ports:
  - "3001:80"   # Map to a different host port
```
