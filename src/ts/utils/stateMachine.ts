import { Commands } from "../controls";
import { Stack } from "./common";
import { DataController } from "./dataController";
import { HTMLTags, render } from "./render";

declare type TCommandActions = {
    [command in Commands]: () => void;
};

export abstract class BaseState {
    private stateTitle: string;

    protected statesController: StatesController;
    protected dataController: DataController<TGameData>;
    protected commandActions: TCommandActions;

    constructor(stateTitle: string) {
        this.stateTitle = stateTitle;
        this.commandActions = {
            [Commands.Up]: undefined,
            [Commands.Down]: undefined,
            [Commands.Left]: undefined,
            [Commands.Right]: undefined,
            [Commands.Use]: undefined,
            [Commands.Back]: undefined,
        };
    }

    public getStateTitle(): string {
        return this.stateTitle;
    }

    public setStatesController(controller: StatesController) {
        this.statesController = controller;
    }
    public setDataController(dataController: DataController<TGameData>) {
        this.dataController = dataController;
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

    protected dataController: DataController<TGameData>;

    constructor(dataController: DataController<TGameData>) {
        this.dataController = dataController;
    }

    public useState(state: BaseState): void {
        if (this.currentState) {
            this.currentState.onStateDestroy();
        }

        this.currentState = state;
        this.currentState.setStatesController(this);
        this.currentState.setDataController(this.dataController);
        this.currentState.onStateCreating();
    }
    public pushState(state: BaseState): void {
        if (this.currentState) {
            this.currentState.onStatePush();
            this.statesStack.push(this.currentState);
        }

        this.currentState = state;
        this.currentState.setStatesController(this);
        this.currentState.setDataController(this.dataController);
        this.currentState.onStateCreating();
    }
    public popState(): void {
        if (this.statesStack.size() < 1) {
            throw new Error('Попытка достать состояние из пустого стека состояний');
        }

        const oldState = this.currentState;
        const newState = this.currentState = this.statesStack.pop();
        newState.setStatesController(this);
        this.currentState.setDataController(this.dataController);

        oldState.onStateDestroy();
        newState.onStatePop();
    }

    public getStatesStackSize(): number {
        return this.statesStack.size();
    }
    public clearStatesStack(): void {
        while (this.statesStack.size() > 0) {
            const state = this.statesStack.pop();
            state.onStateDestroy();
        }
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