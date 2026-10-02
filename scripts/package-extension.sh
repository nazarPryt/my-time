#!/usr/bin/env bash
# Builds the Chrome extension zip and drops it into apps/web/public, where the
# Site Blocking setup card links to it (the "Load unpacked" install path, used
# until the extension is on the Chrome Web Store).
#
# The extension bakes VITE_WEB_URL / VITE_API_URL in at build time, so build it
# with the env of the deployment that will serve the zip (apps/extension/.env).
set -euo pipefail

# --bun runs WXT on Bun's runtime instead of the system Node, which may be too
# old for WXT's CLI (Node 18 lacks util.styleText).
(cd apps/extension && bun --bun wxt zip)

zip_path="$(ls -t apps/extension/.output/*-chrome.zip | head -n 1)"
cp "$zip_path" apps/web/public/my-time-extension.zip
echo "Copied $zip_path -> apps/web/public/my-time-extension.zip"
