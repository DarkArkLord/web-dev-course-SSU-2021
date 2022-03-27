import { Commands } from "../controls";
import { render } from "../render/jsx-runtime";

const GAME_SAVE_NAME = 'GAME-SAVE'

export class GlobalController implements IGlobalController {
    gameData: TGameData;
    currentController: IController;
    controllerStack: Array<IController>;

    constructor() {
        this.gameData = undefined;
        this.currentController = undefined;
        this.controllerStack = [];
        this.loadGameData();
    }

    resetGameData(): void {
        this.gameData = {
            level: 1,
        };
    }
    saveGameData(): void {
        const dataJson = JSON.stringify(this.gameData);
        window.localStorage.setItem(GAME_SAVE_NAME, dataJson);
    }
    loadGameData(): void {
        const savedData = window.localStorage.getItem(GAME_SAVE_NAME);
        const parsedData = <TGameData>JSON.parse(savedData);
        this.gameData = parsedData;
    }

    pushController(controller: IController): void {
        if (this.currentController) {
            this.controllerStack.push(this.currentController);
        }
        this.currentController = controller;
        this.currentController.onPush(this);
    }
    popController(): void {
        this.currentController = this.controllerStack.pop();
        this.currentController.onPop();
    }

    executeCommand(command: Commands): void {
        if(this.currentController) {
            this.currentController.executeCommand(command);
        }
    }
    createElement(): HTMLElement {
        if(this.currentController) {
            this.currentController.createElement();
        }
        return render('div', null, 'no content');
    }
}