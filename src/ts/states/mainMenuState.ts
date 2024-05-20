import { Commands } from "../controls";
import { HTMLTags, render } from "../utils/render";
import { BaseMenuState } from "./baseStates/baseMenuState";
import { InfoButtonsConfig, InfoState } from "./infoState";
import { TownMenuState } from "./townStates";

export class MainMenuState extends BaseMenuState {
    constructor() {
        const items = {
            newGame: {
                value: 'Новая игра',
                description: () => 'Новая игра',
                isActive: () => true,
            },
            continue: {
                value: 'Продолжить',
                description: () => 'Продолжить',
                isActive: () => false,
            },
            help: {
                value: 'Справка',
                description: () => 'Справка',
                isActive: () => true,
            },
        };

        super('Главное меню', [items.newGame, items.continue, items.help]);
        const instance = this;

        // настройка пунктов меню
        this.menuConfig.actions[items.newGame.value] = function () {
            const town = new TownMenuState();
            instance.getStatesController().clearStatesStack();
            instance.getStatesController().useState(town);
            instance.getData().getGameData().resetGameData();
        };
        this.menuConfig.actions[items.continue.value] = function () {
            instance.getStatesController().popState();
        };
        this.menuConfig.actions[items.help.value] = function () {
            const helpState = new InfoState(['Помощь'], InfoButtonsConfig.onlyBack, false);
            instance.getStatesController().pushState(helpState);
        };

        // Установка активности пункта "Продолжить"
        items.continue.isActive = () => instance.getData().getGameData().getData() != undefined
            && instance.getStatesController().getStatesStackSize() > 0;

        // Кнопка назад - назад
        this.commandActions[Commands.Back] = function () {
            if (items.continue.isActive()) {
                instance.getStatesController().popState();
            }
        }
    }

    protected createHeaderElement(): Render.TChild {
        return 'Главное меню';
    }
}