
import { Node } from "node-red";

import {BaseNode, BaseNodeConfig, CounterMetric, CounterMetricTemplate, MetricCapability, MetricsContainer, MetricsService, DoNothingMetricsContainer, NodeManager, SourceUtility, NodeDescription, onInput } from "@theotherwillembotha/node-red-plugincore"
import {InputConfig } from "@theotherwillembotha/node-red-plugincore"
import { CounterMetricTemplateConfig } from "@theotherwillembotha/node-red-plugincore"
import { ConfigFragmentTemplate } from "@theotherwillembotha/node-red-plugincore"

enum CounterShowStatus {
    Count = "Count",
    None  = "None",
}

interface CounterMetricNodeConfig extends BaseNodeConfig, CounterMetricTemplateConfig, InputConfig {
    counterShowStatus: CounterShowStatus,
}

@NodeDescription({
    id:"CounterMetricNode",
    name:"Counter Metric Node",
    group:"metrics",
    sourceFile:SourceUtility.getSourcePath("/build/", "/src/") + "CounterMetricNode.html",
    package: "@theotherwillembotha/node-red-telemetry",
    templates: [
        { template: CounterMetricTemplate, config: {}},
        { template: ConfigFragmentTemplate, config: { sectionType: "CounterMetricConfig", observe: "#metrics-selector", showBorder: true } }
    ],
    dependencies:[ ],
    tags: [ "Metrics" ]
})
export class CounterMetricNode extends BaseNode<CounterMetricNodeConfig> {

    private _counter: CounterMetric;
    private _hasProvider: boolean;
    private _showStatus: CounterShowStatus;

    constructor(node: Node, config: CounterMetricNodeConfig){
        super(node, config);
        let _this = this;

        const refNode = config.metricsEnabled && config.metricsReference ? NodeManager.RED.nodes.getNode(config.metricsReference) : null;
        const metrics: MetricsContainer = refNode ? (refNode as any).node().metrics() : new DoNothingMetricsContainer();
        this._hasProvider = metrics.supports(MetricCapability.Counter);
        this._showStatus = config.counterShowStatus ?? CounterShowStatus.Count;

        const metricConfig = {
            type: this.type(),
            id:   this.id(),
            metric: config.name,
            flow: this.flow(),
            name: this.name(),
        };

        this._counter = metrics.createCounter(metricConfig, config.providerConfig || {});

        if (config.resetOnDeploy) {
            this._counter.reset();
        }

        if (!this._hasProvider) {
            this.node().status({ fill: "yellow", shape: "ring", text: "No metric provider" });
        } else if (this._showStatus === CounterShowStatus.Count) {
            this._counter.subscribe(_this, state => {
                _this.node().status({fill:"grey",shape:"dot",text:"count: " + state.value});
            });
            this._counter.get().then(state => {
                _this.node().status({fill:"grey",shape:"dot", text: "count: " + (state ? state.value : "0")});
            });
        }

        this.node().on("close", () => {
            if (this._showStatus === CounterShowStatus.Count) {
                this._counter.unsubscribe(_this);
            }
        });
    }

    @onInput()
    protected async onInput(message:any, errorHandler:Function){
        this._counter.inc();
        this.node().send(message);
        if (this._hasProvider && this._showStatus === CounterShowStatus.Count) {
            this.node().status({fill:"grey",shape:"dot",text:"count: " + (await this._counter.get()).value});
        }
    }
}
