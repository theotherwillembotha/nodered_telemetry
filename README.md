# @theotherwillembotha/node-red-telemetry

Node-RED nodes for structured logging and Prometheus metrics. Built on [@theotherwillembotha/node-red-plugincore](https://github.com/theotherwillembotha/nodered_plugincore).

---

## Usage in Node-RED

### Installation

Either use the **Manage Palette** option in the Node-RED editor, or run the following command in your Node-RED user directory (typically `~/.node-red`):

```bash
npm install @theotherwillembotha/node-red-telemetry
```

> [!IMPORTANT]
> **This plugin requires [`@theotherwillembotha/node-red-plugincore`](https://github.com/theotherwillembotha/nodered_plugincore) to be installed.**
>
> `node-red-plugincore` is declared as a dependency and npm will install it automatically alongside this package. However, due to a [known Node-RED limitation](https://github.com/node-red/node-red/issues/3529), packages that arrive as transitive npm dependencies are only discovered by the Node-RED runtime on the **next startup**.
>
> **You have two options:**
> - Install [`@theotherwillembotha/node-red-plugincore`](https://flows.nodered.org/node/@theotherwillembotha/node-red-plugincore) via the palette manager or `npm install` **first**, then install this plugin — both will be available immediately without a restart.
> - Install this plugin directly — `node-red-plugincore` will be installed automatically alongside it. **Restart Node-RED** once and both packages will be fully loaded.

### Nodes

#### Logging

| Node | Description |
|------|-------------|
| **Logger Node** | Logs incoming messages to a configured logging backend. Passes the message through unchanged. Attach a Console Logger or REST Logger config node (both provided by `node-red-plugincore`), or a Loki Logger config node (provided by [`node-red-loki`](https://github.com/theotherwillembotha/nodered_loki)) to control the destination. |

#### Metrics

| Node | Description |
|------|-------------|
| **Counter Metric Node** | Increments a Prometheus counter each time a message is received. Displays the current count on the node status. |
| **Gauge Metric Node** | Increases or decreases a Prometheus gauge on each message. Direction (Increase / Decrease) is configurable per node. |
| **Timer Metric Node** | Records timing observations to a Prometheus histogram. Supports Start / Stop / Observe modes for measuring durations across multiple nodes in a flow. |

### Config nodes (provided by node-red-plugincore)

These config nodes are shared across all plugins built on the framework.

| Config node | Provided by | Purpose |
|-------------|-------------|---------|
| Console Logger | `node-red-plugincore` | Writes log output to stdout |
| REST Logger | `node-red-plugincore` | Ships log entries to an HTTP endpoint |
| Loki Logger | [`node-red-loki`](https://github.com/theotherwillembotha/nodered_loki) | Ships log entries to Grafana Loki — install separately |
| Counter Metric | `node-red-plugincore` | Prometheus counter definition |
| Gauge Metric | `node-red-plugincore` | Prometheus gauge definition |
| Timer Metric | `node-red-plugincore` | Prometheus histogram / summary definition |

---

## Repository

- Source: [github.com/theotherwillembotha/nodered_telemetry](https://github.com/theotherwillembotha/nodered_telemetry)
- Issues: [github.com/theotherwillembotha/nodered_telemetry/issues](https://github.com/theotherwillembotha/nodered_telemetry/issues)

## License

[ISC](LICENSE)
