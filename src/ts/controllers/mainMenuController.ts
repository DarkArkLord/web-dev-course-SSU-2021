import { MenuComponent } from "./components/menuComponent";
import { Commands } from "../controls";
import { TownMenuController } from "./townController";
import { InfoComponent, ButtonsConfig } from "./components/infoComponent";

export enum MainMenuControllerTexts {
    BtnNewGame = 'CTRL-MAIN-MENU-BTN-NG',
    BtnContinue = 'CTRL-MAIN-MENU-BTN-CNT',
    BtnHelp = 'CTRL-MAIN-MENU-BTN-HELP',
};

export class MainMenuController extends MenuComponent {
    constructor() {
        const items = {
            newGame: {
                value: MainMenuControllerTexts.BtnNewGame,
                isActive: () => true,
            },
            continue: {
                value: MainMenuControllerTexts.BtnContinue,
                isActive: () => false,
            },
            help: {
                value: MainMenuControllerTexts.BtnHelp,
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
    commonInit(): void {
        const instance = this;    

        Object.values(instance.menuConfig.items).forEach((item: TMenuItem) => {
            item.description = instance.globalController.translationsUtils.enumTranslations[item.value];
        })
    }
}