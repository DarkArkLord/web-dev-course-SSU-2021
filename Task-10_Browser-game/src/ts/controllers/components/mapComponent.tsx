import { BaseController } from "./baseController";
import { Commands } from "../../controls";
import { getRandomInt } from "../../utils/random";

const CSS = {
    table: {
        main: 'align_center no-border',
        row: 'align_center',
        data: 'width_19',
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

export const CellType = {
    Player: 'PLAYER',
    Cell: {
        Empty: 'CELL-EMPTY',
        Wall: 'CELL-WALL',
        Invisible: 'CELL-INVISIBLE',
    },
    Flag: {
        NotUsed: 'FLAG-NORMAL',
        Used: 'FLAG-USED',
    },
    Door: {
        Next: 'DOOR-NEXT',
        Prev: 'DOOR-PREV',
        Closed: 'DOOR-CLOSED',
    },
};

const CellContent = {
    [CellType.Player]: {
        value: '@',
        class: CSS.map.player,
    },
    [CellType.Cell.Empty]: {
        value: '.',
        class: CSS.map.none,
    },
    [CellType.Cell.Wall]: {
        value: '#',
        class: CSS.map.none,
    },
    [CellType.Cell.Invisible]: {
        value: '&nbsp;',
        class: CSS.map.none,
    },
    [CellType.Flag.NotUsed]: {
        value: 'F',
        class: CSS.map.flag.notUsed,
    },
    [CellType.Flag.Used]: {
        value: '!',
        class: CSS.map.flag.used,
    },
    [CellType.Door.Next]: {
        value: '>',
        class: CSS.map.door.open,
    },
    [CellType.Door.Prev]: {
        value: '<',
        class: CSS.map.door.open,
    },
    [CellType.Door.Closed]: {
        value: 'X',
        class: CSS.map.door.close,
    },
};

type TPoint = { x: number, y: number };

type TFlag = { position: TPoint, used: boolean };

type TMap = {
    map: string[][],
    position: TPoint,
    flags: { notUsedCount: number, list: TFlag[] },
    doors: {
        prev: { position: TPoint, isOpen: boolean },
        next: { position: TPoint, isOpen: boolean },
    }
};

type TMapObjectActions = { [arg: string]: (position: TPoint) => void };

type TMoveFunc = (value: number) => number;

function testMapGenerator(width: number, height: number, params: any): TMap {
    let result: TMap = {
        map: new Array(height),
        position: { x: 0, y: 0 },
        flags: { notUsedCount: params.flagCount, list: [] },
        doors: {
            prev: { position: null, isOpen: true },
            next: { position: null, isOpen: false }
        },
    };

    for (let y = 0; y < height; y++) {
        result.map[y] = new Array(width);
        for (let x = 0; x < width; x++) {
            result.map[y][x] = CellType.Cell.Empty;
        }
        result.map[y][0] = CellType.Cell.Wall;
        result.map[y][width - 1] = CellType.Cell.Wall;
    }

    for (let x = 0; x < width; x++) {
        result.map[0][x] = CellType.Cell.Wall;
        result.map[height - 1][x] = CellType.Cell.Wall;
    }

    const wallCount = Math.round((height + width) / 2);
    for (let i = 0; i < wallCount; i++) {
        let x = getRandomInt(1, width - 1);
        let y = getRandomInt(1, height - 1);
        result.map[y][x] = CellType.Cell.Wall;
    }

    function findFreeCell() {
        while (true) {
            let x = getRandomInt(1, width - 2);
            let y = getRandomInt(1, height - 2);
            if (result.map[y][x] == CellType.Cell.Empty) {
                return { x, y };
            }
        }
    }
    result.position = findFreeCell();

    result.doors.prev.position = { x: result.position.x, y: result.position.y };
    result.map[result.position.y][result.position.x] = CellType.Door.Prev;

    for (let i = 0; i < params.flagCount; i++) {
        let flag = { position: findFreeCell(), used: false };
        result.map[flag.position.y][flag.position.x] = CellType.Flag.NotUsed;
        result.flags.list.push(flag);
    }

    result.doors.next.position = findFreeCell();
    result.doors.next.isOpen = params.flagCount > 0;
    result.map[result.doors.next.position.y][result.doors.next.position.x] = params.flagCount > 0
        ? CellType.Door.Closed
        : CellType.Door.Next;

    return result;
}

export class MapComponent extends BaseController {
    width: number;
    height: number;
    params: any;
    map: TMap;
    mapObjectActions: TMapObjectActions;

    constructor(width: number, height: number, params: any = { fieldOfView: () => 12, flagCount: 3 }) {
        super();

        let instance = this;

        this.width = width;
        this.height = height;
        this.params = params;

        this.map = testMapGenerator(width, height, params);

        this.mapObjectActions = {
            [CellType.Flag.NotUsed]: function (position) {
                if (instance.map.flags.notUsedCount > 0) {
                    instance.map.map[position.y][position.x] = CellType.Flag.Used;
                    let flag = instance.map.flags.list.find(value =>
                        value.position.x == position.x && value.position.y == position.y);
                    if (flag) {
                        flag.used = true;
                        instance.map.flags.notUsedCount--;
                        if (instance.map.flags.notUsedCount < 1) {
                            instance.map.doors.next.isOpen = true;
                            let doorPos = instance.map.doors.next.position;
                            instance.map.map[doorPos.y][doorPos.x] = CellType.Door.Next;
                        }
                    }
                }
            },
            [CellType.Door.Prev]: function (position) {
                alert('prev');
            },
            [CellType.Door.Next]: function (position) {
                alert('next');
            },
            [CellType.Door.Closed]: function (position) {
                alert('closed');
            },
        };

        function isInMap(x: number, y: number): boolean {
            return y >= 0 || y < this.height
                && x >= 0 || x < this.width;
        }
        function tryMove(position: TPoint, xMove: TMoveFunc, yMove: TMoveFunc) {
            const x = xMove(position.x);
            const y = yMove(position.y);
            if (isInMap(x, y) && this.map.map[y][x] != CellType.Cell.Wall) {
                position.x = x;
                position.y = y;
            }
        }
        function tryUseObject(position: TPoint) {
            if (!isInMap(position.x, position.y)) return;
            const cell = this.map.map[position.y][position.x];
            const action = this.mapObjectActions[cell];
            if (action) {
                action(position);
            }
        }

        this.commandActions[Commands.Up] = function () {
            tryMove(instance.map.position, x => x, y => y - 1);
            tryUseObject(instance.map.position);
        };
        this.commandActions[Commands.Down] = function () {
            tryMove(instance.map.position, x => x, y => y + 1);
            tryUseObject(instance.map.position);
        };
        this.commandActions[Commands.Left] = function () {
            tryMove(instance.map.position, x => x - 1, y => y);
            tryUseObject(instance.map.position);
        };
        this.commandActions[Commands.Right] = function () {
            tryMove(instance.map.position, x => x + 1, y => y);
            tryUseObject(instance.map.position);
        };
    }

    createElement(): HTMLElement {
        return null;
    }
}