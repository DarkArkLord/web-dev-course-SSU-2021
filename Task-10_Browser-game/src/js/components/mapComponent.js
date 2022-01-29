import { HTMLTags, ItemTypes } from './render.js'
import { Commands } from './controls.js'

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

export function MapComponent() {
    let instance = this;
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