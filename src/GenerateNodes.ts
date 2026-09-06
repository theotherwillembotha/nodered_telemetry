import { NodeGenerator, BasicTemplate, SettingsTemplate, SettingsService, DelegatedConfigReferenceNode, NodeTypeService } from "@theotherwillembotha/node-red-plugincore"
import { LoggerTemplate, LoggerService, ConsoleLoggerConfigNode, RestLoggerConfigNode } from "@theotherwillembotha/node-red-plugincore"
import { MetricsTemplate, CounterMetricTemplate, GaugeMetricTemplate, TimerMetricTemplate } from "@theotherwillembotha/node-red-plugincore"
import { MetricsService, MetricsConfigNode, CounterMetricConfigNode, GaugeMetricConfigNode, TimerMetricConfigNode } from "@theotherwillembotha/node-red-plugincore"
import { WebhookTemplate, WebhookServerConfigNode, WebhookServerService } from "@theotherwillembotha/node-red-plugincore"

// nodes.
import { LoggerNode } from "./logger/LoggerNode";
import { CounterMetricNode } from "./metrics/CounterMetricNode";
import { GaugeMetricNode } from "./metrics/GaugeMetricNode";
import { TimerMetricNode } from "./metrics/TimerMetricNode";


new NodeGenerator("./src/")
    // services.
    .registerService(LoggerService)
    .registerService(MetricsService)
    .registerService(SettingsService)
    .registerService(WebhookServerService)
    .registerService(NodeTypeService)

    // templates.
    .registerTemplate(BasicTemplate)
    .registerTemplate(LoggerTemplate)
    .registerTemplate(SettingsTemplate)
    .registerTemplate(MetricsTemplate)
    .registerTemplate(CounterMetricTemplate)
    .registerTemplate(GaugeMetricTemplate)
    .registerTemplate(TimerMetricTemplate)
    .registerTemplate(WebhookTemplate)

    // plugincore infrastructure nodes (bundled inline — must be registered here since plugincore is not installed separately)
    .registerNode(DelegatedConfigReferenceNode)
    .registerNode(ConsoleLoggerConfigNode)
    .registerNode(RestLoggerConfigNode)
    .registerNode(MetricsConfigNode)
    .registerNode(CounterMetricConfigNode)
    .registerNode(GaugeMetricConfigNode)
    .registerNode(TimerMetricConfigNode)
    .registerNode(WebhookServerConfigNode)

    // telemetry nodes
    .registerNode(LoggerNode)
    .registerNode(CounterMetricNode)
    .registerNode(GaugeMetricNode)
    .registerNode(TimerMetricNode)

    // done.
    .generate("./build/Nodes", "./build/Plugins");

process.exit(0);
