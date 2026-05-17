
import { Node } from "node-red";

import { BaseNode, BaseNodeConfig, SourceUtility, LoggerTemplateConfig, NodeDescription, onInput, ConsoleLoggerConfigNode, RestLoggerConfigNode, LoggerService, Log } from "@theotherwillembotha/node-red-plugincore"
import { InputConfig } from "@theotherwillembotha/node-red-plugincore"
import { LoggerTemplate } from "@theotherwillembotha/node-red-plugincore"
import { Logger } from "@theotherwillembotha/node-red-plugincore"


interface LoggerNodeConfig extends BaseNodeConfig, InputConfig, LoggerTemplateConfig {}

@NodeDescription({
    id:"LoggerNode",
    name:"Logger Node",
    group:"logger",
    sourceFile:SourceUtility.getSourcePath("/build/", "/src/") + "LoggerNode.html",
    package: "@theotherwillembotha/node-red-telemetry",
    templates: [
        { template: LoggerTemplate, config: {}}
    ],
    dependencies:[ LoggerService ],
    tags: [ "Logging" ]
})
export class LoggerNode extends BaseNode<LoggerNodeConfig> {

    @Logger()
    private log!:Log;

    constructor(node: Node, config: LoggerNodeConfig){
        super(node, config);

        this.node().on("close", () => {});
    }

    @onInput()
    protected onInput(message:any, errorHandler:Function){
        this.log.log(message);
        this.node().send(message);
    }
}
