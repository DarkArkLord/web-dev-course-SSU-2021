import { HTMLTags, ItemTypes } from './render.js'
import { Commands } from './controls.js'
import { getRandomInt } from './utils.js'

const CellType = {
    Player: 'PLAYER',
    Cell: {
        Empty: 'CELL-EMPTY',
        Wall: 'CELL-WALL',
        Invisible: 'CELL-INVISIBLE',
    },
    Flag: {
        Normal: 'FLAG-NORMAL',
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
        Value: '@',
        Class: '',
    },
    [CellType.Cell.Empty]: {
        Value: '.',
        Class: '',
    },
    [CellType.Cell.Wall]: {
        Value: '#',
        Class: '',
    },
    [CellType.Cell.Invisible]: {
        Value: '&nbsp;',
        Class: '',
    },

    [CellType.Flag.Normal]: {
        Value: 'F',
        Class: '',
    },
    [CellType.Flag.Used]: {
        Value: '!',
        Class: '',
    },
    [CellType.Door.Next]: {
        Value: '>',
        Class: '',
    },
    [CellType.Door.Prev]: {
        Value: '<',
        Class: '',
    },
    [CellType.Door.Closed]: {
        Value: 'X',
        Class: '',
    },
};

function testGenerator(width, height, params) {
    let result = { map: new Array(height), position: { x: 0, y: 0 }, };

    for (let y = 0; y < height; y++) {
        result.map[y] = new Array(width);
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

    const width3 = Math.round(width / 3);
    const height3 = Math.round(height / 3);
    while (true) {
        let x = getRandomInt(width3, width3 * 2);
        let y = getRandomInt(height3, height3 * 2);
        if (result.map[y][x] == CellType.Cell.Empty) {
            result.position = { x, y };
            break;
        }
    }

    return result;
}

export function MapComponent(width, height, generator, params) {
    let instance = this;
    this.config = { width, height, generator, params };

    this.map = undefined;

    this.commandActions = {
        [Commands.Up]: function() {},
        [Commands.Down]: function() {},
        [Commands.Left]: function() {},
        [Commands.Right]: function() {},
        [Commands.Use]: function() {},
        [Commands.Back]: function() {},
    };
}

MapComponent.prototype = {
    init() {
        //
    },
    executeCommand(command) {
        let action = this.commandActions[command];
        if (action) {
            action();
        }
    },
    createElement() {
        //
    }
};