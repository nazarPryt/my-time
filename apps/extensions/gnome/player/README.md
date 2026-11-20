# Player Controls

A small GNOME Shell extension (GNOME 46) that puts previous, play/pause, and
next buttons for one media player in the top bar. It works with any player that
supports MPRIS — Rhythmbox, Spotify, VLC, browsers — and controls only the one
you choose.

## Install

From the monorepo root:

```bash
bun install
bun run gnome-player:install
```

Log out and back in after the first installation (Wayland), then:

```bash
gnome-extensions enable player-controls@my-time.local
```

## Choose a player

Click the music icon in the top bar, or open the extension's settings in the
Extensions app. Start your player first: only running players can be listed.
The choice is remembered; the buttons appear whenever that player is running
and disappear when it closes.

## Resource use

The extension runs inside GNOME Shell (no extra process), has no runtime
dependencies, and never polls: it reacts to D-Bus signals only. The settings
window is a separate process that exists only while open.

## Troubleshooting

```bash
journalctl -f -o cat /usr/bin/gnome-shell   # panel errors
gnome-extensions prefs player-controls@my-time.local
```
