# syntax=docker/dockerfile:1
# frontend/Dockerfile — same pattern as business-model-canvas: separate frontend pod, Express serves dist

# --- deps: install ALL deps (incl. dev) for building ---
FROM node:22-alpine AS deps
WORKDIR /app
RUN corepack enable pnpm
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# --- dev: local development with Vite dev server ---
FROM node:22-alpine AS dev
WORKDIR /app

ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}
ENV NODE_ENV=development
# World-readable corepack cache: the CMD runs pnpm as node, which cannot read root's cache.
ENV COREPACK_HOME=/usr/local/share/corepack

RUN corepack enable pnpm
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN chown -R node:node /app
USER node
CMD ["sh", "-c", "pnpm run dev --host 0.0.0.0 --port ${PORT:-5173} --strictPort"]

# --- build: compile Vite/React app to static files ---
FROM node:22-alpine AS build
WORKDIR /app

ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}
ARG VITE_OIDC_CLIENT_ID
ENV VITE_OIDC_CLIENT_ID=${VITE_OIDC_CLIENT_ID}

RUN corepack enable pnpm
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm run build

# --- runtime: serve static files with Express ---
FROM node:22-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app

RUN corepack enable pnpm && pnpm add express@4.19.2 --prod

COPY --from=build /app/dist ./dist
COPY server.js ./

EXPOSE 3000

USER node

CMD ["node", "server.js"]
