
import { Node } from "node-red";

import {BaseNode, BaseNodeConfig, CounterMetric, CounterMetricTemplate, CounterMetricConfigNode, MetricsConfigNode, NodeManager, SourceUtility, NodeDescription, onInput } from "@theotherwillembotha/node-red-plugincore"
import {InputConfig } from "@theotherwillembotha/node-red-plugincore"

interface CounterMetricNodeConfig extends BaseNodeConfig, InputConfig {
    counterConfig:string
}

@NodeDescription({
    id:"CounterMetricNode",
    name:"Counter Metric Node",
    group:"metrics",
    sourceFile:SourceUtility.getSourcePath("/build/", "/src/") + "CounterMetricNode.html",
    package: "@theotherwillembotha/node-red-telemetry",
    templates: [
        { template: CounterMetricTemplate, config: {}}
    ],
    dependencies:[ CounterMetricConfigNode, MetricsConfigNode ],
    tags: [ "Metrics" ]
})
export class CounterMetricNode extends BaseNode<CounterMetricNodeConfig> {

    private _counter: CounterMetric;

    constructor(node: Node, config: CounterMetricNodeConfig){
        super(node, config);
        let _this = this;

        this._counter = (NodeManager.RED.nodes.getNode(config.counterConfig) as any).node().counter();

        this._counter.subscribe(_this, state => { _this.node().status({fill:"grey",shape:"dot",text:"" + state.value}); });
        this._counter.get().then(state => {
            _this.node().status({fill:"grey",shape:"dot", text: "" + (state ? state.value : "0")});
        })

        this.node().on("close", () => {
            this._counter.unsubscribe(_this);
        });
    }

    @onInput()
    protected async onInput(message:any, errorHandler:Function){
        this._counter.inc();
        this.node().send(message);
        this.node().status({fill:"grey",shape:"dot",text:"" + (await this._counter.get()).value});
    }
}
