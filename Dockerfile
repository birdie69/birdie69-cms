# ── Stage 1: Builder ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

# libvips required by sharp (Strapi image processing)
RUN apk add --no-cache python3 make g++ vips-dev

WORKDIR /opt/app

COPY package*.json ./
RUN npm ci

COPY . .

# 1. Build admin panel (Vite)
RUN npm run build
# 2. Compile server TypeScript + copy JSON schemas that tsc leaves behind
RUN npm run build:server

# ── Stage 2: Runtime ──────────────────────────────────────────────────────────
FROM node:20-alpine AS runtime

RUN apk add --no-cache vips-dev

WORKDIR /opt/app

COPY --from=builder /opt/app/package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /opt/app/tsconfig.json ./tsconfig.json
COPY --from=builder /opt/app/dist ./dist
COPY --from=builder /opt/app/build ./build
COPY --from=builder /opt/app/config ./config
COPY --from=builder /opt/app/public ./public

RUN mkdir -p public/uploads

ENV NODE_ENV=production
EXPOSE 1337

CMD ["node", "node_modules/.bin/strapi", "start"]
