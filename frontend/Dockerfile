# frontend/Dockerfile — same pattern as business-model-canvas: separate frontend pod, Express serves dist

# --- deps: install ALL deps (incl. dev) for building ---
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# --- dev: local development with Vite dev server ---
FROM node:20-alpine AS dev
WORKDIR /app

ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}
ENV NODE_ENV=development

COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173", "--strictPort"]

# --- build: compile Vite/React app to static files ---
FROM node:20-alpine AS build
WORKDIR /app

ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# --- runtime: serve static files with Express ---
FROM node:20-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app

RUN npm install express

COPY --from=build /app/dist ./dist
COPY server.js ./

EXPOSE 3000

CMD ["node", "server.js"]
