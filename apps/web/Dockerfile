FROM oven/bun:1-alpine AS builder
WORKDIR /app

COPY package.json bun.lock* ./
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
COPY apps/extension/package.json ./apps/extension/
COPY contracts/package.json ./contracts/
COPY packages/features/package.json ./packages/features/
# --ignore-scripts: the extension's postinstall (`wxt prepare`) needs its
# sources, which aren't copied yet — `wxt zip` below runs it anyway.
RUN bun install --ignore-scripts

COPY contracts ./contracts
COPY packages/features ./packages/features
COPY apps/api/src ./apps/api/src
COPY apps/api/tsconfig.json ./apps/api/
COPY apps/web ./apps/web
COPY apps/extension ./apps/extension

ARG VITE_API_URL=http://localhost:3000
ARG FRONTEND_WEB_URL=http://localhost:5173
ENV VITE_API_URL=$VITE_API_URL

RUN bun --filter web build:docker

# The extension zip ships inside this image, so the site always serves the
# build matching the EXTENSION_VERSION it advertises — no separate release step.
# Its URLs are baked in at build time: the web app's origin (the content script
# only talks to it — must match exactly, hence the trailing-slash trim) and the
# API including /api/v1 (the web client adds that prefix itself, the extension
# doesn't).
RUN cd apps/extension \
	&& export VITE_WEB_URL="${FRONTEND_WEB_URL%/}" \
	&& export VITE_API_URL="${VITE_API_URL%/}/api/v1" \
	&& bun --bun wxt zip \
	&& cp .output/*-chrome.zip ../web/dist/my-time-extension.zip

FROM nginx:alpine
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
