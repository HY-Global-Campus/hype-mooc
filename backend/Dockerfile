# syntax=docker/dockerfile:1
# backend/Dockerfile — dev image with watch; production uses compiled dist
FROM node:20-bookworm

# Install LibreOffice for document conversion
RUN apt-get update && \
	DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends libreoffice && \
	rm -rf /var/lib/apt/lists/*

ARG NODE_ENV

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

RUN if [ "$NODE_ENV" != "development" ]; then \
	npm prune --omit=dev; \
	fi

RUN chown -R node:node /usr/src/app

EXPOSE 8080

USER node

CMD ["sh", "-c", "if [ \"$NODE_ENV\" = \"development\" ]; then npm run dev:watch; else node dist/index.js; fi"]
