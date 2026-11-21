# Pinned to CI's BUN_VERSION (.github/workflows/ci.yml); bump both together.
FROM oven/bun:1.4.2-alpine
WORKDIR /app

# Chromium + runtime libs for Puppeteer (permesso status checker). Alpine's own
# chromium build is used instead of puppeteer's bundled download, which targets
# glibc and won't run on musl.
RUN apk add --no-cache \
	chromium \
	nss \
	freetype \
	freetype-dev \
	harfbuzz \
	ca-certificates \
	ttf-freefont

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Copy workspace manifests first — bun install layer is cached until these change
COPY package.json bun.lock* ./
COPY apps/api/package.json ./apps/api/
COPY packages/contracts/package.json ./packages/contracts/
# Root workspaces list this path exactly, so bun needs its manifest to exist.
COPY apps/extensions/browser/package.json ./apps/extensions/browser/
# Migrations run from code (drizzle-orm), so dev tools like drizzle-kit aren't needed.
RUN bun install --filter api --production

# Copy source
COPY packages/contracts ./packages/contracts
COPY apps/api ./apps/api

# Run unprivileged; the checker writes error screenshots to ./screenshots.
RUN mkdir -p screenshots && chown bun:bun screenshots
USER bun

EXPOSE 3000
CMD ["bun", "run", "apps/api/src/index.ts"]