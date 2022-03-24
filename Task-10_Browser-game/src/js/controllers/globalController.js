import { townMenuController } from "./townController";
import { mainMenuController } from "./mainMenuController";
import { getDefaultPlayer } from "./battleController";

export function GlobalController() {
    let instance = this;
    this.currentController = undefined;
    this.controllerStack = [];
    this.gameData = {
        level: 1,
        character: getDefaultPlayer(),
    };
    this.load();
};

GlobalController.prototype = {
    resetGameData() {
        this.gameData = {
            level: 1,
            character: getDefaultPlayer(),
        };
    },
    save() {
        window.localStorage.setItem('save', JSON.stringify(this.gameData));
    },
    load() {
        this.gameData = JSON.parse(window.localStorage.getItem('save'));
    },
    init() {
        let mainController = this;
        mainMenuController.init(mainController);
        mainController.pushController(townMenuController);
        mainController.pushController(mainMenuController);
    },
    executeCommand(command) {
        if (this.currentController) {
            this.currentController.executeCommand(command);
        }
    },
    createElement() {
        if (this.currentController) {
            return this.currentController.createElement();
        }
        return { element: 'no content' };
    },
    pushController(controller) {
        if (this.currentController) {
            this.controllerStack.push(this.currentController);
        }
        this.currentController = controller;
        this.currentController.init(this);
    },
    popController() {
        this.currentController = this.controllerStack.pop();
    },
};