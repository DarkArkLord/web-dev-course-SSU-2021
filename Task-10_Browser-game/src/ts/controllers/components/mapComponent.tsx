import { BaseController } from "./baseController";
import { Commands } from "../../controls";

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


export class MapComponent extends BaseController {
    constructor() {
        super();
    }

    createElement(): HTMLElement {
        return null;
    }
}