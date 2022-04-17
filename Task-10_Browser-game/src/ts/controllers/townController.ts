import { MenuComponent } from "./components/menuComponent";
import { InfoComponent, ButtonsConfig } from "./components/infoComponent";
import { Commands } from "../controls";
import { MainMenuController } from "./mainMenuController";

const items = {
    toMap: {
        value: "Отправиться",
        isActive: () => true,
    },
    toBattle: {
        value: "Искать врагов",
        isActive: () => true,
    },
    states: {
        value: "Характеристики",
        isActive: () => true,
    },
    other: {
        value: "Другое",
        isActive: () => false,
    },
};

export class TownMenuController extends MenuComponent {
    constructor() {
        super([items.toMap, items.toBattle, items.states, items.other], 'Город');
        const instance = this;

        this.menuConfig.actions[items.toMap.value] = function () {
            const controller = new InfoComponent(['Отправиться'], ButtonsConfig.onlyBack);
            instance.globalController.pushController(controller);
        };
        this.menuConfig.actions[items.toBattle.value] = function () {
            const controller = new InfoComponent(['Искать врагов'], ButtonsConfig.onlyBack);
            instance.globalController.pushController(controller);
        };
        this.menuConfig.actions[items.states.value] = function () {
            const controller = new InfoComponent(['Характеристики'], ButtonsConfig.onlyBack);
            instance.globalController.pushController(controller);
        };
        this.menuConfig.actions[items.other.value] = function () {
            const controller = new InfoComponent(['Другое'], ButtonsConfig.onlyBack);
            instance.globalController.pushController(controller);
        };

        this.commandActions[Commands.Back] = function() {
            const menuController = new MainMenuController();
            instance.globalController.pushController(menuController);
        }
    }
}