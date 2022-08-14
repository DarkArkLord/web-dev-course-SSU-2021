import { MenuComponent } from "./components/menuComponent";
import { InfoComponent, ButtonsConfig } from "./components/infoComponent";
import { Commands } from "../controls";
import { MainMenuController } from "./mainMenuController";
import { MapController } from "./mapController";
import { generateMap_Forest, getFieldOfView } from "../utils/maps";
import { ShowStatesController } from "./showStatesController";
import { getRange } from "../utils/common";
import { BattleController } from "./battleController";

export class TownMenuController extends MenuComponent {
    constructor() {
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

        super([items.toMap, items.toBattle, items.states, items.other], 'Город');
        const instance = this;

        this.menuConfig.actions[items.toMap.value] = function () {
            instance.globalController.saveGameData();
            const lastLevel = instance.globalController.gameData.lastOpenMapLevel;
            const controller = new SelectMapLevelController(lastLevel);
            instance.globalController.pushController(controller);
        };
        this.menuConfig.actions[items.toBattle.value] = function () {
            instance.globalController.saveGameData();
            const lastLevel = instance.globalController.gameData.lastOpenMapLevel;
            const controller = new SelectBattleLevelController(lastLevel);
            instance.globalController.pushController(controller);
        };
        this.menuConfig.actions[items.states.value] = function () {
            const controller = new ShowStatesController();
            instance.globalController.pushController(controller);
        };
        this.menuConfig.actions[items.other.value] = function () {
            const controller = new InfoComponent(['Другое'], ButtonsConfig.onlyBack);
            instance.globalController.pushController(controller);
        };

        this.commandActions[Commands.Back] = function () {
            const menuController = new MainMenuController();
            instance.globalController.pushController(menuController);
        }
    }
    onPush(globalController: IGlobalController): void {
        super.onPush(globalController);
        this.globalController.saveGameData();
    }
    onPop(): void {
        super.onPop();
        this.globalController.saveGameData();
    }
}

const subLevelCount = 3;

class SelectMapLevelController extends MenuComponent {
    constructor(lastLevel: number) {
        const backTitle = 'Назад';
        const levelItems = getRange(lastLevel, 1)
            .map(level => {
                return {
                    level: level,
                    title: `Уровень ${level}`,
                };
            });
        super([...levelItems, { title: backTitle }].map(item => {
            return {
                value: item.title,
                isActive: () => true,
            };
        }), 'Выберите уровень');
        const instance = this;

        instance.commandActions[Commands.Back] = function () {
            instance.globalController.popController();
        };

        instance.menuConfig.actions[backTitle] = function () {
            instance.globalController.popController();
        };

        levelItems.forEach(item => {
            instance.menuConfig.actions[item.title] = function () {
                instance.globalController.popController();
                function paramsByLevel(level: number): MapTypes.TGeneratorParams {
                    return {
                        width: 10 * level,
                        height: 10 * level,
                        getFOV: getFieldOfView,
                        flagCount: level
                    }
                }
                const mapParams: TMapControllerParams = {
                    mainLevel: item.level,
                    generators: getRange(subLevelCount)
                        .map(level => () => generateMap_Forest(paramsByLevel(level + 1))),
                };
                const controller = new MapController(mapParams);
                instance.globalController.pushController(controller);
            };
        });
    }
}

class SelectBattleLevelController extends MenuComponent {
    constructor(lastLevel: number) {
        const backTitle = 'Назад';
        const levelItems = getRange(lastLevel, 1)
            .flatMap(mainLevel => {
                return getRange(subLevelCount, 1)
                    .map(subLevel => ({
                        mainLevel,
                        subLevel,
                        level: (mainLevel - 1) * subLevelCount + subLevel,
                        title: `Уровень ${mainLevel}-${subLevel}`,
                    }));
            });
        super([...levelItems, { title: backTitle }].map(item => {
            return {
                value: item.title,
                isActive: () => true,
            };
        }), 'Выберите уровень');
        const instance = this;

        instance.commandActions[Commands.Back] = function () {
            instance.globalController.popController();
        };

        instance.menuConfig.actions[backTitle] = function () {
            instance.globalController.popController();
        };

        levelItems.forEach(item => {
            instance.menuConfig.actions[item.title] = function () {
                instance.globalController.popController();
                const controller = new BattleController(item.level);
                instance.globalController.pushController(controller);
            };
        });
    }
}