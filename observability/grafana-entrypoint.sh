#!/bin/sh
# Grafana turns an env-expanded numeric value into a JSON number, which the
# Telegram contact point rejects (chatid must be a string). So the chat id is
# written into a copy of the provisioning files as a quoted literal instead.
set -eu

src=/etc/grafana/provisioning
dst=/tmp/provisioning
rm -rf "$dst"
cp -R "$src" "$dst"

chat_id=${GRAFANA_ALERT_TELEGRAM_CHAT_ID:-}
if ! printf '%s' "$chat_id" | grep -Eq '^(-?[0-9]+|@[A-Za-z0-9_]+)$'; then
	# Placeholders keep Grafana bootable before Telegram is configured (an
	# invalid contact point fails provisioning); alerts then only show in the UI.
	echo "GRAFANA_ALERT_TELEGRAM_CHAT_ID is unset or invalid: Telegram alerts are disabled" >&2
	chat_id=0
fi
sed -i "s|__TELEGRAM_CHAT_ID__|'${chat_id}'|" "$dst/alerting/contact-points.yaml"

export GRAFANA_ALERT_TELEGRAM_BOT_TOKEN="${GRAFANA_ALERT_TELEGRAM_BOT_TOKEN:-not-configured}"
export GF_PATHS_PROVISIONING="$dst"
exec /run.sh "$@"
