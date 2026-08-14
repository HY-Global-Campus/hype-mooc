# syntax=docker/dockerfile:1
# backend/Dockerfile — dev image with watch; production uses compiled dist
FROM node:22-bookworm

# Install LibreOffice for document conversion
RUN apt-get update && \
	DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends libreoffice && \
	rm -rf /var/lib/apt/lists/*

ARG NODE_ENV

WORKDIR /usr/src/app

# World-readable corepack cache: the CMD runs pnpm as node, which cannot read root's cache.
ENV COREPACK_HOME=/usr/local/share/corepack
RUN corepack enable pnpm

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

RUN if [ "$NODE_ENV" != "development" ]; then \
	pnpm prune --prod; \
	fi

RUN chown -R node:node /usr/src/app

EXPOSE 8080

USER node

CMD ["sh", "-c", "if [ \"$NODE_ENV\" = \"development\" ]; then pnpm run dev:watch; else node dist/index.js; fi"]
