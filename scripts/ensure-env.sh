#!/usr/bin/env bash
# Ensures apps/api/.env exists before `bun --filter api dev` needs it.
# Never overwrites an existing file — a dev may have customized it (their
# own DB_DATA_PATH, a real Telegram bot token, etc.). Only bootstraps it
# on a fresh clone, from the dev-safe encrypted secrets.
set -euo pipefail

if [ -f apps/api/.env ]; then
	exit 0
fi

if ! command -v sops >/dev/null 2>&1; then
	echo "apps/api/.env is missing and sops isn't installed." >&2
	echo "Install sops + age, or copy apps/api/.env.example to apps/api/.env by hand." >&2
	exit 1
fi

echo "apps/api/.env missing, bootstrapping from apps/api/.env.development.enc..."
# Call sops directly, not via `bun --filter` — its stdout gets prefixed with
# "api secrets:decrypt:dev: " on every line when it's not attached to a TTY,
# which would corrupt the .env file instead of writing clean values.
if ! sops --decrypt --input-type dotenv --output-type dotenv apps/api/.env.development.enc > apps/api/.env; then
	rm -f apps/api/.env
	echo "Failed to decrypt apps/api/.env.development.enc — is your age key a recipient in .sops.yaml?" >&2
	echo "See docs/secrets-sops-age-setup.md." >&2
	exit 1
fi

echo "Created apps/api/.env from dev-safe defaults."
