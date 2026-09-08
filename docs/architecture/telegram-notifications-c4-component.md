# Telegram Notifications — C4 Component Diagram

Scope: the Permesso Status feature's Telegram integration — linking a Telegram
account to a user, and delivering check-result notifications to it. Two
sub-flows are shown separately since they run on different triggers.

Diagrams below are C4 **component**-level (Person / Container / Component /
external System), drawn as Mermaid flowcharts rather than Mermaid's native
`C4Component` type — that renderer has poor contrast and messy auto-layout
once a diagram has more than a handful of nodes. Color key:

- 🟦 navy stadium — person (actor)
- 🔵 blue box — web (apps/web) component
- 🟢 green box — API (apps/api) component
- 🟣 purple cylinder — datastore
- ⬡ gray hexagon — external system

## Flow 1 — Account linking

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
    user(["👤 User<br/><i>signed-in dashboard user</i>"])

    subgraph web1["Web SPA (apps/web)"]
        telegramCard("TelegramCard<br/><i>React component</i>")
        permessoStore("usePermessoStore<br/><i>Zustand store</i>")
        linkStream("telegram-link-stream<br/><i>SSE client</i>")
    end

    subgraph api1["API (apps/api, Elysia)"]
        routes("permesso routes<br/><i>Elysia plugin</i>")
        service("permessoService")
        linkEvents("telegram-link-events<br/><i>Postgres LISTEN/NOTIFY<br/>+ local EventEmitter</i>")
        bot("telegram-bot<br/><i>node-telegram-bot-api</i>")
        repo("permessoRepository<br/><i>Drizzle repository</i>")
    end

    db[("Postgres<br/>permesso_subscriptions")]
    telegram{{"Telegram Bot API"}}

    user -->|"clicks 'Connect Telegram'"| telegramCard
    telegramCard --> permessoStore
    permessoStore -->|"POST /telegram-link"| routes
    routes --> service
    service -->|"setTelegramLinkToken"| repo
    repo --> db
    service -->|"buildTelegramDeepLink"| bot
    permessoStore -->|"opens deep link"| telegram
    permessoStore --> linkStream
    linkStream -->|"GET /telegram-link-events (SSE)"| routes

    user -->|"taps 'Start' in chat"| telegram
    telegram -->|"webhook POST (prod)"| routes
    routes --> bot
    telegram -.->|"long polling (dev/test)"| bot
    bot -->|"linkTelegramChat"| repo
    bot -->|"notifyTelegramLinked"| linkEvents
    linkEvents -->|"NOTIFY"| db
    db -->|"LISTEN (fan-out to every instance)"| linkEvents
    linkEvents --> routes
    routes -->|"SSE event: connected"| linkStream
    linkStream --> permessoStore
    bot -->|"reply: connected"| telegram

    classDef person fill:#1a365d,stroke:#63b3ed,color:#ffffff,stroke-width:1px
    classDef webComp fill:#2b6cb0,stroke:#90cdf4,color:#ffffff,stroke-width:1px
    classDef apiComp fill:#276749,stroke:#68d391,color:#ffffff,stroke-width:1px
    classDef store fill:#553c9a,stroke:#b794f4,color:#ffffff,stroke-width:1px
    classDef ext fill:#4a5568,stroke:#cbd5e0,color:#ffffff,stroke-width:1px

    class user person
    class telegramCard,permessoStore,linkStream webComp
    class routes,service,linkEvents,bot,repo apiComp
    class db store
    class telegram ext

    style web1 fill:#1a1d24,stroke:#3d4451,color:#e2e8f0
    style api1 fill:#1a1d24,stroke:#3d4451,color:#e2e8f0
```

## Flow 2 — Check-result notification

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
    user2(["👤 User"])

    subgraph web2["Web SPA (apps/web)"]
        permessoStore2("usePermessoStore<br/><i>Zustand store</i>")
    end

    subgraph api2["API (apps/api, Elysia)"]
        routes2("permesso routes<br/><i>Elysia plugin</i>")
        service2("permessoService")
        jobs("jobs (Cron)<br/><i>croner + p-limit, hourly</i>")
        checker("checker<br/><i>checkPermessoStatus()</i>")
        repo2("permessoRepository<br/><i>Drizzle repository</i>")
        bot2("telegram-bot<br/><i>sendTelegramCheckResult()</i>")
    end

    db2[("Postgres<br/>subscriptions + check history")]
    telegram2{{"Telegram Bot API"}}
    permitSite{{"Permit status website"}}

    user2 -->|"clicks 'Check now' (optional)"| permessoStore2
    permessoStore2 -->|"POST /permesso/check"| routes2
    routes2 --> service2
    jobs -->|"listAll (due this hour)"| repo2
    service2 -->|"checkPermessoStatus"| checker
    jobs -->|"checkPermessoStatus"| checker
    checker -->|"fetch / scrape"| permitSite
    service2 -->|"recordCheckResult"| repo2
    jobs -->|"recordCheckResult"| repo2
    repo2 --> db2
    service2 -.->|"if telegramChatId set"| bot2
    jobs -.->|"if telegramChatId set"| bot2
    bot2 -->|"sendMessage"| telegram2
    telegram2 -->|"message delivered"| user2

    classDef person fill:#1a365d,stroke:#63b3ed,color:#ffffff,stroke-width:1px
    classDef webComp fill:#2b6cb0,stroke:#90cdf4,color:#ffffff,stroke-width:1px
    classDef apiComp fill:#276749,stroke:#68d391,color:#ffffff,stroke-width:1px
    classDef store fill:#553c9a,stroke:#b794f4,color:#ffffff,stroke-width:1px
    classDef ext fill:#4a5568,stroke:#cbd5e0,color:#ffffff,stroke-width:1px

    class user2 person
    class permessoStore2 webComp
    class routes2,service2,jobs,checker,repo2,bot2 apiComp
    class db2 store
    class telegram2,permitSite ext

    style web2 fill:#1a1d24,stroke:#3d4451,color:#e2e8f0
    style api2 fill:#1a1d24,stroke:#3d4451,color:#e2e8f0
```

## Notes

- **Inbound updates run in dual mode**, decided once at startup by
  `NODE_ENV`: when `NODE_ENV=production`, `startTelegramBot()` registers a
  webhook via `bot.api.setWebhook()` (then confirms it with
  `getWebhookInfo()`) and Telegram pushes updates to `POST /telegram/webhook`,
  authenticated by the `X-Telegram-Bot-Api-Secret-Token` header matching
  `TELEGRAM_WEBHOOK_SECRET` (required in production). In development or test,
  it falls back to `bot.startPolling()` so contributors don't need a public
  tunnel to test the bot. Both paths converge on the same
  `bot.handleUpdate()` — the `/start <token>` handler logic is unchanged
  either way. A failure to register the webhook (bad URL, Telegram outage) is
  caught and logged rather than crashing the API's startup — the process
  boots with Telegram notifications disabled instead.
- **Linking** bridges the inbound update handler (webhook or polling) to the
  SSE route the browser is waiting on via Postgres `LISTEN`/`NOTIFY`
  (`telegram-link-events.ts`), not a bare in-process `EventEmitter`.
  `notifyTelegramLinked(userId)` runs `pg_notify('telegram_linked', userId)`;
  every API instance opens one `LISTEN telegram_linked` connection at startup
  (`startTelegramLinkListener()`, awaited before the server accepts
  requests) and re-emits locally to wake only the SSE requests it is holding
  open. This is what makes linking correct when the webhook request and the
  waiting SSE connection land on different replicas — the previous
  bare-`EventEmitter` version only worked within a single process.
- **Notifications** fire from two independent call paths — the manual
  `POST /permesso/check` route and the hourly `croner` job — both of which
  converge on the same `checker` → `repository` → `telegram-bot` sequence.
- If `TELEGRAM_BOT_TOKEN` is not configured, `telegram-bot.ts` no-ops: the
  bot never starts, deep links can't be built, and `sendTelegramCheckResult`
  is a silent no-op. If `API_URL` is public but `TELEGRAM_WEBHOOK_SECRET` is
  missing, the bot also refuses to start (it will not run an unauthenticated
  webhook), logging an error instead.
