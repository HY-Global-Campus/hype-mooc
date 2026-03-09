# Hype MOOC

Course design canvas application for the University of Helsinki MOOC flow.

This repository contains:

- a React + Vite frontend in `frontend/`
- an Express + Sequelize backend in `backend/`
- a Postgres database for local development

## What the app does

The app guides a user through a course design canvas with:

- assignment and part pages
- structured course design exercises
- a chatbot-assisted ILO workflow
- autosaved answers
- a share page that generates a read-only public view link

## Repository layout

- `frontend/`: React app, routes, exercise components, content copy
- `backend/`: Express API, auth, chatbot proxy, persistence
- `shared_types/`: shared exercise type definitions
- `docs/`: old notes and implementation documents

## Current behavior worth knowing

- Login is currently development-only mock auth.
  Any non-empty username and password will create or reuse a user.
- The frontend has a public read-only share view at `/view/:userId`.
- The chatbot depends on external `GCAI_*` environment variables on the backend.

## Prerequisites

For local development without Docker:

- Node.js 20+
- npm
- PostgreSQL

For Docker-based development:

- Docker Desktop or recent Docker Engine
- Docker Compose v2 with `develop.watch` support

## Quick start with Docker

This is the easiest way to run the full stack locally.

1. Create environment variables for the chatbot API. At minimum:

```bash
cp example.env .env.local
```

Then set values in `.env.local`:

```env
GCAI_URL=...
GCAI_TOKEN=...
# Optional if 8081 is not suitable
# BACKEND_PORT=8080
```

2. Export them into your shell before starting Compose:

```bash
set -a
source .env.local
set +a
```

3. Start the stack:

```bash
docker compose up --build
```

The services will be available at:

- frontend: `http://localhost:5173`
- backend: `http://localhost:${BACKEND_PORT:-8081}`
- postgres: `localhost:5432`

## Manual local development

### 1. Start PostgreSQL

Create a database matching the backend connection string you want to use.

Example:

```env
DATABASE_URL=postgres://user:password@localhost:5432/mydatabase
```

### 2. Start the backend

The backend does not currently auto-load a `.env` file by itself. Export the variables in your shell before running it.

Required variables:

- `DATABASE_URL`
- `JWT_SECRET`
- `GCAI_URL`
- `GCAI_TOKEN`

Example:

```bash
export DATABASE_URL=postgres://user:password@localhost:5432/mydatabase
export JWT_SECRET=developmentsecret
export GCAI_URL=...
export GCAI_TOKEN=...
```

Then install and run:

```bash
cd backend
npm install
npm run dev
```

The backend serves on `http://localhost:8080` by default.

### 3. Start the frontend

The frontend reads `VITE_API_URL` from `frontend/.env`.

Default local value:

```env
VITE_API_URL=http://127.0.0.1:8080
```

Install and run:

```bash
cd frontend
npm install
npm run dev
```

The frontend serves on `http://localhost:5173`.

## Useful scripts

### Frontend

```bash
cd frontend
npm run dev
npm run build
npm run lint
```

### Backend

```bash
cd backend
npm run dev
npm run dev:watch
npm run build
```

## API notes

Main backend routes:

- `POST /login`: mock login for development
- `POST /chatbot/completion`: authenticated chatbot completion endpoint
- `GET /course/share/:userid`: public read-only course share endpoint
- `/course/*`: authenticated course CRUD routes

## Troubleshooting


### Share page loads but no data appears

Check:

- the backend is running
- the shared course exists for that user
- the frontend is pointing to the correct `VITE_API_URL`

### Backend crashes on startup with env errors

Make sure all required env vars are exported in the shell before running `npm run dev`.

### Chatbot requests fail

Check `GCAI_URL` and `GCAI_TOKEN`.

## Notes

- `frontend/README.md` is intentionally minimal and points back to this file.
- `docs/readme.md` contains older internal notes and is not the main setup guide.
