import { MapComponent, testGenerator, CellType } from "./components/mapComponent";
import { Commands } from "../controls";
import { mainMenuController } from "./mainMenuController";
import { createTextController, ButtonsConfig } from "./textController";
import { getRandomVariantWithProbability } from "../utils";
import { HTMLTags } from "../render";
import { BattleController } from "./battleController";
import { createStatesController } from "./statesController";

const defaultStyleClasses = {
    table: {
        main: 'align_center no-border',
        row: 'align_center'
    },
};

const testParams = {
    sizeByLevel: (level) => 5 * level + 10,
    fieldOfView: () => 12,
    mainLevel: 1,
    startLevel: 1,
    endLevel: 3,
    generator: testGenerator,
};

export function MapController(params = testParams, css = defaultStyleClasses) {
    let instance = this;
    this.mainController = undefined;
    this.params = params;
    this.mapStack = [];
    this.currentMap = undefined;
    this.currentMapLevel = undefined;
    this.css = css;
}

MapController.prototype = {
    initCurrentMap(level, instance) {
        if (!instance.currentMap) {
            let params = instance.params;
            let size = params.sizeByLevel(level);
            instance.currentMapLevel = level;
            instance.currentMap = new MapComponent(size, size, { fieldOfView: params.fieldOfView, flagCount: level }, params.generator);
            instance.currentMap.init(instance.mainController);
        }

        // Cell Actions

        instance.currentMap.mapObjectActions[CellType.Door.Prev] = function() {
            if (instance.mapStack.length < 1) {
                // let eventCntroller = createTextController(['first map'], { buttons: ButtonsConfig.onlyBack, addCounter: false }).first;
                instance.mainController.popController();
                return;
            }
            instance.currentMap = instance.mapStack.pop();
        }

        instance.currentMap.mapObjectActions[CellType.Door.Next] = function() {
            if (level + 1 > instance.params.endLevel) {
                instance.mainController.popController();
                if (instance.params.mainLevel == instance.mainController.gameData.level) {
                    instance.mainController.gameData.level++;
                    let newLevelController = createTextController([`Уровень ${instance.mainController.gameData.level} открыт!`], { buttons: ButtonsConfig.onlyNext, addCounter: false }).first;
                    instance.mainController.pushController(newLevelController);
                }
                return;
            }
            instance.mapStack.push(instance.currentMap);
            instance.currentMap = undefined;
            instance.initCurrentMap(level + 1, instance);
        }

        instance.currentMap.mapObjectActions[CellType.Door.Closed] = function() {
            let eventCntroller = createTextController(['closed door'], { buttons: ButtonsConfig.onlyBack, addCounter: false }).first;
            instance.mainController.pushController(eventCntroller);
        }

        instance.currentMap.mapObjectActions[CellType.Cell.Empty] = function() {
            let event = getRandomVariantWithProbability([
                {
                    probability: 19,
                    value: undefined
                },
                {
                    probability: 1,
                    value: function() {
                        // let eventCntroller = createTextController(['default event'], { buttons: ButtonsConfig.onlyBack, addCounter: false }).first;
                        let enemyLevel = (instance.params.mainLevel - 1) * 3 + level;
                        let battleController = new BattleController(enemyLevel, true);
                        instance.mainController.pushController(battleController);
                    }
                }
            ]);

            if (event) {
                event();
            }
        }

        // Button Actions

        instance.currentMap.commandActions[Commands.Back] = function() {
            instance.mainController.pushController(mainMenuController);
        }

        instance.currentMap.commandActions[Commands.Use] = function() {
            let controller = createStatesController(instance.mainController.gameData.character);
            instance.mainController.pushController(controller);
        }
    },
    init(mainController) {
        this.mainController = mainController;
        this.currentMap = undefined;
        this.mapStack = [];
        this.initCurrentMap(this.params.startLevel, this);
    },
    executeCommand(command) {
        if (this.currentMap) {
            this.currentMap.executeCommand(command);
        }
    },
    createElement() {
        let instance = this;
        if (this.currentMap) {
            let mapElement = instance.currentMap.createElement();
            let table = {
                tag: HTMLTags.Table,
                attributes: { class: instance.css.table.main },
                childs: [
                    {
                        tag: HTMLTags.TableRow,
                        attributes: { class: instance.css.table.row },
                        childs: [
                            {
                                tag: HTMLTags.TableData,
                                childs: [{ element: `Уровень ${instance.params.mainLevel}, комната ${instance.currentMapLevel}` }]
                            }
                        ]
                    },
                    {
                        tag: HTMLTags.TableRow,
                        attributes: { class: instance.css.table.row },
                        childs: [
                            {
                                tag: HTMLTags.TableData,
                                childs: [mapElement]
                            }
                        ]
                    }
                ]
            };
            return table;
        }
    }
};

export const testMapController = new MapController();