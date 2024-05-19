import { Commands } from "../controls";
import { HTMLTags, render } from "../utils/render";
import { BaseMenuState } from "./baseStates/baseMenuState";

export class MainMenuState extends BaseMenuState {
    constructor() {
        const items = {
            newGame: {
                value: "Новая игра",
                description: () => "Новая игра",
                isActive: () => true,
            },
            continue: {
                value: "Продолжить",
                description: () => "Продолжить",
                isActive: () => false,
            },
            help: {
                value: "Справка",
                description: () => "Справка",
                isActive: () => true,
            },
        };

        super("Главное меню", [items.newGame, items.continue, items.help]);
        const instance = this;

        items.continue.isActive = () => instance.dataController.getData() != undefined
            && instance.statesController.getStatesStackSize() > 0;

        this.commandActions[Commands.Back] = function () {
            if (items.continue.isActive()) {
                instance.statesController.popState();
            }
        }

        this.menuConfig.actions[items.newGame.value] = function () {
            // const town = new TownMenuController();
            // instance.globalController.pushController(town);
            // instance.globalController.resetGameData();
            // instance.globalController.controllerStack = [];
        };
        this.menuConfig.actions[items.continue.value] = function () {
            instance.statesController.popState();
        };
        this.menuConfig.actions[items.help.value] = function () {
            // const controller = new InfoComponent(['Помощь'], ButtonsConfig.onlyBack);
            // instance.globalController.pushController(controller);
        };
    }

    protected createHeaderElement(): Render.TChild {
        return "Главное меню";
    }
}