import { MenuComponent } from "./components/menuComponent";
import { Commands } from "../controls";
import { mainMenuController } from "./mainMenuController";
import { MapController, testMapController } from "./mapController";
import { testGenerator } from "./components/mapComponent";
import { getRange } from "../utils";

const townMenuControllerItems = {
    toMap: {
        value: "Отправиться",
        isActive: () => true,
    },
    toBattle: {
        value: "Искать врагов",
        isActive: () => false,
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
        let mapLevelItems = getRange(mainController.gameData.level)
            .map(lvl => {
                return {
                    level: lvl,
                    value: `Уровень ${lvl}`,
                    isActive: () => true,
                };
            });

        let selectLevelController = new MenuComponent(mapLevelItems, { element: 'Выберите урорвень' });
        mapLevelItems.forEach(lvl => {
            selectLevelController.items.actions[lvl.value] = function() {
                let mapController = new MapController();
                mainController.popController();
                mainController.pushController(mapController);
            };
        });

        mainController.pushController(selectLevelController);
    }
    townMenuController.items.actions[townMenuControllerItems.toBattle.value] = function() {
        // smth
    }
    townMenuController.items.actions[townMenuControllerItems.other.value] = function() {
        // smth
    }
}