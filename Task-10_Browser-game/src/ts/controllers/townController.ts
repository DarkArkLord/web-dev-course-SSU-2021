import { MenuComponent } from "./components/menuComponent";
import { InfoComponent, ButtonsConfig } from "./components/infoComponent";
import { Commands } from "../controls";
import { MainMenuController } from "./mainMenuController";
import { MapController } from "./mapController";
import { generateMap_Forest, getFieldOfView } from "../utils/maps";
import { getRange } from "../utils/common";
import { BattleController } from "./battleController";
import { renderCharacter } from "../rpg/characterToHtml";

const townButtons = {
    toMap: {
        value: "Отправиться",
        isActive: () => true,
    },
    toBattle: {
        value: "Искать врагов",
        isActive: () => true,
    },
    temple: {
        value: "Храм",
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

export class TownMenuController extends MenuComponent {
    constructor() {
        super([townButtons.toMap, townButtons.toBattle, townButtons.temple, townButtons.states, townButtons.other], 'Город');
        const instance = this;

        this.menuConfig.actions[townButtons.toMap.value] = function () {
            instance.globalController.saveGameData();
            const lastLevel = instance.globalController.gameData.lastOpenMapLevel;
            const controller = new SelectMapLevelController(lastLevel);
            instance.globalController.pushController(controller);
        };
        this.menuConfig.actions[townButtons.toBattle.value] = function () {
            instance.globalController.saveGameData();
            const lastLevel = instance.globalController.gameData.lastOpenMapLevel;
            const controller = new SelectBattleLevelController(lastLevel);
            instance.globalController.pushController(controller);
        };
        this.menuConfig.actions[townButtons.temple.value] = function () {
            const controller = new TempleMenuController();
            instance.globalController.pushController(controller);
        };
        this.menuConfig.actions[townButtons.states.value] = function () {
            const character = instance.globalController.gameData.character;
            const characterTable = renderCharacter(character);

            const controller = new InfoComponent([characterTable], ButtonsConfig.onlyBack);
            controller.commandActions[Commands.Back] = function () {
                controller.globalController.popController();
            }

            instance.globalController.pushController(controller);
        };
        this.menuConfig.actions[townButtons.other.value] = function () {
            const controller = new InfoComponent(['Другое'], ButtonsConfig.onlyBack);
            instance.globalController.pushController(controller);
        };

        this.commandActions[Commands.Back] = function () {
            const menuController = new MainMenuController();
            instance.globalController.pushController(menuController);
        }
    }
    commonInit(): void {
        const instance = this;
        instance.globalController.saveGameData();
        function activeOnPositiveHP() {
            const player = instance.globalController.gameData.character;
            const health = player.commonStates.health;
            return health.current > 0;
        }
        townButtons.toMap.isActive = activeOnPositiveHP;
        townButtons.toBattle.isActive = activeOnPositiveHP;
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

const templeButtons = {
    heal: {
        value: "Исцеление",
        isActive: () => true,
    },
    back: {
        value: "Назад",
        isActive: () => true,
    },
};

class TempleMenuController extends MenuComponent {
    constructor() {
        super([templeButtons.heal, templeButtons.back], 'Городская церковь');
        const instance = this;

        this.menuConfig.actions[templeButtons.heal.value] = function () {
            const player = instance.globalController.gameData.character;
            const hp = player.commonStates.health;
            const healedHealth = hp.max - hp.current;
            const infoText = `Вылечено ${healedHealth} здоровья`;
            hp.current = hp.max;
            const controller = new InfoComponent([infoText], ButtonsConfig.onlyBack);
            instance.globalController.pushController(controller);
        }

        this.menuConfig.actions[templeButtons.back.value] = function () {
            instance.globalController.popController();
        }

        this.commandActions[Commands.Back] = function () {
            instance.globalController.popController();
        }
    }
    commonInit(): void {
        const instance = this;
        function activeOnNotMaxHP() {
            const player = instance.globalController.gameData.character;
            const health = player.commonStates.health;
            return health.current < health.max;
        }
        templeButtons.heal.isActive = activeOnNotMaxHP;
    }
}