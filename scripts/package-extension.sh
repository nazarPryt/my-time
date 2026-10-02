#!/usr/bin/env bash
# Builds the Chrome extension zip and drops it into apps/web/public, where the
# Site Blocking setup card links to it (the "Load unpacked" install path, used
# until the extension is on the Chrome Web Store).
#
# Local testing only: production zips are built inside the web Docker image
# (apps/web/Dockerfile). This one bakes in apps/extension/.env's URLs.
set -euo pipefail

# --bun runs WXT on Bun's runtime instead of the system Node, which may be too
# old for WXT's CLI (Node 18 lacks util.styleText).
(cd apps/extension && bun --bun wxt zip)

zip_path="$(ls -t apps/extension/.output/*-chrome.zip | head -n 1)"
cp "$zip_path" apps/web/public/my-time-extension.zip
echo "Copied $zip_path -> apps/web/public/my-time-extension.zip"
