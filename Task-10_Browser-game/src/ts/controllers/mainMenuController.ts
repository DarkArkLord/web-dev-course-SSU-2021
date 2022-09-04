import { MenuComponent } from "./components/menuComponent";
import { Commands } from "../controls";
import { TownMenuController } from "./townController";
import { InfoComponent, ButtonsConfig } from "./components/infoComponent";

export class MainMenuController extends MenuComponent {
    constructor() {
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

        super([items.newGame, items.continue, items.help], 'Главное меню');

        const instance = this;
        items.continue.isActive = () => instance.globalController.gameData != undefined
            && instance.globalController.controllerStack.length > 0;

        this.commandActions[Commands.Back] = function () {
            if (items.continue.isActive()) {
                instance.globalController.popController();
            }
        }

        this.menuConfig.actions[items.newGame.value] = function () {
            const town = new TownMenuController();
            instance.globalController.pushController(town);
            instance.globalController.resetGameData();
            instance.globalController.controllerStack = [];
        };
        this.menuConfig.actions[items.continue.value] = function () {
            instance.globalController.popController();
        };
        this.menuConfig.actions[items.help.value] = function () {
            const controller = new InfoComponent(['Помощь'], ButtonsConfig.onlyBack);
            instance.globalController.pushController(controller);
        };
    }
}