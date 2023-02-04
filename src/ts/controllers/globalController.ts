import { Commands } from "../controls";
import { render } from "../render/jsx-runtime";
import { getCharacterTemplate } from "../rpg/characters";
import { MainMenuController } from "./mainMenuController";
import { TownMenuController } from "./townController";

// TODO
// Вынести в настройки?
import { TranslationsUtils } from "../utils/translations/ru";

const GAME_SAVE_NAME = 'GAME-SAVE'

export class GlobalController implements IGlobalController {
    display: HTMLElement;
    gameData: TGameData;
    translationsUtils: TTranslationsUtils;

    currentController: IController;
    controllerStack: Array<IController>;

    constructor(display: HTMLElement) {
        this.display = display;
        this.gameData = undefined;
        this.translationsUtils = TranslationsUtils;

        this.currentController = undefined;
        this.controllerStack = [];

        this.loadGameData();

        const townController = new TownMenuController();
        this.pushController(townController);
        const menuController = new MainMenuController();
        this.pushController(menuController);
    }

    resetGameData(): void {
        this.gameData = {
            lastOpenMapLevel: 1,
            character: getCharacterTemplate('PLAYER'),
        };
    }
    saveGameData(): void {
        const dataJson = JSON.stringify(this.gameData);
        window.localStorage.setItem(GAME_SAVE_NAME, dataJson);
    }
    loadGameData(): void {
        const savedData = window.localStorage.getItem(GAME_SAVE_NAME);
        const parsedData = JSON.parse(savedData) as TGameData;
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
        if (this.currentController) {
            this.currentController.executeCommand(command);
        }
    }
    createElement(): HTMLElement {
        if (this.currentController) {
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