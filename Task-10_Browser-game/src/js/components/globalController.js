import { MenuComponent } from "./menuComponent";

export function GlobalController() {
    let instance = this;
    this.currentController = undefined;
    this.controllerStack = [];
    this.gameData = {};
};

GlobalController.prototype = {
    init() {
        let mainController = this;

        const mainMenu = {
            items: {
                newGame: {
                    value: "Новая игра",
                    isActive: () => true,
                },
                continue: {
                    value: "Продолжить",
                    isActive: () => mainController.controllerStack.length > 0,
                },
                help: {
                    value: "Справка",
                    isActive: () => true,
                },
            },
            component: null
        };
        mainMenu.component = new MenuComponent([mainMenu.items.newGame, mainMenu.items.continue, mainMenu.items.help], { element: 'Главное меню' });

        mainController.pushController(mainMenu.component);

        mainMenu.component.items.actions[mainMenu.items.newGame.value] = function() {
            alert(mainMenu.items.newGame.value);
        }
        mainMenu.component.items.actions[mainMenu.items.continue.value] = function() {
            mainController.popController();
        }
        mainMenu.component.items.actions[mainMenu.items.help.value] = function() {
            alert(mainMenu.items.help.value);
        }
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
    },
    popController() {
        this.currentController = this.controllerStack.pop();
    },
};