FROM oven/bun:1-alpine
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
COPY contracts/package.json ./contracts/
RUN bun install

# Copy source
COPY contracts ./contracts
COPY apps/api ./apps/api

EXPOSE 3000
CMD ["bun", "run", "apps/api/src/index.ts"]