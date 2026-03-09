# frontend/Dockerfile — production: build then serve with Node
FROM node:20-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/dist ./dist
RUN npm init -y && npm install serve
EXPOSE 8080
CMD ["npx", "serve", "-s", "dist", "-l", "8080"]
