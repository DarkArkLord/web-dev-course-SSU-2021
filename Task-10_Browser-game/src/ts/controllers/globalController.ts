import { Commands } from "../controls";
import { render } from "../render/jsx-runtime";
import { MainMenuController } from "./mainMenuController";

const GAME_SAVE_NAME = 'GAME-SAVE'

export class GlobalController implements IGlobalController {
    gameData: TGameData;
    currentController: IController;
    controllerStack: Array<IController>;
    display: HTMLElement;

    constructor(display: HTMLElement) {
        this.display = display;
        this.gameData = undefined;
        this.currentController = undefined;
        this.controllerStack = [];
        this.loadGameData();

        const menuController = new MainMenuController();
        this.pushController(menuController);
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
            return this.currentController.createElement();
        }
        return render('div', null, 'no content');
    }
    reDraw(): void {
        const content = this.createElement();
        this.display.innerHTML = '';
        this.display.appendChild(content);
    }
}