import { Commands } from "../controls";
import { renderCharacter } from "../rpg/characterToHtml";
import { BaseMenuState } from "./baseStates/baseMenuState";
import { InfoButtonsConfig, InfoState } from "./infoState";
import { MainMenuState } from "./mainMenuState";

export class TownMenuState extends BaseMenuState {
    constructor() {
        const townButtons = {
            toMap: {
                value: 'Отправиться',
                description: () => 'Отправиться',
                isActive: () => true,
            },
            toBattle: {
                value: 'Искать врагов',
                description: () => 'Искать врагов',
                isActive: () => true,
            },
            temple: {
                value: 'Храм',
                description: () => 'Храм',
                isActive: () => true,
            },
            states: {
                value: 'Характеристики',
                description: () => 'Характеристики',
                isActive: () => true,
            },
            other: {
                value: 'Другое',
                description: () => 'Другое',
                isActive: () => false,
            },
        };

        super('Город', [townButtons.toMap, townButtons.toBattle, townButtons.temple, townButtons.states, townButtons.other]);
        const instance = this;
        const gameData = () => instance.getData().getGameData();

        // Настройка пунктов меню
        this.menuConfig.actions[townButtons.toMap.value] = function () {
            gameData().saveGameData();
            const lastLevel = gameData().getData().lastOpenMapLevel;
            // const controller = new SelectMapLevelController(lastLevel);
            // instance.getStatesController().pushState(controller);
        };
        this.menuConfig.actions[townButtons.toBattle.value] = function () {
            gameData().saveGameData();
            const lastLevel = gameData().getData().lastOpenMapLevel;
            // const controller = new SelectBattleLevelController(lastLevel);
            // instance.getStatesController().pushState(controller);
        };
        this.menuConfig.actions[townButtons.temple.value] = function () {
            const state = new TempleMenuController();
            instance.getStatesController().pushState(state);
        };
        this.menuConfig.actions[townButtons.states.value] = function () {
            const character = gameData().getData().character;
            const characterTable = renderCharacter(character);

            const state = new InfoState([characterTable], InfoButtonsConfig.onlyBack, false);

            instance.getStatesController().pushState(state);
        };
        this.menuConfig.actions[townButtons.other.value] = function () {
            const state = new InfoState(['Другое'], InfoButtonsConfig.onlyBack, false);
            instance.getStatesController().pushState(state);
        };

        // Настройка активности пунктов меню
        townButtons.toMap.isActive = activeOnPositiveHP;
        townButtons.toBattle.isActive = activeOnPositiveHP;

        function activeOnPositiveHP() {
            const player = gameData().getData().character;
            const health = player.commonStates.health;
            return health.current > 0;
        }

        // Кнопка назад - в меню
        this.commandActions[Commands.Back] = function () {
            const menuController = new MainMenuState();
            instance.getStatesController().pushState(menuController);
        }
    }
}

class SelectMapLevelState {
    //
}

class SelectBattleLevelState {
    //
}

class TempleMenuController extends BaseMenuState {
    constructor() {
        const templeButtons = {
            heal: {
                value: 'Исцеление',
                description: () => 'Исцеление',
                isActive: () => true,
            },
            back: {
                value: 'Назад',
                description: () => 'Назад',
                isActive: () => true,
            },
        };

        super('Город.Церковь', [templeButtons.heal, templeButtons.back]);
        const instance = this;

        // Настройка пунктов меню
        this.menuConfig.actions[templeButtons.heal.value] = function () {
            const player = instance.getData().getGameData().getData().character;
            const hp = player.commonStates.health;
            const healedHealth = hp.max - hp.current;
            hp.current = hp.max;

            const infoText = `Вылечено ${healedHealth} здоровья`;
            const state = new InfoState([infoText], InfoButtonsConfig.onlyBack, false);

            instance.getStatesController().pushState(state);
        }

        this.menuConfig.actions[templeButtons.back.value] = function () {
            instance.getStatesController().popState();
        }

        // Настройка активности пунктов меню
        templeButtons.heal.isActive = () => {
            const player = instance.getData().getGameData().getData().character;
            const health = player.commonStates.health;
            return health.current < health.max;
        };

        // Кнопка назад - назад
        this.commandActions[Commands.Back] = function () {
            instance.getStatesController().popState();
        }
    }
}