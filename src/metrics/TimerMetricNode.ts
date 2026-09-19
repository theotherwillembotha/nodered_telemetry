
import { Node } from "node-red";

import {BaseNode, BaseNodeConfig, DoNothingHistogramMetric, HistogramMetric, MetricCapability, MetricsContainer, DoNothingMetricsContainer, NodeDescription, NodeManager, onInput, SourceUtility, SummaryMetric, TimerMetricTemplate } from "@theotherwillembotha/node-red-plugincore"
import {InputConfig } from "@theotherwillembotha/node-red-plugincore"
import { TimerMetricTemplateConfig } from "@theotherwillembotha/node-red-plugincore"
import { ConfigFragmentTemplate } from "@theotherwillembotha/node-red-plugincore"

enum TimerFunctionType{
    Start = "Start",
    Stop = "Stop",
    Observe = "Observe",
}

enum TimerShowStatus{
    None = "None",
    Average = "Average",
}

interface TimerMetricNodeConfig extends BaseNodeConfig, TimerMetricTemplateConfig, InputConfig {
    timerFunction:TimerFunctionType,
    timerShowStatus:TimerShowStatus,
    timerKey:string,
    timerObserveProperty:string,
}

@NodeDescription({
    id:"TimerMetricNode",
    name:"Timer Metric Node",
    group:"metrics",
    sourceFile:SourceUtility.getSourcePath("/build/", "/src/") + "TimerMetricNode.html",
    package: "@theotherwillembotha/node-red-telemetry",
    templates: [
        { template: TimerMetricTemplate, config: {}},
        { template: ConfigFragmentTemplate, config: { sectionType: "TimerMetricConfig", observe: "#metrics-selector", showBorder: true } }
    ],
    dependencies:[ ],
    tags: [ "Metrics" ]
})
export class TimerMetricNode extends BaseNode<TimerMetricNodeConfig> {

    private _timer: HistogramMetric|SummaryMetric;
    private _hasProvider: boolean;

    public constructor(node: Node, config: TimerMetricNodeConfig){
        super(node, config);
        let _this = this;

        const isStart = config.timerFunction === TimerFunctionType.Start;

        if (isStart) {
            this._hasProvider = false;
            this._timer = new DoNothingHistogramMetric();
            this.node().status({});
            return;
        }

        const refNode = config.metricsEnabled && config.metricsReference ? NodeManager.RED.nodes.getNode(config.metricsReference) : null;
        const metrics: MetricsContainer = refNode ? (refNode as any).node().metrics() : new DoNothingMetricsContainer();
        this._hasProvider = metrics.supports(MetricCapability.Histogram);

        const metricConfig = {
            type: this.type(),
            id:   this.id(),
            metric: config.name,
            flow: this.flow(),
            name: this.name(),
        };

        this._timer = metrics.createTimer(metricConfig, config.providerConfig || {});

        if (config.resetOnDeploy) {
            this._timer.reset();
        }

        if (!this._hasProvider) {
            this.node().status({ fill: "yellow", shape: "ring", text: "No metric provider" });
        } else if (config.timerShowStatus === TimerShowStatus.Average) {
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
            if (this._hasProvider && config.timerShowStatus === TimerShowStatus.Average) {
                this._timer.unsubscribe(_this);
            }
        });
    }

    @onInput()
    protected onInput(message:any, errorHandler:Function){
        const timerKey = this.config().timerKey || this.name();

        if(this.config().timerFunction === TimerFunctionType.Start){
            if(!message._timer){
                message._timer = {};
            }
            message._timer[timerKey] = new Date().getTime();
        }
        if(this.config().timerFunction === TimerFunctionType.Stop){
            let offset = message?._timer?.[timerKey];
            if(offset !== undefined){
                this._timer.observe(new Date().getTime() - offset);
            }
        }
        if(this.config().timerFunction === TimerFunctionType.Observe){
            const prop = this.config().timerObserveProperty || "payload";
            const observation = prop.split(".").reduce((obj:any, key:string) => obj?.[key], message);
            if(observation !== undefined && typeof observation === "number"){
                this._timer.observe(observation);
            }
        }

        this.node().send(message);
    }
}
