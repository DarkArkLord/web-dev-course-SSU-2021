import { MenuComponent } from "./components/menuComponent";
import { Commands } from "../controls";
import { mainMenuController } from "./mainMenuController";
import { MapController } from "./mapController";
import { testGenerator } from "./components/mapComponent";
import { getRange } from "../utils";
import { BattleController } from "./battleController";

const townMenuControllerItems = {
    toMap: {
        value: "Отправиться",
        isActive: () => true,
    },
    toBattle: {
        value: "Искать врагов",
        isActive: () => true,
    },
    other: {
        value: "Другое",
        isActive: () => false,
    },
};

export const townMenuController = new MenuComponent([
        townMenuControllerItems.toMap,
        townMenuControllerItems.toBattle,
        townMenuControllerItems.other
    ], { element: 'Город' });

townMenuController.customInit = (mainController) => {
    townMenuController.commandActions[Commands.Back] = function() {
        mainController.pushController(mainMenuController);
    }

    townMenuController.items.actions[townMenuControllerItems.toMap.value] = function() {
        let mapLevelItems = getRange(mainController.gameData.level, 1)
            .map(lvl => {
                return {
                    level: lvl,
                    value: `Уровень ${lvl}`,
                    isActive: () => true,
                };
            });

        let selectLevelController = new MenuComponent(mapLevelItems, { element: 'Выберите урорвень' });

        selectLevelController.commandActions[Commands.Back] = function() {
            mainController.popController();
        }

        mapLevelItems.forEach(lvl => {
            selectLevelController.items.actions[lvl.value] = function() {
                const mapParams = {
                    sizeByLevel: (level) => 5 * level + 10,
                    fieldOfView: () => 12,
                    mainLevel: lvl.level,
                    startLevel: 1,
                    endLevel: 3,
                    generator: testGenerator,
                };

                let mapController = new MapController(mapParams);
                mainController.popController();
                mainController.pushController(mapController);
            };
        });

        mainController.pushController(selectLevelController);
    }
    townMenuController.items.actions[townMenuControllerItems.toBattle.value] = function() {
        let mapLevelItems = getRange(mainController.gameData.level, 1)
            .map(lvl => {
                return {
                    level: lvl,
                    value: `Уровень ${lvl}`,
                    isActive: () => true,
                };
            });

        let selectLevelController = new MenuComponent(mapLevelItems, { element: 'Выберите урорвень' });

        selectLevelController.commandActions[Commands.Back] = function() {
            mainController.popController();
        }

        mapLevelItems.forEach(lvl => {
            selectLevelController.items.actions[lvl.value] = function() {
                let battleController = new BattleController(lvl);
                mainController.popController();
                mainController.pushController(battleController);
            };
        });

        mainController.pushController(selectLevelController);
    }
    townMenuController.items.actions[townMenuControllerItems.other.value] = function() {
        // smth
    }
}