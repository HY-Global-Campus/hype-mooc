# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

Book of Serendip — an educational MOOC web app (React frontend + Express/Sequelize backend + PostgreSQL). Monorepo with `frontend/`, `backend/`, and `shared_types/` directories.

### Services

| Service | Port | How to start |
|---------|------|-------------|
| PostgreSQL 13 | 5432 | `docker run -d --name postgres-dev -e POSTGRES_USER=user -e POSTGRES_PASSWORD=password -e POSTGRES_DB=mydatabase -p 5432:5432 postgres:13` |
| Backend (Express) | 8080 | `cd backend && DATABASE_URL="postgres://user:password@localhost:5432/mydatabase" JWT_SECRET="developmentsecret" GCAI_URL="http://placeholder" GCAI_TOKEN="placeholder" npm run dev` |
| Frontend (Vite) | 5173 | `cd frontend && npx vite --host 0.0.0.0` |

### Important caveats

- **Config crash without env vars**: `backend/src/config.ts` calls `.trim()` on `GCAI_URL` and `GCAI_TOKEN` without null guards. These env vars MUST be set (even to placeholder values) or the backend will crash on startup.
- **Login is disabled**: `backend/src/controllers/login.ts` is entirely commented out. To test authenticated endpoints, generate a JWT manually: `node -e "import('jsonwebtoken').then(j => console.log(j.default.sign({displayName:'Test',id:'00000000-0000-4000-8000-000000000001',isAdmin:false},'developmentsecret')))"` (run from `backend/` directory after `npm ci`). Then create a matching user row in the database.
- **No automated tests**: The project has no test suite (`npm test` exits with error). Lint and TypeScript compilation are the main checks.
- **Pre-existing lint errors**: `npm run lint` in `frontend/` has 3 pre-existing errors and 3 warnings (irregular whitespace in `Values.tsx`, unused vars in `Mindmap/index.tsx`).

### Standard commands

- **Lint**: `cd frontend && npm run lint`
- **TypeScript check (backend)**: `cd backend && npx tsc --noEmit`
- **TypeScript check (frontend)**: `cd frontend && npx tsc --noEmit`
- **Build frontend**: `cd frontend && npm run build`

### Docker in this environment

Docker must be running before starting PostgreSQL. If dockerd is not running:
```
sudo dockerd &>/tmp/dockerd.log &
sleep 3
sudo chmod 666 /var/run/docker.sock
```
