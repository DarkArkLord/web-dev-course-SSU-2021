import { Commands } from "../controls";
import { renderCharacter } from "../rpg/characterToHtml";
import { BaseState } from "../utils/stateMachine"
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

        this.menuConfig.actions[townButtons.toMap.value] = function () {
            // instance.globalController.saveGameData();
            // const lastLevel = instance.globalController.gameData.lastOpenMapLevel;
            // const controller = new SelectMapLevelController(lastLevel);
            // instance.statesController.pushState(controller);
        };
        this.menuConfig.actions[townButtons.toBattle.value] = function () {
            // instance.globalController.saveGameData();
            // const lastLevel = instance.globalController.gameData.lastOpenMapLevel;
            // const controller = new SelectBattleLevelController(lastLevel);
            // instance.statesController.pushState(controller);
        };
        this.menuConfig.actions[townButtons.temple.value] = function () {
            // const controller = new TempleMenuController();
            // instance.statesController.pushState(controller);
        };
        this.menuConfig.actions[townButtons.states.value] = function () {
            const character = instance.dataController.getData().character;
            const characterTable = renderCharacter(character);

            const controller = new InfoState([characterTable], InfoButtonsConfig.onlyBack, false);

            instance.statesController.pushState(controller);
        };
        this.menuConfig.actions[townButtons.other.value] = function () {
            const controller = new InfoState(['Другое'], InfoButtonsConfig.onlyBack, false);
            instance.statesController.pushState(controller);
        };

        this.commandActions[Commands.Back] = function () {
            const menuController = new MainMenuState();
            instance.statesController.pushState(menuController);
        }

    }
}