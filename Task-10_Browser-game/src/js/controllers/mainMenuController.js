import { MenuComponent } from "./components/menuComponent";
import { Commands } from "../controls";
import { helpController } from "./helpController";
import { townMenuController } from "./townController";

const items = {
    newGame: {
        value: "Новая игра",
        isActive: () => true,
    },
    continue: {
        value: "Продолжить",
        isActive: () => false,
    },
    help: {
        value: "Справка",
        isActive: () => true,
    },
};

export const mainMenuController = new MenuComponent([items.newGame, items.continue, items.help], { element: 'Главное меню' });

mainMenuController.customInit = (mainController) => {
    mainMenuController.commandActions[Commands.Back] = function() {
        if(mainController.controllerStack.length > 0) {
            mainController.popController();
        }
    }

    items.continue.isActive = () => mainController.controllerStack.length > 0;

    mainMenuController.items.actions[items.newGame.value] = function() {
        mainController.pushController(townMenuController);
        mainController.controllerStack = [];
    }
    mainMenuController.items.actions[items.continue.value] = function() {
        mainController.popController();
    }
    mainMenuController.items.actions[items.help.value] = function() {
        mainController.pushController(helpController);
    }
}