declare type TGameData = {
    level: number,
};

declare interface IGlobalController {
    gameData: TGameData;
    currentController?: IController;
    controllerStack: Array<IController>;

    resetGameData(): void;
    saveGameData(): void;
    loadGameData(): void;

    pushController(controller: IController): void;
    popController(): void;

    executeCommand(command: string): void;
    createElement(): HTMLElement;
}

declare interface IController {
    onPush(globalController: IGlobalController): void;
    onPop(): void;

    executeCommand(command: string): void;
    createElement(): HTMLElement;
}