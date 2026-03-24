FROM oven/bun:1-alpine
WORKDIR /app

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