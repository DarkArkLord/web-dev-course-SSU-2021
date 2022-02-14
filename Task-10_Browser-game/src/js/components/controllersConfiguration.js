import { MenuComponent } from './menuComponent.js'
import { GlobalController } from './globalController.js'

export const mainController = new GlobalController();

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
