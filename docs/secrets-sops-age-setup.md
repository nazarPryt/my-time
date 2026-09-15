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
  `apps/web/.env.production.enc`.

## Commands

Each app's `secrets:*` scripts (in its own `package.json`) have the
filename baked in — no path argument needed:

```bash
bun --filter api secrets:edit        # decrypt → open in $EDITOR → re-encrypt on save
bun --filter api secrets:decrypt     # print decrypted values to stdout
bun --filter api secrets:updatekeys  # re-wrap after .sops.yaml's recipients change

bun --filter web secrets:edit
bun --filter web secrets:decrypt
bun --filter web secrets:updatekeys
```

Decrypt to a real local `.env` (writes plaintext to disk):
```bash
bun --filter api secrets:decrypt > apps/api/.env
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
add it to `.sops.yaml` → `bun --filter <app> secrets:updatekeys` for
each affected file → commit.

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
