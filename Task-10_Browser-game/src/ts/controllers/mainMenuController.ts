import { MenuComponent } from "./components/menuComponent";
import { InfoComponent, ButtonsConfig } from "./components/infoComponent";

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

export class MainMenuController extends MenuComponent {
    constructor() {
        super([items.newGame, items.continue, items.help], 'Главное меню');
        const instance = this;
        this.menuConfig.actions[items.newGame.value] = function() {
            const controller = new InfoComponent(['Новая игра'], ButtonsConfig.onlyBack);
            instance.globalController.pushController(controller);
        };
        this.menuConfig.actions[items.continue.value] = function() {
            const controller = new InfoComponent(['Продолжить'], ButtonsConfig.onlyBack);
            instance.globalController.pushController(controller);
        };
        this.menuConfig.actions[items.help.value] = function() {
            const controller = new InfoComponent(['Помощь'], ButtonsConfig.onlyBack);
            instance.globalController.pushController(controller);
        };
    }
}