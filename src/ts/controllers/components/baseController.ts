import { Commands } from "../../controls";

declare type TCommandActions = {
    [command in Commands]: () => void;
};

export abstract class BaseController implements IController {
    globalController: IGlobalController;
    commandActions: TCommandActions;

    constructor() {
        this.commandActions = {
            [Commands.Up]: undefined,
            [Commands.Down]: undefined,
            [Commands.Use]: undefined,
            [Commands.Left]: undefined,
            [Commands.Right]: undefined,
            [Commands.Back]: undefined,
        };
    }

    commonInit(): void {
        //
    }
    onPush(globalController: IGlobalController): void {
        this.globalController = globalController;
        this.commonInit();
    }
    onPop(): void {
        this.commonInit();
    }

    executeCommand(command: Commands): void {
        let action = this.commandActions[command];
        if (action) {
            action();
        }
    }
    abstract createElement(): HTMLElement;
}