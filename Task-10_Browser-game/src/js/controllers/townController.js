import { MenuComponent } from "./components/menuComponent";
import { Commands } from "../controls";
import { mainMenuController } from "./mainMenuController";
import { testMapController } from "./mapController";

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
    ], { element: 'Главное меню' });

townMenuController.customInit = (mainController) => {
    townMenuController.commandActions[Commands.Back] = function() {
        mainController.pushController(mainMenuController);
    }

    townMenuController.items.actions[townMenuControllerItems.toMap.value] = function() {
        mainController.pushController(testMapController);
    }
    townMenuController.items.actions[townMenuControllerItems.toBattle.value] = function() {
        // smth
    }
    townMenuController.items.actions[townMenuControllerItems.other.value] = function() {
        // smth
    }
}