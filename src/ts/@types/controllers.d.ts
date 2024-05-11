type Commands = import('../controls').Commands;

declare type TGameData = {
    lastOpenMapLevel: number,
    character: RPG.TCharacter,
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

    executeCommand(command: Commands): void;
    createElement(): HTMLElement;
    reDraw(): void;
}

declare interface IController {
    commonInit(): void;
    onPush(globalController: IGlobalController): void;
    onPop(): void;

    executeCommand(command: Commands): void;
    createElement(): HTMLElement;
}