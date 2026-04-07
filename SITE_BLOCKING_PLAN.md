# Site Blocking Feature — Implementation Plan

## Goal

Allow users to configure a list of blocked websites in the web dashboard. The Chrome extension reads that list and intercepts/blocks requests to those domains in real time.

---

## Architecture Overview

```
Web Dashboard  →  API (stores blocked sites per user)  ←  Chrome Extension
                                                              ↓
                                              declarativeNetRequest rules
                                              (blocks requests in browser)
```

---

## Key Decisions

### 1. Extension blocking API: `declarativeNetRequest` (not `webRequest`)
MV3 extensions must use `declarativeNetRequest`. It's declarative (the browser enforces rules, no code runs per-request), more performant, and future-proof. We give the browser a list of URL-match rules; it blocks them automatically.

### 2. Extension authentication
The extension cannot read the web app's `localStorage`. The extension popup will have its own login screen. On login it calls `/api/v1/auth/login`, stores the JWT + refresh token in `chrome.storage.local`, and the background service worker uses that token to sync the blocked list.

### 3. Sync strategy
The background service worker fetches the blocked list from the API on startup and whenever the extension popup triggers a manual refresh. It rebuilds `declarativeNetRequest` dynamic rules from the fetched list. No real-time push — polling on popup open is sufficient for this use case.

### 4. Domain format
Store bare domains (e.g. `reddit.com`). The extension converts each to a `declarativeNetRequest` `urlFilter` of `||reddit.com` which matches all subdomains, http, and https.

---

## Implementation Steps

### Step 1 — Contracts

**New file:** `contracts/src/features/site-blocking/blocked-site.ts`

```typescript
import { z } from 'zod'

export const BlockedSiteResponseSchema = z.object({
  id: z.string().uuid(),
  domain: z.string(),
  createdAt: z.string(),
})
export type BlockedSiteResponse = z.infer<typeof BlockedSiteResponseSchema>

export const CreateBlockedSiteRequestSchema = z.object({
  domain: z.string().min(1).max(253),
})
export type CreateBlockedSiteRequest = z.infer<typeof CreateBlockedSiteRequestSchema>

export const BlockedSiteListResponseSchema = z.array(BlockedSiteResponseSchema)
export type BlockedSiteListResponse = z.infer<typeof BlockedSiteListResponseSchema>
```

**New file:** `contracts/src/features/site-blocking/index.ts` — re-export everything.

**Update:** `contracts/src/index.ts` — add `export * from './features/site-blocking'`.

---

### Step 2 — Database Schema

**New file:** `apps/api/src/db/schema/blocked-sites.ts`

```typescript
import { pgTable, uuid, text, timestamp, index, unique } from 'drizzle-orm/pg-core'
import { users } from './users'

export const blockedSites = pgTable(
  'blocked_sites',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    domain: text('domain').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => [
    index('idx_blocked_sites_user_id').on(table.userId),
    unique('uq_blocked_sites_user_domain').on(table.userId, table.domain),
  ],
)
```

**Update:** `apps/api/src/db/schema/index.ts` — export `blockedSites`.

After this step, run:
```bash
bun --filter api db:generate
bun --filter api db:migrate
```

---

### Step 3 — API Feature

**New file:** `apps/api/src/features/site-blocking/repository.ts`

```typescript
// findByUserId(userId) → BlockedSite[]
// create(userId, domain) → BlockedSite   (handles unique constraint → 409)
// deleteById(userId, id) → void
```

**New file:** `apps/api/src/features/site-blocking/service.ts`

```typescript
// listSites(userId) → BlockedSiteResponse[]
// addSite(userId, domain) → BlockedSiteResponse   (normalize domain: lowercase, strip protocol/path/www)
// removeSite(userId, id) → void
```

Domain normalization logic in service (strip `https://`, leading `www.`, trailing slashes, paths). Example: `"https://www.Reddit.com/r/programming"` → `"reddit.com"`.

**New file:** `apps/api/src/features/site-blocking/routes.ts`

```
GET    /api/v1/site-blocking         → list all blocked sites for current user
POST   /api/v1/site-blocking         → add a domain  (body: { domain })
DELETE /api/v1/site-blocking/:id     → remove a blocked site by id
```

All routes require auth (use existing `authMacro`).

**Update:** `apps/api/src/app.ts` — import and mount `siteBlockingPlugin` under `/site-blocking`.

---

### Step 4 — Web Dashboard

**New file:** `apps/web/src/feature/site-blocking/api.ts`

```typescript
// fetchBlockedSites() → BlockedSiteResponse[]
// addBlockedSite(domain: string) → BlockedSiteResponse
// removeBlockedSite(id: string) → void
```

Uses the Eden Treaty `api` client (same pattern as `feature/workout/api.ts`).

**New file:** `apps/web/src/feature/site-blocking/store.ts`

Zustand store with:
- `sites: BlockedSiteResponse[]`
- `isLoading: boolean`
- `loadSites()` — fetch and populate
- `addSite(domain)` — optimistic add, rollback on error
- `removeSite(id)` — optimistic remove, rollback on error

**New file:** `apps/web/src/routes/dashboard/site-blocking.tsx`

UI layout:
- Header: "Site Blocking"
- Input + "Block" button to add a domain
- List of blocked sites with a trash/remove button per row
- Empty state: "No sites blocked yet"
- Show domain and date added

**Update:** `apps/web/src/routes/dashboard.tsx` — add to `NAV_ITEMS`:
```typescript
{ to: '/dashboard/site-blocking', label: 'Site Blocking', icon: ShieldOff, exact: false }
```
Import `ShieldOff` from `lucide-react`.

---

### Step 5 — Chrome Extension

#### 5a. Permissions (`apps/extension/wxt.config.ts`)

Add to manifest:
```typescript
permissions: ['declarativeNetRequest', 'declarativeNetRequestWithHostAccess', 'storage', 'tabs'],
host_permissions: ['<all_urls>'],
```

Remove the current `scripting` permission (not needed for blocking).

#### 5b. Auth storage utility (`apps/extension/utils/auth.ts`)

```typescript
// getToken() → string | null  (from chrome.storage.local)
// setTokens(access, refresh) → void
// clearTokens() → void
```

#### 5c. API client (`apps/extension/utils/api.ts`)

Thin fetch wrapper that reads the token from storage and calls the API:
```typescript
// login(email, password) → { accessToken, refreshToken }
// fetchBlockedSites() → BlockedSiteResponse[]
```

Base URL: read from `import.meta.env.VITE_API_URL` (add to extension `.env`).

#### 5d. Background service worker (`apps/extension/background.ts`)

Responsibilities:
1. On startup: call `syncBlockedSites()`.
2. `syncBlockedSites()`:
   - Fetch blocked sites from API.
   - Build `declarativeNetRequest` rules — one rule per domain:
     ```typescript
     {
       id: <integer>,  // unique per rule, derived from domain index
       priority: 1,
       action: { type: 'block' },
       condition: { urlFilter: `||${domain}`, resourceTypes: ['main_frame', 'sub_frame', 'xmlhttprequest', 'other'] }
     }
     ```
   - Call `chrome.declarativeNetRequest.updateDynamicRules({ addRules, removeRuleIds })`.
   - Store last-synced list in `chrome.storage.local` for offline use.
3. Listen for message `{ type: 'SYNC' }` from popup to trigger re-sync.

#### 5e. Popup UI (`apps/extension/popup/App.tsx`)

Two states:

**Not logged in:**
- Email + password form
- "Sign In" button
- On success: store tokens, trigger sync, show main view

**Logged in:**
- "Synced X sites blocked" status line
- "Refresh" button → sends `SYNC` message to background
- "Open Dashboard" link → opens web app in new tab
- "Sign Out" button → clears tokens + clears all dynamic rules

---

## File Changelist (summary)

| Action | File |
|--------|------|
| Create | `contracts/src/features/site-blocking/blocked-site.ts` |
| Create | `contracts/src/features/site-blocking/index.ts` |
| Update | `contracts/src/index.ts` |
| Create | `apps/api/src/db/schema/blocked-sites.ts` |
| Update | `apps/api/src/db/schema/index.ts` |
| Create | `apps/api/src/features/site-blocking/repository.ts` |
| Create | `apps/api/src/features/site-blocking/service.ts` |
| Create | `apps/api/src/features/site-blocking/routes.ts` |
| Update | `apps/api/src/app.ts` |
| Create | `apps/web/src/feature/site-blocking/api.ts` |
| Create | `apps/web/src/feature/site-blocking/store.ts` |
| Create | `apps/web/src/routes/dashboard/site-blocking.tsx` |
| Update | `apps/web/src/routes/dashboard.tsx` |
| Create | `apps/extension/utils/auth.ts` |
| Create | `apps/extension/utils/api.ts` |
| Update | `apps/extension/wxt.config.ts` |
| Update | `apps/extension/background.ts` |
| Update | `apps/extension/popup/App.tsx` |
| Run    | `bun --filter api db:generate && bun --filter api db:migrate` |

---

## Out of Scope (for now)

- **Scheduling** — block sites only during work hours. Can be added later as a `schedule` field on each blocked site.
- **Block page** — custom "you've been blocked" UI injected by a content script. Current behavior: request simply fails (browser shows its default error page).
- **Sync from web to extension automatically** — extension only syncs on startup or manual refresh. Push/websocket sync is future work.
- **Password-less extension auth** — the extension has its own login. A "Connect extension" flow from the web dashboard (e.g., via a one-time token) would be a nicer UX but adds complexity.