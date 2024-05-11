import { Commands } from "../controls";
import { Stack } from "./common";
import { HTMLTags, render } from "./render";

declare type TCommandActions = {
    [command in Commands]: () => void;
};

export abstract class BaseState {
    protected statesController: StatesController;
    protected commandActions: TCommandActions;

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

    public abstract getStateTitle(): string;

    public setController(controller: StatesController) {
        this.statesController = controller;
    }

    public onStateCreating(): void {
        console.log(`Create ${this.getStateTitle()} state`);
    }
    public onStatePush(): void {
        console.log(`Push ${this.getStateTitle()} state`);
    }
    public onStatePop(): void {
        console.log(`Pop ${this.getStateTitle()} state`);
    }
    public onStateDestroy(): void {
        console.log(`Destroy ${this.getStateTitle()} state`);
    }

    public executeCommand(command: Commands): void {
        const action = this.commandActions[command];
        if (action) {
            action();
        }
    }
    public abstract createElement(): HTMLElement;
}

export class StatesController {
    protected currentState?: BaseState = null;
    protected statesStack: Stack<BaseState> = new Stack<BaseState>();

    public useState(state: BaseState): void {
        if (this.currentState) {
            this.currentState.onStateDestroy();
        }

        this.currentState = state;
        this.currentState.setController(this);
        this.currentState.onStateCreating();
    }
    public pushState(state: BaseState): void {
        if (this.currentState) {
            this.currentState.onStatePush();
            this.statesStack.push(this.currentState);
        }

        this.currentState = state;
        this.currentState.setController(this);
        this.currentState.onStateCreating();
    }
    public popState(): void {
        if (this.statesStack.size() < 1) {
            throw new Error('Попытка достать состояние из пустого стека состояний');
        }

        const oldState = this.currentState;
        const newState = this.currentState = this.statesStack.pop();
        newState.setController(this);

        oldState.onStateDestroy();
        newState.onStatePop();
    }

    public getStatesStack(): Stack<BaseState> {
        return this.statesStack;
    }

    public executeCommand(command: Commands): void {
        if (this.currentState) {
            this.currentState.executeCommand(command);
        }
    }
    public createElement(): HTMLElement {
        if (this.currentState) {
            return this.currentState.createElement();
        }
        return render(HTMLTags.Div, null, 'no content');
    }
}