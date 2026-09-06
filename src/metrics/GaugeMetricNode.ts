
import { Node } from "node-red";

import {BaseNode, BaseNodeConfig, GaugeMetric, GaugeMetricConfigNode, GaugeMetricTemplate, MetricCapability, NodeDescription, NodeManager, onInput, SourceUtility } from "@theotherwillembotha/node-red-plugincore"
import {InputConfig } from "@theotherwillembotha/node-red-plugincore"

enum GaugeFunctionType{
    Increase = "Increase",
    Decrease = "Decrease",
}

interface GaugeMetricNodeConfig extends BaseNodeConfig, InputConfig {
    gaugeConfig:string,
    gaugeFunction:GaugeFunctionType,
}

@NodeDescription({
    id:"GaugeMetricNode",
    name:"Gauge Metric Node",
    group:"metrics",
    sourceFile:SourceUtility.getSourcePath("/build/", "/src/") + "GaugeMetricNode.html",
    package: "@theotherwillembotha/node-red-telemetry",
    templates: [
        { template: GaugeMetricTemplate, config: {}}
    ],
    dependencies:[ GaugeMetricConfigNode ],
    tags: [ "Metrics" ]
})
export class GaugeMetricNode extends BaseNode<GaugeMetricNodeConfig> {

    private _gauge: GaugeMetric;
    private _hasProvider: boolean;

    constructor(node: Node, config: GaugeMetricNodeConfig){
        super(node, config);
        let _this = this;

        const configNode = (NodeManager.RED.nodes.getNode(config.gaugeConfig) as any).node();
        this._gauge = configNode.gauge();
        this._hasProvider = configNode.metrics().supports(MetricCapability.Gauge);

        if (!this._hasProvider) {
            this.node().status({ fill: "yellow", shape: "ring", text: "No metric provider" });
        } else {
            this._gauge.subscribe(_this, state => { _this.node().status({fill:"grey",shape:"dot",text:"" + state.value}); });
            Promise.resolve()
                .then(() => this._gauge.get())
                .then(state => { _this.node().status({fill:"grey",shape:"dot",text:"" + (state?.value ? state.value : "0")}); });
        }

        this.node().on("close", () => {
            this._gauge.unsubscribe(_this);
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
