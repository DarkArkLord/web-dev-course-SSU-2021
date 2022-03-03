import { MapComponent, testGenerator, CellType } from "./components/mapComponent";
import { Commands } from "../controls";
import { mainMenuController } from "./mainMenuController";
import { createTextController } from "./textController";
import { getRandomVariantWithProbability } from "../utils";

const testParams = {
    width: 20,
    height: 20,
    sizeByLevel: (level) => 10 * level + 10,
    height: 20,
    fieldOfView: () => 12,
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
                createTextController(["first map"], instance.mainController);
                return;
            }
            instance.currentMap = instance.mapStack.pop();
        }

        instance.currentMap.mapObjectActions[CellType.Door.Next] = function() {
            if (level + 1 > instance.params.endLevel) {
                createTextController(["last map"], instance.mainController);
                return;
            }
            instance.mapStack.push(instance.currentMap);
            instance.currentMap = undefined;
            instance.initCurrentMap(level + 1, instance);
        }

        instance.currentMap.mapObjectActions[CellType.Door.Closed] = function() {
            createTextController(["closed door"], instance.mainController);
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
                        createTextController(["default event"], instance.mainController);
                    }
                }
            ]);

            if(event) {
                event();
            }
        }

        // Button Actions

        instance.currentMap.commandActions[Commands.Back] = function() {
            instance.mainController.pushController(mainMenuController);
        }
    },
    init(mainController) {
        const startLevel = 1;
        this.mainController = mainController;
        this.currentMap = undefined;
        this.mapStack = [];
        this.initCurrentMap(startLevel, this);
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

export const mapController = new MapController();