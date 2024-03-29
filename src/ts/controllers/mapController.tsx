import { Commands } from "../controls";
import { CellType } from "../utils/maps";
import { getRandomValueWithProbability } from "../utils/random";
import { BattleController } from "./battleController";
import { BaseController } from "./components/baseController";
import { ButtonsConfig, InfoComponent } from "./components/infoComponent";
import { MapComponent } from "./components/mapComponent";

const CSS = {
    table: {
        main: 'align-center no-border',
        row: 'align-center'
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
        this.currentLevel = 0;
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
            if (level + 1 >= instance.params.generators.length) {
                instance.globalController.popController();
                if (instance.params.mainLevel == instance.globalController.gameData.lastOpenMapLevel) {
                    // Open new level;
                    instance.globalController.gameData.lastOpenMapLevel++;
                    const levelMessage = `Уровень ${instance.globalController.gameData.lastOpenMapLevel} открыт!`;
                    const controller = new InfoComponent([levelMessage], ButtonsConfig.onlyBack);
                    instance.globalController.pushController(controller);
                }
            } else {
                instance.initNewMap(level + 1);
            }
        }

        map.cellActions[CellType.Cell.Empty] = function () {
            const event = getRandomValueWithProbability([
                {
                    probability: 19,
                    value: undefined,
                },
                {
                    probability: 1,
                    value: () => {
                        const controller = new BattleController(level);
                        instance.globalController.pushController(controller);
                    },
                },
            ]);
            if (event) {
                event();
            }
        }
    }
    onPush(globalController: IGlobalController): void {
        super.onPush(globalController);
        this.initNewMap(this.currentLevel);
    }
    executeCommand(command: Commands): void {
        this.currentMap.executeCommand(command);
    }
    createElement(): HTMLElement {
        return <table class={CSS.table.main}>
            <tr class={CSS.table.row}>
                <td>
                    Уровень {this.params.mainLevel},
                    комната {this.currentLevel + 1}
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