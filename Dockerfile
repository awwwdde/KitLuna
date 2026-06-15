# Гостевой Dockerfile для платформы awwwdde.
# Контракт: слушает порт 8080, отвечает 200 на GET /healthz.
# kitluna — статический Vite/React сайт: собираем в dist/ и отдаём через nginx.

# ── build ────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

# Сначала манифесты — слой с npm install кешируется, пока зависимости не менялись.
# npm install (а не ci): lock-файлы могут не содержать Linux-вариантов нативных
# пакетов (sharp/rollup), install спокойно дозаписывает их внутри образа.
COPY package.json package-lock.json* pnpm-lock.yaml* ./
RUN npm install --no-audit --no-fund

COPY . .
RUN npm run build

# ── runtime ───────────────────────────────────────────────────────────────────
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 8080
