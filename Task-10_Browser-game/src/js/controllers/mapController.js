import { MapComponent, testGenerator, CellType } from "./components/mapComponent";
import { Commands } from "../controls";
import { mainMenuController } from "./mainMenuController";
import { createTextController, ButtonsConfig } from "./textController";
import { getRandomVariantWithProbability } from "../utils";

const testParams = {
    sizeByLevel: (level) => 5 * level + 10,
    fieldOfView: () => 12,
    startLevel: 1,
    endLevel: 3,
    generator: testGenerator,
};

export function MapController(params = testParams) {
    let instance = this;
    this.mainController = undefined;
    this.params = params;
    this.mapStack = [];
    this.currentMap = undefined;
}

MapController.prototype = {
    initCurrentMap(level, instance) {
        if (!instance.currentMap) {
            let params = instance.params;
            instance.currentMap = new MapComponent(params.sizeByLevel(level), params.sizeByLevel(level), { fieldOfView: params.fieldOfView, flagCount: level }, params.generator);
            instance.currentMap.init(instance.mainController);
        }

        // Cell Actions

        instance.currentMap.mapObjectActions[CellType.Door.Prev] = function() {
            if (instance.mapStack.length < 1) {
                // let eventCntroller = createTextController(['first map'], { buttons: ButtonsConfig.onlyBack, addCounter: false }).first;
                debugger;
                instance.mainController.popController();
                return;
            }
            instance.currentMap = instance.mapStack.pop();
        }

        instance.currentMap.mapObjectActions[CellType.Door.Next] = function() {
            if (level + 1 > instance.params.endLevel) {
                let eventCntroller = createTextController(['last map'], { buttons: ButtonsConfig.onlyBack, addCounter: false }).first;
                instance.mainController.pushController(eventCntroller);
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
                        let eventCntroller = createTextController(['default event'], { buttons: ButtonsConfig.onlyBack, addCounter: false }).first;
                        instance.mainController.pushController(eventCntroller);
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
        if (this.currentMap) {
            return this.currentMap.createElement();
        }
    }
};

export const testMapController = new MapController();