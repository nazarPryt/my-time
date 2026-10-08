# Desktop time tracker

Status: first version implemented and checked. Ready to install and connect
your account. Source lives in `apps/desktop`.

## Goal

Start and stop work sessions directly from the Linux desktop panel, without
opening the web app. Use the same account, sessions, and history as the existing
time tracker.

## First version

- Target the current setup: Ubuntu 24.04 with GNOME Shell 46.
- Build a GNOME Shell extension, alongside the existing browser extension.
- Place Play and Stop buttons and an elapsed-time display in the desktop panel.
- Play starts a work session; Stop finishes and saves the active session.
- Enable the appropriate button for the current session state.
- Work with the browser closed, provided the API is reachable.

## To do

- [x] Set up the TypeScript/GJS GNOME extension project in `apps/desktop`.
- [x] Add the panel controls and clear idle, working, and loading states.
- [x] Add account connection and API URL settings. Use email/password sign-in,
      store tokens in the Linux keyring, and support token refresh and sign-out.
- [x] Connect to the existing API to fetch the active session, start work, and
      end the active session. Reuse shared contracts where applicable.
- [x] Treat the API as the source of truth. Calculate elapsed time from the
      session's start timestamp and restore the active session on startup.
- [x] Refresh session state in both the desktop extension and the web tracker
      so starting or stopping from either place updates the other.
- [x] Handle connection failures and expired authentication clearly. Prevent
      repeated clicks while a request is pending, and show success only after
      the API confirms the action.
- [x] Document how to install, enable, update, and remove the extension.
- [x] Add desktop type checks and unit tests to CI.
- [x] Verify automated start/stop, synchronization, error, refresh, and teardown
      scenarios; enable and disable the extension in an isolated GNOME 46 session.
- [ ] Install on the main desktop and connect the real account. Check keyring
      persistence, saved history, browser closed, and logout/login restoration.

## Checks completed

- 19 desktop unit tests and 21 timer browser tests passed; web unit tests passed.
- Desktop and web TypeScript checks, repository lint, and web production build passed.
- Desktop build and installable zip packaging passed.
- GJS exercised real Soup HTTP, token refresh, and start/stop against a local mock API.
- Native GTK preferences constructed with temporary settings; the panel extension
  enabled and disabled successfully in a headless GNOME 46 session.

## Existing foundation

The API supports fetching, starting, and ending work sessions. The desktop and
visible web tracker now refresh every five seconds. Desktop controls operate on
those same sessions. See `README.md` for installation and account connection.

Reference: [GNOME panel widget documentation](https://gjs.guide/extensions/topics/st-widgets.html).
