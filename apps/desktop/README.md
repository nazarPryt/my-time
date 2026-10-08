# my·time desktop

A personal GNOME Shell extension for Ubuntu 24.04 / GNOME 46. It adds Play,
Stop, and an elapsed timer to the desktop panel. It uses the same account and
work sessions as the web app, and works while the browser is closed.

## Install

From the monorepo root:

```bash
bun install
bun --filter desktop typecheck
bun run desktop:install
```

The installer creates and installs
`apps/desktop/build/my-time@my-time.local.shell-extension.zip` into your user
extensions directory. Log out and back in after the first installation, then:

```bash
gnome-extensions enable my-time@my-time.local
```

On an Xorg session, restarting GNOME Shell with Alt+F2, entering `r`, and pressing
Enter can reload installed extensions. On Wayland, log out and back in. Save
your work before logging out; the installer does not restart your session.

Ubuntu's GNOME installation normally includes GJS, GTK4, libadwaita, Soup 3,
libsecret, and the extension tools. If a dependency is missing:

```bash
sudo apt install gjs gnome-shell gir1.2-adw-1 gir1.2-soup-3.0 gir1.2-secret-1 libglib2.0-bin
```

## Connect

1. Click the timer in the panel and choose **Settings**.
2. Enter your **API server URL** and **web application URL**. Defaults point to
   local development: `http://localhost:3000/api/v1` and `http://localhost:5173`.
   For your deployed app, enter its actual HTTPS URLs. A server URL without
   `/api/v1` has that suffix added automatically.
3. Sign in with the email and password you use in the web app.

The password is used only to sign in. Access and refresh tokens are stored in
the Linux Secret Service keyring, scoped to the API URL. The keyring must be
available and unlocked. Nonsecret settings are stored in GSettings. Sign out
from Settings before changing the server or account; sign-out clears the local
desktop credentials without ending a work session.

## Use

- **Play** starts work, or restores the session already running on the server.
- **Stop** finishes and saves the current work session.
- The timer shows hours, minutes, and seconds since the server's start timestamp.
- Click the timer for connection status, **Refresh now**, **Open web tracker**,
  and **Settings**.

The extension checks the API every five seconds. The web timer checks every
five seconds while visible and also refreshes when it regains focus. An already
deployed web app needs the web changes deployed to get this automatic refresh.

Controls are disabled until the session state is confirmed, while requests are
pending, and after a connection failure. An amber timer indicates a connection
problem; click it to read the status. The last confirmed session stays visible
until the next successful refresh. An expired sign-in requires reconnecting.

Stopping requires a successful API request. Offline sessions are not queued.
The API remains responsible for session history and its existing session rules.

## Develop and update

```bash
bun --filter desktop typecheck
bun --filter desktop test
bun run desktop:build
bun run desktop:package
bun run lint:check
bun --filter web test:e2e e2e/dashboard/time-tracker/time-tracker.spec.ts
```

Source lives in `src/`; `dist/` and `build/` are generated and ignored. Bun bundles
TypeScript and compatible dependencies into GJS JavaScript. GNOME imports stay
external. Build scripts also compile the settings schema.

To update, run `bun run desktop:install` again, then reload your GNOME session as
described above. Disabling and enabling alone does not reliably reload changed
JavaScript. GNOME 46 is the supported version; test before adding other shell
versions to `metadata.json`.

For logs:

```bash
journalctl --user -f -o cat
```

Look for GNOME Shell extension errors or preferences-process errors. Never add
credentials or tokens to diagnostic logs.

## Remove

```bash
gnome-extensions prefs my-time@my-time.local
# Sign out in the settings window to clear stored desktop credentials.
gnome-extensions disable my-time@my-time.local
gnome-extensions uninstall my-time@my-time.local
```

## References

- [GNOME extension getting started](https://gjs.guide/extensions/development/creating.html)
- [GNOME TypeScript setup](https://gjs.guide/extensions/development/typescript.html)
- [Panel widgets](https://gjs.guide/extensions/topics/st-widgets.html)
- [Preferences](https://gjs.guide/extensions/development/preferences.html)
