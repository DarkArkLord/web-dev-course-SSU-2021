import { Commands } from "../controls";
import { BaseController } from "./components/baseController";
import { BaseMapComponent } from "./components/baseMapComponent";
import { CellType } from "./components/maps/rndWithFlagsMap";

type TMapControllerParams = {
    sizeByLevel: (level: number) => number;
    fieldOfView: () => number,
    mainLevel: number,
    startLevel: number,
    endLevel: number,
    generators: {
        [level: number]: () => BaseMapComponent;
    };
};

export class MapController extends BaseController {
    params: TMapControllerParams;
    mapStack: BaseMapComponent[];
    currentMap: BaseMapComponent;
    currentLevel: number;
    constructor(params: TMapControllerParams) {
        super();
        this.params = params;
        this.mapStack = [];
        this.currentLevel = params.startLevel;
        this.initNewMap(params.startLevel);
    }
    private initNewMap(level: number) {
        this.currentLevel = level;
        if (this.currentMap) {
            this.mapStack.push(this.currentMap);
        }
        const instance = this;
        const map = this.params.generators[level]();
        this.currentMap = map;
        map.onPush(this.globalController);

        /* Cell Actions */

        map.mapObjectActions[CellType.Door.Prev] = function () {
            if (instance.mapStack.length < 1) {
                instance.globalController.popController();
            } else {
                instance.currentMap = instance.mapStack.pop();
            }
        }

        map.mapObjectActions[CellType.Door.Next] = function () {
            if (level + 1 > instance.params.endLevel) {
                instance.globalController.popController();
                if (instance.params.mainLevel == instance.globalController.gameData.level) {
                    // Open new level;
                }
            } else {
                instance.initNewMap(level + 1);
            }
        }
    }
    executeCommand(command: Commands): void {
        this.currentMap.executeCommand(command);
    }
    createElement(): HTMLElement {
        return this.currentMap.createElement();
    }
}