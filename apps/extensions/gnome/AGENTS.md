# GNOME extensions

Read the root `AGENTS.md` first. Rules here apply to every GNOME Shell extension
under `apps/extensions/gnome/` (`player/` and `time-tracker/`). Each extension's
own `AGENTS.md` adds extension-specific rules.

## Runtime

- Extensions run inside the GNOME Shell process via GJS: no DOM, no Node/Bun APIs.
  Bun is build/test tooling only. Keep `gi://` and `resource://` imports external.
- Shell code uses St/Clutter; preferences run in a separate process and use
  GTK4/libadwaita. Never import one toolkit from the other process's modules.
- Create widgets, signals, and D-Bus subscriptions in `enable()`; disconnect,
  cancel, and destroy all of them in `disable()`. Leaks accumulate for the whole
  login session (and `disable()` also runs on every screen lock).
- Never make synchronous D-Bus/IO calls in the Shell process; they freeze the desktop.

## Lightweight by default

- Event-driven only: react to D-Bus signals and GSettings changes; no polling
  timers unless a feature cannot work without one.
- No runtime dependencies unless they are unavoidable; prefer symbolic icons over
  loading images.
- Update widgets only when state actually changed.

## Supported GNOME versions

`metadata.json` lists each tested version explicitly (no wildcards). To add a
new GNOME release:

1. Read its "Port Extensions to GNOME XX" guide on gjs.guide.
2. Bump `@girs/gnome-shell` and run typecheck.
3. Test in a VM or nested/devkit Shell (`dbus-run-session -- gnome-shell --nested --wayland`
   on 46; `--devkit` from 49), including disable/enable cycles and the journal
   (`journalctl -f -o cat /usr/bin/gnome-shell`).
4. Only then add the version to `shell-version`.

## Layering

`shell/ui` and `preferences/ui` render state and forward actions; `bll/` holds
GNOME-free logic with unit tests; `dal/` owns D-Bus, GSettings, and other I/O;
`shared/` depends on nothing. BLL may import DAL interfaces/types; DAL never
imports BLL or UI.
