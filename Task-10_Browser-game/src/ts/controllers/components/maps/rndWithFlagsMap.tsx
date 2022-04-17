import { Commands } from "../../../controls";
import { getRandomInt } from "../../../utils/random";
import { BaseMapComponent } from "../baseMapComponent";

const CSS = {
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

const CellContent: TCellContentList = {
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

declare namespace MapWithFlags {
    type TFlag = { position: TPoint, used: boolean };
    type TGeneratedMap = {
        map: string[][],
        position: TPoint,
        flags: { notUsedCount: number, list: TFlag[] },
        doors: {
            prev: { position: TPoint, isOpen: boolean },
            next: { position: TPoint, isOpen: boolean },
        }
    };
    type TGeneratorParams = { flagCount: number; };
    type TFMapGenerator = (width: number, height: number, params: TGeneratorParams) => TGeneratedMap;
    type TMapParams = TGeneratorParams & { generator: TFMapGenerator };
}

export function generateMap_Forest(width: number, height: number, params: MapWithFlags.TGeneratorParams): MapWithFlags.TGeneratedMap {
    let result: MapWithFlags.TGeneratedMap = {
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

export class RndWithFlagsMap extends BaseMapComponent {
    params: MapWithFlags.TMapParams;
    flags: MapWithFlags.TFlag[];
    notUsedFlagsCount: number;
    doors: {
        prev: { position: TPoint, isOpen: boolean },
        next: { position: TPoint, isOpen: boolean },
    };

    constructor(width: number, height: number, params: MapWithFlags.TMapParams = { flagCount: 3, generator: generateMap_Forest }) {
        super(width, height);

        let instance = this;
        this.params = params;

        const generatedResult = params.generator(width, height, params);
        this.map = generatedResult.map;
        this.flags = generatedResult.flags.list;
        this.notUsedFlagsCount = generatedResult.flags.notUsedCount;
        this.doors = generatedResult.doors;
        this.position = generatedResult.position;

        this.mapObjectActions = {
            [CellType.Flag.NotUsed]: function (position) {
                if (instance.notUsedFlagsCount > 0) {
                    instance.map[position.y][position.x] = CellType.Flag.Used;
                    let flag = instance.flags.find(value =>
                        value.position.x == position.x && value.position.y == position.y);
                    if (flag) {
                        flag.used = true;
                        instance.notUsedFlagsCount--;
                        if (instance.notUsedFlagsCount < 1) {
                            instance.doors.next.isOpen = true;
                            let doorPos = instance.doors.next.position;
                            instance.map[doorPos.y][doorPos.x] = CellType.Door.Next;
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

    getCellContent(x: number, y: number) {
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
}