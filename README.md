# Crowdsourced Idea Bank

A full-stack MVP for posting ideas, voting, commenting, following users, and real-time WebSocket messaging.

## Tech stack
- Backend: Django 5 + DRF + Channels, PostgreSQL, Redis, JWT (simplejwt), drf-spectacular
- Frontend: Next.js 14 (App Router), TypeScript, TailwindCSS, TanStack Query, WebSocket
- DevOps: Docker Compose with Daphne ASGI server

## Monorepo structure
```
/backend   Django project
/frontend  Next.js app
```

## Prerequisites
- Docker + Docker Compose
- Node 20+ (optional for local frontend without Docker)
- Python 3.12 (optional for local backend without Docker)

## Setup
1) Copy env files
```
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

2) Start services
```
docker compose up --build
```

3) Run migrations
```
docker compose exec backend python manage.py migrate
```

4) Create a superuser (optional)
```
docker compose exec backend python manage.py createsuperuser
```

5) Open the app
- Frontend: http://localhost:3000
- API Docs (Swagger): http://localhost:8000/api/docs

## Running tests
```
docker compose exec backend pytest
```

## Notes
- Tags are modeled as a `Tag` model with a many-to-many relation to `Idea` for flexible filtering and reuse.
- Auth uses access tokens in memory and refresh tokens in httpOnly cookies (set by the backend on login/refresh).

## API quickstart
All endpoints are prefixed with `/api`.

- Auth
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `POST /api/auth/refresh`
  - `GET /api/auth/me`
- Ideas
  - `GET /api/ideas`
  - `POST /api/ideas`
  - `GET /api/ideas/{id}`
  - `PATCH /api/ideas/{id}`
  - `DELETE /api/ideas/{id}`
  - `POST /api/ideas/{id}/like`
  - `GET /api/ideas/trending?days=7`
  - `GET /api/ideas/following`
- Comments
  - `GET /api/ideas/{id}/comments`
  - `POST /api/ideas/{id}/comments`
  - `DELETE /api/comments/{id}`
- Users
  - `GET /api/users`
  - `GET /api/users/{id}`
  - `POST /api/users/{id}/follow`
- Notifications
  - `GET /api/notifications`
  - `POST /api/notifications/{id}/read`
- Chat (Real-time messaging)
  - `GET /api/chat/rooms` - List all chat rooms
  - `POST /api/chat/rooms/get-or-create/` - Get or create chat with user
  - `GET /api/chat/rooms/{id}/messages/` - Get messages in room
  - `POST /api/chat/rooms/{id}/send_message/` - Send message