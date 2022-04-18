import { getRandomInt } from "./random";

export function getFieldOfView(): TPoint {
    return { x: 11, y: 11 };
}

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

export function generateMap_Forest(params: MapTypes.TGeneratorParams): MapTypes.TMapInfo {
    let result: MapTypes.TMapInfo = {
        size: { x: params.width, y: params.width },
        getFOV: params.getFOV,
        map: new Array(params.height),
        position: { x: 0, y: 0 },
        flags: { count: params.flagCount, positions: [] },
        doors: {
            prev: { position: null, isOpen: true },
            next: { position: null, isOpen: false }
        },
    };

    for (let y = 0; y < params.height; y++) {
        result.map[y] = new Array(params.width);
        for (let x = 0; x < params.width; x++) {
            result.map[y][x] = CellType.Cell.Empty;
        }
        result.map[y][0] = CellType.Cell.Wall;
        result.map[y][params.width - 1] = CellType.Cell.Wall;
    }

    for (let x = 0; x < params.width; x++) {
        result.map[0][x] = CellType.Cell.Wall;
        result.map[params.height - 1][x] = CellType.Cell.Wall;
    }

    const wallCount = Math.round((params.height + params.width) / 2);
    for (let i = 0; i < wallCount; i++) {
        let x = getRandomInt(1, params.width - 1);
        let y = getRandomInt(1, params.height - 1);
        result.map[y][x] = CellType.Cell.Wall;
    }

    function findFreeCell() {
        while (true) {
            let x = getRandomInt(1, params.width - 2);
            let y = getRandomInt(1, params.height - 2);
            if (result.map[y][x] == CellType.Cell.Empty) {
                return { x, y };
            }
        }
    }
    result.position = findFreeCell();

    result.doors.prev.position = { x: result.position.x, y: result.position.y };
    result.map[result.position.y][result.position.x] = CellType.Door.Prev;

    for (let i = 0; i < params.flagCount; i++) {
        let flag = findFreeCell();
        result.map[flag.y][flag.x] = CellType.Flag.NotUsed;
        result.flags.positions.push(flag);
    }

    result.doors.next.position = findFreeCell();
    result.doors.next.isOpen = params.flagCount > 0;
    result.map[result.doors.next.position.y][result.doors.next.position.x] = params.flagCount > 0
        ? CellType.Door.Closed
        : CellType.Door.Next;

    return result;
}