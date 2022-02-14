import { MenuComponent } from "./components/menuComponent";

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

export const mainMenuComponent = new MenuComponent([items.newGame, items.continue, items.help], { element: 'Главное меню' });

mainMenuComponent.customInit = (mainController) => {
    items.continue.isActive = () => mainController.controllerStack.length > 0;

    mainMenuComponent.items.actions[items.newGame.value] = function() {
        alert(items.newGame.value);
    }
    mainMenuComponent.items.actions[items.continue.value] = function() {
        mainController.popController();
    }
    mainMenuComponent.items.actions[items.help.value] = function() {
        alert(items.help.value);
    }
}