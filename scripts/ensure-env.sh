#!/usr/bin/env bash
# Ensures the local .env files exist before `bun run dev` needs them.
# .env files are gitignored, so a fresh clone or a new git worktree starts
# without them. Each app's dev values live encrypted in
# apps/<app>/.env.development.enc (dev-safe values only — see
# docs/secrets-sops-age-setup.md) and are decrypted here on first run.
# Never overwrites an existing file — a dev may have customized it (their
# own DB_DATA_PATH, a real Telegram bot token, etc.).
set -euo pipefail

APPS=(api web)

bootstrap_env() {
	local app="$1"
	local target="apps/$app/.env"
	local source="apps/$app/.env.development.enc"

	if [ -f "$target" ]; then
		return 0
	fi

	if ! command -v sops >/dev/null 2>&1; then
		echo "$target is missing and sops isn't installed." >&2
		echo "Install sops + age, or copy apps/$app/.env.example to $target by hand." >&2
		exit 1
	fi

	echo "$target missing, bootstrapping from $source..."
	# Call sops directly, not via `bun --filter` — its stdout gets prefixed with
	# "<app> secrets:decrypt:dev: " on every line when it's not attached to a
	# TTY, which would corrupt the .env file instead of writing clean values.
	# Decrypt to a temp file first so a failure never leaves a half-written .env.
	local tmp
	tmp="$(mktemp)"
	if ! sops --decrypt --input-type dotenv --output-type dotenv "$source" > "$tmp"; then
		rm -f "$tmp"
		echo "Failed to decrypt $source — is your age key a recipient in .sops.yaml?" >&2
		echo "See docs/secrets-sops-age-setup.md." >&2
		exit 1
	fi
	mv "$tmp" "$target"
	echo "Created $target from dev-safe defaults."
}

for app in "${APPS[@]}"; do
	bootstrap_env "$app"
done
