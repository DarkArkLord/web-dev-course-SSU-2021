import { HTMLTags, ItemTypes } from './render.js'
import { Commands } from './controls.js'
import { getRandomInt } from './utils.js'

const defaultStyleClasses = {
    table: {
        main: 'align_center no-border',
        row: 'align_center',
        data: 'width_19'
    },
};

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

export function MapComponent(width, height, params = { fieldOfView: 12 }, generator = testGenerator, css = defaultStyleClasses) {
    let instance = this;
    this.styleClasses = css;
    this.config = { width, height, params, generator: () => generator(width, height, params) };

    this.map = undefined;

    this.commandActions = {
        [Commands.Up]: function() {
            const y = instance.map.position.y - 1;
            if (y < 0) {
                return;
            }
            if (instance.map.map[y][instance.map.position.x] == CellType.Cell.Wall) {
                return;
            }
            instance.map.position.y--;
        },
        [Commands.Down]: function() {
            const y = instance.map.position.y + 1;
            if (y >= instance.config.height) {
                return;
            }
            if (instance.map.map[y][instance.map.position.x] == CellType.Cell.Wall) {
                return;
            }
            instance.map.position.y++;
        },
        [Commands.Left]: function() {
            const x = instance.map.position.x - 1;
            if (x >= instance.config.width) {
                return;
            }
            if (instance.map.map[instance.map.position.y][x] == CellType.Cell.Wall) {
                return;
            }
            instance.map.position.x--;
        },
        [Commands.Right]: function() {
            const x = instance.map.position.x + 1;
            if (x >= instance.config.width) {
                return;
            }
            if (instance.map.map[instance.map.position.y][x] == CellType.Cell.Wall) {
                return;
            }
            instance.map.position.x++;
        },
        [Commands.Use]: function() {},
        [Commands.Back]: function() {},
    };
}

MapComponent.prototype = {
    init() {
        this.map = this.config.generator();
    },
    executeCommand(command) {
        let action = this.commandActions[command];
        if (action) {
            action();
        }
    },
    createElement() {
        let table = {
            tag: HTMLTags.Table,
            type: ItemTypes.Container,
            attributes: { class: this.styleClasses.table.main, cellspacing: 0 },
            childs: []
        };

        const fov = this.config.params.fieldOfView;
        for (let y = -fov; y <= fov; y++) {
            let tableRow = {
                tag: HTMLTags.TableRow,
                type: ItemTypes.Container,
                attributes: { class: this.styleClasses.table.row },
                childs: []
            };

            for (let x = -fov; x <= fov; x++) {
                let currentCell;
                if (x == 0 && y == 0) {
                    currentCell = CellContent[CellType.Player];
                } else {
                    let px = this.map.position.x + x;
                    let py = this.map.position.y + y;
                    if (px < 0 || px >= this.config.width || py < 0 || py >= this.config.height) {
                        currentCell = CellContent[CellType.Cell.Invisible];
                    } else {
                        let cell = this.map.map[py][px];
                        currentCell = CellContent[cell];
                    }
                }
                let currentCellClass = this.styleClasses.table.data;
                if (currentCell.Class) {
                    currentCellClass += ' ' + currentCell.Class;
                }
                tableRow.childs.push({
                    tag: HTMLTags.TableData,
                    type: ItemTypes.Value,
                    attributes: { class: currentCellClass },
                    value: currentCell.Value
                });
            }

            table.childs.push(tableRow);
        }

        return table;
    }
};