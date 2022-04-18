import { MenuComponent } from "./components/menuComponent";
import { InfoComponent, ButtonsConfig } from "./components/infoComponent";
import { Commands } from "../controls";
import { MainMenuController } from "./mainMenuController";
import { MapController } from "./mapController";
import { generateMap_Forest, getFieldOfView } from "../utils/maps";

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
            // const controller = new InfoComponent(['Отправиться'], ButtonsConfig.onlyBack);
            function paramsByLevel(level: number): MapTypes.TGeneratorParams {
                return {
                    width: 10 * level,
                    height: 10 * level,
                    getFOV: getFieldOfView,
                    flagCount: level
                }
            }

            const mapParams: TMapControllerParams = {
                mainLevel: 1,
                startLevel: 1,
                endLevel: 3,
                generators: {},
            };

            [1, 2, 3].forEach(value =>
                mapParams.generators[value] = () =>
                    generateMap_Forest(paramsByLevel(value)));

            const controller = new MapController({
                mainLevel: 1,
                startLevel: 1,
                endLevel: 3,
                generators: {
                    [1]: function () {
                        return generateMap_Forest(paramsByLevel(1));
                    },
                    [2]: function () {
                        return generateMap_Forest(paramsByLevel(2));
                    },
                    [3]: function () {
                        return generateMap_Forest(paramsByLevel(3));
                    },
                }
            });
            instance.globalController.pushController(controller);
        };
        this.menuConfig.actions[items.toBattle.value] = function () {
            instance.globalController.saveGameData();
            const controller = new InfoComponent(['Искать врагов'], ButtonsConfig.onlyBack);
            instance.globalController.pushController(controller);
        };
        this.menuConfig.actions[items.states.value] = function () {
            const controller = new InfoComponent(['Характеристики'], ButtonsConfig.onlyBack);
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