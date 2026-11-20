# English quiz micro frontend. Built and deployed independently of the web
# host: shipping a quiz change only rebuilds and restarts this container.
FROM oven/bun:1-alpine AS builder
WORKDIR /app

# Only the manifests this app needs, so the install layer stays cached until
# they change.
COPY package.json bun.lock* ./
COPY packages/contracts/package.json ./packages/contracts/
COPY apps/english-quiz/package.json ./apps/english-quiz/
COPY packages/micro-frontends/package.json ./packages/micro-frontends/
RUN bun install --filter english-quiz

COPY packages/contracts ./packages/contracts
COPY packages/micro-frontends ./packages/micro-frontends
COPY apps/english-quiz ./apps/english-quiz

RUN bun --filter english-quiz build

FROM nginx:alpine
# Files live under the same path the host proxies (/remotes/english-quiz/),
# matching Vite's `base`, so URLs never need rewriting.
COPY --from=builder /app/apps/english-quiz/dist /usr/share/nginx/html/remotes/english-quiz
COPY apps/english-quiz/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=10s --timeout=3s --retries=3 \
	CMD wget -q --spider http://127.0.0.1/remotes/english-quiz/mf-manifest.json || exit 1
