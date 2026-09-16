#!/usr/bin/env bash
# Ensures the Docker Desktop backend is running before we try to `docker compose up`.
# On this machine Docker Desktop's daemon is a systemd --user service that isn't
# enabled at login, so `docker info` fails until the app has been opened by hand.
# Starting the unit directly gets the same daemon up without opening the GUI.
set -euo pipefail

if docker info >/dev/null 2>&1; then
	exit 0
fi

echo "Docker daemon not running, starting docker-desktop.service..."
systemctl --user start docker-desktop.service

echo -n "Waiting for Docker to be ready"
for _ in $(seq 1 60); do
	if docker info >/dev/null 2>&1; then
		echo " done"
		exit 0
	fi
	echo -n "."
	sleep 1
done

echo
echo "Timed out waiting for Docker Desktop to start" >&2
exit 1
