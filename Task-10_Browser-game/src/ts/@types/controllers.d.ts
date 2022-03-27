declare type MainGameData = {
    level: number,
};

declare interface IMainController {
    gameData: MainGameData;
    currentController: IController;
    controllerStack: Array<IController>;

    resetGameData(): void;
    saveGameData(): void;
    loadGameData(): void;

    pushController(controller: IController): void;
    popController(): void;

    init(): void;
    executeCommand(command: Commands): void;
    createElement(): HTMLElement;
}

declare interface IController {
    customInit(mainController: IMainController): void;
    onPush(mainController: IMainController): void;
    onPop(): void;
    executeCommand(command: Commands): void;
    createElement(): void;
}