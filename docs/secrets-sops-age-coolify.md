# Secrets flow: SOPS + age → Coolify

Local reference only — **not committed**.

Diagrams below are drawn in the same style as
`docs/architecture/telegram-notifications-c4-component.md` — Mermaid
flowcharts (not the native `C4Component` renderer), split into separate
flows per trigger. Color key:

- 🟦 navy stadium — person (you)
- 🔵 blue box — component on your laptop
- 🟢 green box — component on Coolify (the VPS)
- 🟣 purple cylinder — datastore (something at rest)
- 🟠 amber box — sensitive key material (never leaves your laptop)

## The pieces

- **`apps/api/.env.production.enc`** — prod secrets, encrypted with SOPS,
  committed to git. Safe to have in history since it's encrypted.
- **age keypair** — a public key (encrypts) and a secret key (decrypts).
  The secret key lives only on your laptop / password manager.
- **Coolify API token** — created once in Coolify's UI (Security → API
  Tokens). Authenticates the push script to Coolify's API.
- **Push script** — the only new automation: decrypts locally, sends
  plain values to Coolify.

## Flow 1 — Edit & commit a secret

```mermaid
%%{init: {
  "theme": "base",
  "themeVariables": {
    "background": "#14161c",
    "lineColor": "#9aa5b1",
    "edgeLabelBackground": "#1c1f26",
    "textColor": "#e2e8f0",
    "fontSize": "14px"
  },
  "flowchart": { "curve": "basis", "nodeSpacing": 40, "rankSpacing": 55 }
} }%%
flowchart TB
    dev(["👤 You"])

    subgraph laptop1["Your laptop"]
        sopsEdit("sops apps/api/.env.production.enc<br/><i>CLI: decrypt → edit → re-encrypt</i>")
        ageKey1[("🔑 age secret key<br/><i>local file / keychain</i>")]
    end

    gitRepo1[("git repo<br/><i>.env.production.enc</i>")]

    dev -->|"wants to change a secret"| sopsEdit
    ageKey1 -->|"decrypts for editing"| sopsEdit
    sopsEdit -->|"git commit + push<br/>(still encrypted)"| gitRepo1

    classDef person fill:#1a365d,stroke:#63b3ed,color:#ffffff,stroke-width:1px
    classDef localComp fill:#2b6cb0,stroke:#90cdf4,color:#ffffff,stroke-width:1px
    classDef store fill:#553c9a,stroke:#b794f4,color:#ffffff,stroke-width:1px
    classDef secret fill:#9c4221,stroke:#f6ad55,color:#ffffff,stroke-width:1px

    class dev person
    class sopsEdit localComp
    class gitRepo1 store
    class ageKey1 secret

    style laptop1 fill:#1a1d24,stroke:#3d4451,color:#e2e8f0
```

## Flow 2 — Push to Coolify & deploy

```mermaid
%%{init: {
  "theme": "base",
  "themeVariables": {
    "background": "#14161c",
    "lineColor": "#9aa5b1",
    "edgeLabelBackground": "#1c1f26",
    "textColor": "#e2e8f0",
    "fontSize": "14px"
  },
  "flowchart": { "curve": "basis", "nodeSpacing": 40, "rankSpacing": 55 }
} }%%
flowchart TB
    dev2(["👤 You"])

    subgraph laptop2["Your laptop"]
        pushScript("push script<br/><i>bash: sops -d | curl</i>")
        ageKey2[("🔑 age secret key")]
        apiToken[("🔑 Coolify API token")]
    end

    gitRepo2[("git repo<br/><i>.env.production.enc</i>")]

    subgraph coolify["Coolify (VPS)"]
        envApi("Coolify API<br/><i>PATCH /applications/{uuid}/envs/bulk</i>")
        coolifyDb[("Coolify Postgres<br/><i>env vars, encrypted at rest<br/>with Coolify's own key</i>")]
        restartApi("Coolify API<br/><i>POST /applications/{uuid}/restart</i>")
        container("app container<br/><i>new process, on deploy</i>")
    end

    dev2 -->|"runs the push script"| pushScript
    gitRepo2 -->|"reads encrypted file"| pushScript
    ageKey2 -->|"decrypts locally"| pushScript
    apiToken -->|"authenticates request"| pushScript
    pushScript -->|"HTTPS: plaintext values<br/>(identical to typing into the UI)"| envApi
    envApi -->|"stores, encrypted with<br/>Coolify's own key"| coolifyDb
    pushScript -->|"triggers"| restartApi
    restartApi --> container
    coolifyDb -->|"decrypted with Coolify's own key,<br/>injected as env vars"| container

    classDef person fill:#1a365d,stroke:#63b3ed,color:#ffffff,stroke-width:1px
    classDef localComp fill:#2b6cb0,stroke:#90cdf4,color:#ffffff,stroke-width:1px
    classDef coolComp fill:#276749,stroke:#68d391,color:#ffffff,stroke-width:1px
    classDef store fill:#553c9a,stroke:#b794f4,color:#ffffff,stroke-width:1px
    classDef secret fill:#9c4221,stroke:#f6ad55,color:#ffffff,stroke-width:1px

    class dev2 person
    class pushScript localComp
    class envApi,restartApi,container coolComp
    class gitRepo2,coolifyDb store
    class ageKey2,apiToken secret

    style laptop2 fill:#1a1d24,stroke:#3d4451,color:#e2e8f0
    style coolify fill:#1a1d24,stroke:#3d4451,color:#e2e8f0
```

## Script

```bash
#!/usr/bin/env bash
set -euo pipefail

UUID="your-app-uuid"                 # from Coolify UI URL or GET /applications
TOKEN="$COOLIFY_API_TOKEN"           # your own env/keychain, never committed
HOST="https://your-coolify-domain"

sops -d --output-type json apps/api/.env.production.enc \
  | jq '[to_entries[] | {key: .key, value: (.value|tostring), is_runtime: true, is_buildtime: false}]' \
  | jq '{data: .}' \
  | curl -s -X PATCH "$HOST/api/v1/applications/$UUID/envs/bulk" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d @-

curl -s -X POST "$HOST/api/v1/applications/$UUID/restart" \
  -H "Authorization: Bearer $TOKEN"
```

## Notes

- **The age secret key and the Coolify API token both live only on your
  laptop.** Neither is ever sent to, or stored on, the VPS — Flow 2's
  laptop-side nodes are the only place either one is used.
- **Coolify's "encrypted at rest" step is unrelated to SOPS/age.** From
  Coolify's point of view, the plaintext values it receives from the push
  script are indistinguishable from values typed into its UI by hand — it
  encrypts them with its own key (Laravel `APP_KEY`), the same as it
  always has.
- **Updating stored values does not restart anything.** `PATCH
  .../envs/bulk` only changes what's stored; the separate `POST
  .../restart` call is what makes the new container actually pick up the
  changed values.
- **`VITE_API_URL` is a build-time arg**, not a runtime env var (see
  `docker-compose.prod.yml`, `web` service) — it needs `is_buildtime:
  true, is_runtime: false` when pushed. Everything else in that compose
  file is runtime-only.
