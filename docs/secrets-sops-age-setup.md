# SOPS + age — command reference

Companion to `docs/secrets-sops-age-coolify.md` (the *why*). This is
*what exists* and *the commands*.

## What exists

- age secret key: `~/.config/sops/age/keys.txt` (`chmod 600`). Never
  commit or share it — it's the only copy. Back it up in a password
  manager.
- Public key: `age1jkgzke64v5y5v33ggfm2fyksgdp40nh74evvykgcv46xw6zl75vqtvnjnt`
- `.sops.yaml` (repo root): one rule, matches any `*.env.<env>.enc` file,
  encrypts to the public key above.
- `.gitignore`: `!*.env.*.enc` exempts those files from the blanket
  `.env*` ignore.
- Encrypted files: `apps/api/.env.production.enc`,
  `apps/web/.env.production.enc`, `apps/api/.env.development.enc`.
- `apps/api/.env.development.enc` holds **dev-safe** values only — shared
  team defaults (local DB creds, a throwaway JWT secret), never real prod
  secrets. `TELEGRAM_BOT_TOKEN` is a placeholder; the bot just fails to
  authenticate on startup and logs an error, it doesn't crash the API.
  `apps/web` has no dev file — `VITE_API_URL` already defaults to
  `http://localhost:3000` in code, nothing to fill in locally.

## Onboarding a new dev

```bash
bun --filter api secrets:decrypt:dev > apps/api/.env
bun run dev
```

That's the whole setup, once your age key is a recipient in `.sops.yaml`
(see "Team" below) — no hand-filling `.env.example`.

## Commands

Each app's `secrets:*` scripts (in its own `package.json`) have the
filename baked in — no path argument needed. `api` has two env files, so
its scripts are explicitly suffixed `:prod` / `:dev`. `web` only has a
prod file, so its scripts stay unsuffixed — nothing to disambiguate:

```bash
bun --filter api secrets:edit:prod       # decrypt → open in $EDITOR → re-encrypt on save
bun --filter api secrets:decrypt:prod    # print decrypted values to stdout
bun --filter api secrets:updatekeys:prod # re-wrap after .sops.yaml's recipients change

bun --filter api secrets:edit:dev        # same, but for .env.development.enc
bun --filter api secrets:decrypt:dev
bun --filter api secrets:updatekeys:dev

bun --filter web secrets:edit
bun --filter web secrets:decrypt
bun --filter web secrets:updatekeys
```

Decrypt to a real local `.env` (writes plaintext to disk):
```bash
bun --filter api secrets:decrypt:dev > apps/api/.env    # local dev
bun --filter api secrets:decrypt:prod > apps/api/.env   # prod values (rare — only if you mean it)
```

`$EDITOR` unset → sops opens `vim`. Set `export EDITOR=nano` (or your
editor) in `~/.zshrc` to change it.

## Adding a file for another app

```bash
cat > apps/<app>/.env.production.enc <<'EOF'
SOME_KEY=CHANGE_ME
EOF
sops --encrypt --input-type dotenv --output-type dotenv --in-place apps/<app>/.env.production.enc
```
Then copy the three `secrets:*` script lines into that app's
`package.json` (see `apps/api/package.json`).

## Team

**Add someone:** they run `age-keygen`, send you their public key →
add it to `.sops.yaml` → run `secrets:updatekeys` (or `:prod`/`:dev` for
`api`, since it has two files) for each affected file → commit.

**Scope someone to one app only** (e.g. `web`-only, no `api` access):
split the one general rule into a specific rule first, general rule
after — SOPS uses the *first* matching rule, so order matters:
```yaml
creation_rules:
  - path_regex: apps/web/\.env\.[^/]+\.enc$
    age: age1jkgzke64v5y5v33ggfm2fyksgdp40nh74evvykgcv46xw6zl75vqtvnjnt,age1theirpublickey...
  - path_regex: \.env\.[^/]+\.enc$
    age: age1jkgzke64v5y5v33ggfm2fyksgdp40nh74evvykgcv46xw6zl75vqtvnjnt
```
Then only `bun --filter web secrets:updatekeys` — `api`'s file and
recipients are untouched.

**Remove someone:** drop their key from `.sops.yaml` →
`secrets:updatekeys` again. This does **not** revoke what they already
saw — they can still decrypt old commits with their own key. Rotate any
value that was live during their access (`JWT_SECRET`,
`POSTGRES_PASSWORD`, etc.) — don't just re-encrypt with the same values.
