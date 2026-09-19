
import { Node } from "node-red";

import {BaseNode, BaseNodeConfig, GaugeMetric, GaugeMetricTemplate, MetricCapability, MetricsContainer, DoNothingMetricsContainer, NodeDescription, NodeManager, onInput, SourceUtility } from "@theotherwillembotha/node-red-plugincore"
import {InputConfig } from "@theotherwillembotha/node-red-plugincore"
import { GaugeMetricTemplateConfig } from "@theotherwillembotha/node-red-plugincore"
import { ConfigFragmentTemplate } from "@theotherwillembotha/node-red-plugincore"

enum GaugeFunctionType{
    Increase = "Increase",
    Decrease = "Decrease",
}

enum GaugeShowStatus {
    Value = "Value",
    None  = "None",
}

interface GaugeMetricNodeConfig extends BaseNodeConfig, GaugeMetricTemplateConfig, InputConfig {
    gaugeFunction:GaugeFunctionType,
    gaugeShowStatus:GaugeShowStatus,
    gaugeKey:string,
}

@NodeDescription({
    id:"GaugeMetricNode",
    name:"Gauge Metric Node",
    group:"metrics",
    sourceFile:SourceUtility.getSourcePath("/build/", "/src/") + "GaugeMetricNode.html",
    package: "@theotherwillembotha/node-red-telemetry",
    templates: [
        { template: GaugeMetricTemplate, config: {}},
        { template: ConfigFragmentTemplate, config: { sectionType: "GaugeMetricConfig", observe: "#metrics-selector", showBorder: true } }
    ],
    dependencies:[ ],
    tags: [ "Metrics" ]
})
export class GaugeMetricNode extends BaseNode<GaugeMetricNodeConfig> {

    private _gauge: GaugeMetric;
    private _hasProvider: boolean;
    private _showStatus: GaugeShowStatus;

    constructor(node: Node, config: GaugeMetricNodeConfig){
        super(node, config);
        let _this = this;

        const refNode = config.metricsEnabled && config.metricsReference ? NodeManager.RED.nodes.getNode(config.metricsReference) : null;
        const metrics: MetricsContainer = refNode ? (refNode as any).node().metrics() : new DoNothingMetricsContainer();
        this._hasProvider = metrics.supports(MetricCapability.Gauge);
        this._showStatus = config.gaugeShowStatus ?? GaugeShowStatus.Value;

        const gaugeKey = config.gaugeKey || this.id();

        const metricConfig = {
            type: this.type(),
            id:   gaugeKey,
            metric: config.name,
            flow: this.flow(),
            name: this.name(),
        };

        this._gauge = metrics.createGauge(metricConfig, config.providerConfig || {});

        if (config.resetOnDeploy) {
            this._gauge.reset();
        }

        if (!this._hasProvider) {
            this.node().status({ fill: "yellow", shape: "ring", text: "No metric provider" });
        } else if (this._showStatus === GaugeShowStatus.Value) {
            this._gauge.subscribe(_this, state => {
                _this.node().status({fill:"grey",shape:"dot",text:"" + state.value});
            });
            const state = this._gauge.get();
            this.node().status({fill:"grey",shape:"dot",text:"" + (state?.value ?? "0")});
        } else {
            this.node().status({});
        }

        this.node().on("close", () => {
            if (this._showStatus === GaugeShowStatus.Value) {
                this._gauge.unsubscribe(_this);
            }
        });
    }

    @onInput()
    protected onInput(message:any, errorHandler:Function){
        if(this.config().gaugeFunction === GaugeFunctionType.Increase){
            this._gauge.inc();
        }
        if(this.config().gaugeFunction === GaugeFunctionType.Decrease){
            this._gauge.dec();
        }
        this.node().send(message);
    }
}
