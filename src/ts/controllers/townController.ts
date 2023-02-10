import { MenuComponent } from "./components/menuComponent";
import { InfoComponent, ButtonsConfig } from "./components/infoComponent";
import { Commands } from "../controls";
import { MainMenuController } from "./mainMenuController";
import { MapController } from "./mapController";
import { generateMap_Forest, getFieldOfView } from "../utils/maps";
import { getRange, NavigationButtons } from "../utils/common";
import { BattleController } from "./battleController";
import { renderCharacter } from "../rpg/characterToHtml";

export enum TownControllerTexts {
    BtnToMap = 'CTRL-TOWN-BTN-MAP',
    BtnToBattle = 'CTRL-TOWN-BTN-BATTLE',
    BtnTemple = 'CTRL-TOWN-BTN-TEMPLE',
    BtnStates = 'CTRL-TOWN-BTN-STATES',
    BtnOther = 'CTRL-TOWN-BTN-OTHER',
};

const townButtons = {
    toMap: {
        value: TownControllerTexts.BtnToMap,
        isActive: () => true,
    },
    toBattle: {
        value: TownControllerTexts.BtnToBattle,
        isActive: () => true,
    },
    temple: {
        value: TownControllerTexts.BtnTemple,
        isActive: () => true,
    },
    states: {
        value: TownControllerTexts.BtnStates,
        isActive: () => true,
    },
    other: {
        value: TownControllerTexts.BtnOther,
        isActive: () => false,
    },
} as StrDictionary<TMenuItem>;

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
            const characterTable = renderCharacter(character, instance.globalController.translationsUtils);

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

        Object.values(townButtons).forEach((item: TMenuItem) => {
            item.description = instance.globalController.translationsUtils.enumTranslations[item.value];
        })

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
        const levelItems = getRange(lastLevel, 1)
            .map(level => {
                return {
                    level: level,
                    title: `Уровень ${level}`,
                };
            });
        super([...levelItems, { title: NavigationButtons.Back }].map(item => {
            return {
                value: item.title,
                description: item.title,
                isActive: () => true,
            };
        }), 'Выберите уровень');
        const instance = this;

        instance.commandActions[Commands.Back] = function () {
            instance.globalController.popController();
        };

        instance.menuConfig.actions[NavigationButtons.Back] = function () {
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
        super([...levelItems, { title: NavigationButtons.Back }].map(item => {
            return {
                value: item.title,
                description: item.title,
                isActive: () => true,
            };
        }), 'Выберите уровень');
        const instance = this;

        instance.commandActions[Commands.Back] = function () {
            instance.globalController.popController();
        };

        instance.menuConfig.actions[NavigationButtons.Back] = function () {
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

export enum TownTempleTexts {
    BtnHeal = 'CTRL-TEMPLE-BTN-HEAL',
};

const templeButtons = {
    heal: {
        value: TownTempleTexts.BtnHeal,
        isActive: () => true,
    },
    back: {
        value: NavigationButtons.Back,
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

        Object.values(templeButtons).forEach((item: TMenuItem) => {
            item.description = instance.globalController.translationsUtils.enumTranslations[item.value];
        })

        templeButtons.heal.isActive = () => {
            const player = instance.globalController.gameData.character;
            const health = player.commonStates.health;
            return health.current < health.max;
        };
    }
}