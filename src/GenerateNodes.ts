import { NodeGenerator, NodeTypeService } from "@theotherwillembotha/node-red-plugincore"

// nodes.
import { LoggerNode } from "./logger/LoggerNode";
import { CounterMetricNode } from "./metrics/CounterMetricNode";
import { GaugeMetricNode } from "./metrics/GaugeMetricNode";
import { TimerMetricNode } from "./metrics/TimerMetricNode";
import { ConsoleLoggerConfigNode } from "@theotherwillembotha/node-red-logging";

// Only register leaf nodes — templates, services, and infrastructure nodes
// are resolved automatically from @NodeDescription and @TemplateDescription
// dependencies.
new NodeGenerator("./src/")
    .registerService(NodeTypeService)
    .registerNode(LoggerNode)
    .registerNode(CounterMetricNode)
    .registerNode(GaugeMetricNode)
    .registerNode(TimerMetricNode)
    .registerNode(ConsoleLoggerConfigNode)
    .generate("./build/Nodes", "./build/Plugins", "@theotherwillembotha/node-red-telemetry");

process.exit(0);
