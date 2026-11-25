FROM grafana/grafana:11.4.0
COPY grafana/provisioning /etc/grafana/provisioning
COPY --chmod=755 grafana-entrypoint.sh /usr/local/bin/grafana-entrypoint.sh
ENTRYPOINT ["/usr/local/bin/grafana-entrypoint.sh"]
