---
name: mock.module pattern for external-dependency modules
description: How to mock checker.ts/telegram-bot.ts-style modules with bun:test's mock.module, including testing a real branch the mock otherwise hides
type: project
---

When a feature module wraps a real external dependency (headless browser, third-party SDK, network call) — e.g. `apps/api/src/features/permesso/checker.ts` (Puppeteer) and `telegram-bot.ts` (`node-telegram-bot-api`) — use `bun:test`'s `mock.module(specifier, factory)` at the top of the test file, not `spyOn`. `spyOn` does not reliably work on ESM named exports in this codebase (import bindings are effectively read-only from the consumer's side); `mock.module` is Bun's documented workaround and works even for a module already transitively imported (e.g. via `import { app } from '@/app'` at the top of the file) — it replaces the underlying binding, and *live* imports elsewhere (service.ts, routes.ts, jobs.ts) pick up the mock immediately.

Pattern used in `apps/api/src/features/permesso/permesso.test.ts`:

```ts
const checkPermessoStatusMock = mock(async (_p: string) => ({ success: true, status: 'default mock status' }))
mock.module('./checker', () => ({ checkPermessoStatus: checkPermessoStatusMock }))

const sendTelegramCheckResultMock = mock(async () => {})
const buildTelegramDeepLinkMock = mock((_t: string): string | null => null)
mock.module('./telegram-bot', () => ({
  sendTelegramCheckResult: sendTelegramCheckResultMock,
  buildTelegramDeepLink: buildTelegramDeepLinkMock,
  sendTelegramUnsubscribedNotice: mock(async () => {}),
  handleTelegramWebhook: mock(async () => new Response('...', { status: 503 })),
  startTelegramBot: mock(async () => {}),
}))
```

Override per-test with `mockImplementationOnce`/`mockReturnValueOnce`/`mockResolvedValueOnce`; clear call history in the shared `afterEach` with `.mockClear()` on every mock (mockClear does NOT reset a persistent `mockImplementation`/`mockReturnValue` set without "Once" — avoid those, prefer the `Once` variants so state can't leak between tests).

**Testing the real implementation a module-wide mock would otherwise hide**: if one test needs the *actual* logic inside a module you're mocking wholesale (e.g. `sendTelegramCheckResult`'s 403-handling branch that calls `permessoRepository.disconnectTelegram`), capture the real exports via dynamic `import()` **before** calling `mock.module` on that specifier — a plain variable assignment copies the function reference, so it is unaffected by a later `mock.module` call on the same specifier (which only repoints *new* reads of the module's binding, not already-captured local variables):

```ts
const realTelegramBot = await import('./telegram-bot')
const realStartTelegramBot = realTelegramBot.startTelegramBot
const realSendTelegramCheckResult = realTelegramBot.sendTelegramCheckResult
// ...only afterward: mock.module('./telegram-bot', () => ({ ...stubs }))
```

For `telegram-bot.ts` specifically: the module-private `bot` variable is only set by calling `startTelegramBot()` (normally invoked once from `src/index.ts`, never from `src/app.ts`, so it's `undefined` throughout the whole test process by default — this is *why* `buildTelegramDeepLink` returns `null`/503 "bot not configured" by default in every route test, with zero mocking required to prove that). To exercise the real 403-disconnect branch, mock `node-telegram-bot-api` itself (`Bot` as a fake class with `.api.getMe()`/`.api.sendMessage()`/`.command()`/`.startPolling()`, plus re-export the **real** `TelegramApiError` class captured the same way beforehand so `instanceof` checks inside the real module still hold), then call the captured `realStartTelegramBot()` once to populate `bot`, then call the captured `realSendTelegramCheckResult(...)` directly and assert the DB row's `telegramChatId` got cleared.

**Why:** This is the least invasive way found to reach a business-critical error-handling branch (permanent Telegram block → auto-disconnect) that's otherwise unreachable without a real bot token and a real blocked chat. Confirmed working: NODE_ENV=test in `.env.test` takes the long-polling branch inside `startTelegramBot()` (not the production/webhook branch), so the fake `Bot` only needs to satisfy `getMe`, `command`, `startPolling`.
**How to apply:** Reuse this two-step (capture-then-mock) approach whenever a test needs to reach real logic inside a module that's otherwise globally stubbed for the rest of the file's tests.

See also [[project_eden_date_parsing]].
