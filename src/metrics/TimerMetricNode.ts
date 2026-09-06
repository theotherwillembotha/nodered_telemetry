
import { Node } from "node-red";

import {BaseNode, BaseNodeConfig, HistogramMetric, MetricCapability, NodeDescription, NodeManager, onInput, SourceUtility, SummaryMetric, TimerMetricTemplate, TimerMetricConfigNode } from "@theotherwillembotha/node-red-plugincore"
import {InputConfig } from "@theotherwillembotha/node-red-plugincore"
import { MetricsReference } from "@theotherwillembotha/node-red-plugincore"

enum TimerFunctionType{
    Start = "Start",
    Stop = "Stop",
    Observe = "Observe",
}

enum TimerShowStatus{
    None = "None",
    Average = "Average",
}

interface TimerMetricNodeConfig extends BaseNodeConfig, MetricsReference, InputConfig {
    timerConfig:string,
    timerFunction:TimerFunctionType,
    timerShowStatus:TimerShowStatus,
}

@NodeDescription({
    id:"TimerMetricNode",
    name:"Timer Metric Node",
    group:"metrics",
    sourceFile:SourceUtility.getSourcePath("/build/", "/src/") + "TimerMetricNode.html",
    package: "@theotherwillembotha/node-red-telemetry",
    templates: [
        { template: TimerMetricTemplate, config: {}}
    ],
    dependencies:[ TimerMetricConfigNode ],
    tags: [ "Metrics" ]
})
export class TimerMetricNode extends BaseNode<TimerMetricNodeConfig> {

    private _timer: HistogramMetric|SummaryMetric;
    private _hasProvider: boolean;

    public constructor(node: Node, config: TimerMetricNodeConfig){
        super(node, config);
        let _this = this;

        const configNode = (NodeManager.RED.nodes.getNode(config.timerConfig) as any).node();
        this._timer = configNode.timer();
        this._hasProvider = configNode.metrics().supports(MetricCapability.Histogram);

        if (!this._hasProvider) {
            this.node().status({ fill: "yellow", shape: "ring", text: "No metric provider" });
        } else if (config.timerShowStatus !== TimerShowStatus.None) {
            this.node().status({});
            this._timer.subscribe(_this, state => _this.node().status({
                fill:"grey",
                shape:"dot",
                text:"avg: " +
                    ((state.average())
                        ? (Math.round((state.average()! + Number.EPSILON) * 100) / 100)
                        : "- ")
                    + "ms"
            }));
        } else {
            this.node().status({});
        }

        this.node().on("close", () => {
            if (this._hasProvider && config.timerShowStatus !== TimerShowStatus.None) {
                this._timer.unsubscribe(_this);
            }
        });
    }

    @onInput()
    protected onInput(message:any, errorHandler:Function){
        if(this.config().timerFunction === TimerFunctionType.Start){
            if(!message._timer){
                message._timer = {};
            }
            message._timer[this.config().timerConfig] = new Date().getTime();
        }
        if(this.config().timerFunction === TimerFunctionType.Stop){
            let offset = message?._timer?.[this.config().timerConfig];
            if(offset !== undefined){
                this._timer.observe(new Date().getTime() - offset);
            }
        }
        if(this.config().timerFunction === TimerFunctionType.Observe){
            let observation = message?._timer?.[this.config().timerConfig];
            if(observation !== undefined){
                this._timer.observe(observation);
            }
        }

        this.node().send(message);
    }
}
