# Player Controls (GNOME extension)

Read the root `AGENTS.md` and `apps/extensions/gnome/AGENTS.md` first.

Panel buttons (previous, play/pause, next) for exactly one MPRIS media player
that the user picks in preferences. Package `gnome-player`, UUID
`player-controls@my-time.local`, GNOME 46 only.

## Commands (from the monorepo root)

- `bun run gnome-player:build` — typecheck, bundle, compile settings into `dist/`.
- `bun run gnome-player:package` — build the installable zip in `build/`.
- `bun run gnome-player:install` — package and install for the current user.
- `bun --filter gnome-player test` — controller and MPRIS parsing tests.
- `bun --filter gnome-player typecheck`

## Behavior

- `selected-player` (GSettings) holds the stable MPRIS id (`rhythmbox`,
  `firefox`), never the per-process `.instance…` suffix. Empty means unchosen.
- Unchosen: the panel shows one icon that opens preferences.
- Chosen but not running: the indicator is hidden.
- Running: previous / play-pause / next, track title on hover. Buttons follow
  the player's `Can*` capabilities. No fallback to other players.

## Structure

- `src/extension.ts`, `src/prefs.ts` — thin entry points.
- `src/shell/application.ts` — Shell composition root and cleanup.
- `src/shell/ui/player-panel.ts` — St panel widget; owns its actors.
- `src/preferences/ui/player-page.ts` — libadwaita player list.
- `src/bll/player-controller.ts` — follows one player, dedupes state; GNOME-free.
- `src/dal/media-player.ts` — `MediaPlayer` port used by the controller.
- `src/dal/mpris-player.ts` — Gio adapter: one filtered `NameOwnerChanged`
  subscription, one proxy while running, no auto-start, async calls only.
- `src/dal/player-discovery.ts` — lists running players (preferences only).
- `src/dal/settings-store.ts` — the only place that knows GSettings keys.
- `src/shared/mpris.ts` — MPRIS names and property parsing; GNOME-free.

The controller, `media-player.ts`, and `shared/mpris.ts` stay free of `gi://`
imports so they can move to a shared package if another desktop is added.
Do not add playback position/progress: MPRIS does not signal it, so it would need polling.
