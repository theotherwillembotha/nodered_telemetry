# @theotherwillembotha/node-red-telemetry

Node-RED nodes for structured logging and Prometheus metrics. Built on [@theotherwillembotha/node-red-plugincore](https://github.com/theotherwillembotha/nodered_plugincore).

---

## Usage in Node-RED

### Installation

Either use the **Manage Palette** option in the Node-RED editor, or run the following command in your Node-RED user directory (typically `~/.node-red`):

```bash
npm install @theotherwillembotha/node-red-telemetry
```

> **Prerequisite:** This package requires `@theotherwillembotha/node-red-plugincore` to be installed. It will be installed automatically as a dependency.

### Nodes

#### Logging

| Node | Description |
|------|-------------|
| **Logger Node** | Logs incoming messages to a configured logging backend (Console, REST, or Loki). Passes the message through unchanged. Attach a Console Logger, REST Logger, or Loki Logger config node to control the destination. |

#### Metrics

| Node | Description |
|------|-------------|
| **Counter Metric Node** | Increments a Prometheus counter each time a message is received. Displays the current count on the node status. |
| **Gauge Metric Node** | Increases or decreases a Prometheus gauge on each message. Direction (Increase / Decrease) is configurable per node. |
| **Timer Metric Node** | Records timing observations to a Prometheus histogram. Supports Start / Stop / Observe modes for measuring durations across multiple nodes in a flow. |

### Config nodes (provided by node-red-plugincore)

These config nodes are installed alongside this package as part of `node-red-plugincore` and are shared across all plugins built on the framework.

| Config node | Purpose |
|-------------|---------|
| Console Logger | Writes log output to stdout |
| REST Logger | Ships log entries to an HTTP endpoint |
| Loki Logger | Ships log entries to Grafana Loki |
| Counter Metric | Prometheus counter definition |
| Gauge Metric | Prometheus gauge definition |
| Timer Metric | Prometheus histogram / summary definition |

---

## Repository

- Source: [github.com/theotherwillembotha/nodered_telemetry](https://github.com/theotherwillembotha/nodered_telemetry)
- Issues: [github.com/theotherwillembotha/nodered_telemetry/issues](https://github.com/theotherwillembotha/nodered_telemetry/issues)

## License

[ISC](LICENSE)
