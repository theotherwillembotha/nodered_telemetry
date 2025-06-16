import { NodeGenerator, BasicTemplate, SettingsTemplate } from "@theotherwillembotha/node-red-plugincore"

import { LoggerTemplate } from "@theotherwillembotha/node-red-plugincore"
import { MetricsTemplate } from "@theotherwillembotha/node-red-plugincore"

// nodes.
import { LoggerNode } from "./logger/LoggerNode";

import { CounterMetricNode } from "./metrics/CounterMetricNode";
import { GaugeMetricNode } from "./metrics/GaugeMetricNode";
import { TimerMetricNode } from "./metrics/TimerMetricNode";


new NodeGenerator("./src/")
    // services.

    // templates.
    .registerTemplate(BasicTemplate)
    .registerTemplate(LoggerTemplate)
    .registerTemplate(SettingsTemplate)
    .registerTemplate(MetricsTemplate)

    // nodes
    .registerNode(LoggerNode)
    .registerNode(CounterMetricNode)
    .registerNode(GaugeMetricNode)
    .registerNode(TimerMetricNode)

    // done.
    .generate("./build/Nodes", "./build/Plugins");

process.exit(0);