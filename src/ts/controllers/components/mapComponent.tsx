import { BaseController } from "./baseController";
import { getRange } from "../../utils/common";
import { CellType } from "../../utils/maps";
import { Commands } from "../../controls";
import { ButtonsConfig, InfoComponent } from "./infoComponent";

const CSS = {
    table: {
        main: 'align-center no-border',
        row: 'align-center',
        data: 'width-19',
    },
    map: {
        none: '',
        player: 'map-player',
        flag: {
            notUsed: 'map-flag-not-used',
            used: 'map-flag-used',
        },
        door: {
            open: 'map-door-open',
            close: 'map-door-close',
        },
    },
};

const CellContent: MapTypes.TCellContentList = {
    [CellType.Player]: {
        value: '@',
        classes: [CSS.map.player],
    },
    [CellType.Cell.Empty]: {
        value: '.',
        classes: [],
    },
    [CellType.Cell.Wall]: {
        value: '#',
        classes: [],
    },
    [CellType.Cell.Invisible]: {
        value: '\u00A0', // ' ', // '&nbsp;',
        classes: [],
    },
    [CellType.Flag.NotUsed]: {
        value: 'F',
        classes: [CSS.map.flag.notUsed],
    },
    [CellType.Flag.Used]: {
        value: '!',
        classes: [CSS.map.flag.used],
    },
    [CellType.Door.Next]: {
        value: '>',
        classes: [CSS.map.door.open],
    },
    [CellType.Door.Prev]: {
        value: '<',
        classes: [CSS.map.door.open],
    },
    [CellType.Door.Closed]: {
        value: 'X',
        classes: [CSS.map.door.close],
    },
};

export class MapComponent extends BaseController {
    readonly width: number;
    readonly height: number;
    readonly getFOV: () => TPoint;
    cellActions: MapTypes.TCellActions;
    map: string[][];
    position: TPoint;
    flags: { count: number, positions: TPoint[], }
    doors: {
        prev: { position: TPoint, isOpen: boolean },
        next: { position: TPoint, isOpen: boolean },
    };

    constructor(mapInfo: MapTypes.TMapInfo) {
        super();
        const instance = this;
        this.width = mapInfo.size.x;
        this.height = mapInfo.size.y;
        this.getFOV = mapInfo.getFOV;
        this.map = mapInfo.map;
        this.position = mapInfo.position;
        this.flags = mapInfo.flags;
        this.doors = mapInfo.doors;
        this.cellActions = {
            [CellType.Flag.NotUsed]: function (position) {
                if (instance.flags.count > 0) {
                    instance.map[position.y][position.x] = CellType.Flag.Used;
                    instance.flags.count--;
                    if (instance.flags.count < 1) {
                        instance.doors.next.isOpen = true;
                        let doorPos = instance.doors.next.position;
                        instance.map[doorPos.y][doorPos.x] = CellType.Door.Next;
                    }
                }
            },
            [CellType.Door.Prev]: function (position) {
                const controller = new InfoComponent(['prev'], ButtonsConfig.onlyBack);
                instance.globalController.pushController(controller);
            },
            [CellType.Door.Next]: function (position) {
                const controller = new InfoComponent(['next'], ButtonsConfig.onlyBack);
                instance.globalController.pushController(controller);
            },
            [CellType.Door.Closed]: function (position) {
                const controller = new InfoComponent(['closed'], ButtonsConfig.onlyBack);
                instance.globalController.pushController(controller);
            },
        };

        this.commandActions[Commands.Up] = function () {
            instance.tryMoveNotIn(instance.position, x => x, y => y - 1, [CellType.Cell.Wall]);
            instance.tryUseObject(instance.position);
        };
        this.commandActions[Commands.Down] = function () {
            instance.tryMoveNotIn(instance.position, x => x, y => y + 1, [CellType.Cell.Wall]);
            instance.tryUseObject(instance.position);
        };
        this.commandActions[Commands.Left] = function () {
            instance.tryMoveNotIn(instance.position, x => x - 1, y => y, [CellType.Cell.Wall]);
            instance.tryUseObject(instance.position);
        };
        this.commandActions[Commands.Right] = function () {
            instance.tryMoveNotIn(instance.position, x => x + 1, y => y, [CellType.Cell.Wall]);
            instance.tryUseObject(instance.position);
        };
    }

    protected isInMap(x: number, y: number): boolean {
        return y >= 0 && y < this.height
            && x >= 0 && x < this.width;
    }

    protected tryMoveWithCondition(position: TPoint, xMove: MapTypes.TFMove, yMove: MapTypes.TFMove, condition: (x: number, y: number) => boolean): boolean {
        const x = xMove(position.x);
        const y = yMove(position.y);
        if (condition(x, y)) {
            position.x = x;
            position.y = y;
            return true;
        }
        return false;
    }

    protected tryMoveIn(position: TPoint, xMove: MapTypes.TFMove, yMove: MapTypes.TFMove, suitableCell: string[]): boolean {
        const instance = this;
        function condition(x: number, y: number): boolean {
            return instance.isInMap(x, y) && suitableCell.includes(instance.map[y][x]);
        }
        return this.tryMoveWithCondition(position, xMove, yMove, condition);
    }

    protected tryMoveNotIn(position: TPoint, xMove: MapTypes.TFMove, yMove: MapTypes.TFMove, wrongСell: string[]): boolean {
        const instance = this;
        function condition(x: number, y: number): boolean {
            return instance.isInMap(x, y) && !wrongСell.includes(instance.map[y][x]);
        }
        return this.tryMoveWithCondition(position, xMove, yMove, condition);
    }

    protected tryUseObject(position: TPoint) {
        if (!this.isInMap(position.x, position.y)) return;
        const cell = this.map[position.y][position.x];
        const action = this.cellActions[cell];
        if (action) {
            action(position);
        }
    }

    protected getCellContent(x: number, y: number): MapTypes.TCellContent {
        if (x == 0 && y == 0) {
            return CellContent[CellType.Player];
        }
        x += this.position.x;
        y += this.position.y;
        if (!this.isInMap(x, y)) {
            return CellContent[CellType.Cell.Invisible];
        }
        let cell = this.map[y][x];
        return CellContent[cell];
    }

    createElement(): HTMLElement {
        let instance = this;
        let fov = this.getFOV();
        let cellOffsetsX = getRange(fov.x + 1 + fov.x, -fov.x);
        let cellOffsetsY = getRange(fov.y + 1 + fov.y, -fov.y);

        function CellData(attributes: any): HTMLElement {
            let currentCell = instance.getCellContent(attributes.x as number, attributes.y as number);
            let cellClass = [CSS.table.data, ...currentCell.classes].join(' ');
            return <td class={cellClass}> {currentCell.value} </td>;
        }

        function CellRow(attributes: any): HTMLElement {
            let y = attributes.y as number;
            return <tr class={CSS.table.row}>
                {cellOffsetsX.map(x => <CellData x={x} y={y} />)}
            </tr>;
        }

        return <table class={CSS.table.main}>
            {cellOffsetsY.map(y => <CellRow y={y} />)}
        </table>;
    }
}