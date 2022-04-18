import { Commands } from "../controls";
import { CellType } from "../utils/maps";
import { BaseController } from "./components/baseController";
import { MapComponent } from "./components/mapComponent";

const CSS = {
    table: {
        main: 'align_center no-border',
        row: 'align_center'
    },
};

export class MapController extends BaseController {
    params: TMapControllerParams;
    mapStack: MapComponent[];
    currentMap: MapComponent;
    currentLevel: number;
    constructor(params: TMapControllerParams) {
        super();
        this.params = params;
        this.mapStack = [];
        this.currentLevel = params.startLevel;
    }
    private initNewMap(level: number) {
        this.currentLevel = level;
        if (this.currentMap) {
            this.mapStack.push(this.currentMap);
        }
        const instance = this;
        const mapInfo = this.params.generators[level]();
        const map = new MapComponent(mapInfo);
        this.currentMap = map;
        map.onPush(this.globalController);

        /* Cell Actions */

        map.cellActions[CellType.Door.Prev] = function () {
            if (instance.mapStack.length < 1) {
                instance.globalController.popController();
            } else {
                instance.currentMap = instance.mapStack.pop();
            }
        }

        map.cellActions[CellType.Door.Next] = function () {
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
    onPush(globalController: IGlobalController): void {
        super.onPush(globalController);
        this.initNewMap(this.params.startLevel);
    }
    executeCommand(command: Commands): void {
        this.currentMap.executeCommand(command);
    }
    createElement(): HTMLElement {
        return <table class={CSS.table.main}>
            <tr class={CSS.table.row}>
                <td>
                    Уровень {this.params.mainLevel},
                    комната {this.currentLevel}
                </td>
            </tr>
            <tr class={CSS.table.row}>
                <td>
                    {this.currentMap.createElement()}
                </td>
            </tr>
        </table>
    }
}