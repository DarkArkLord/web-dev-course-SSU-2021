import { Commands } from "../../../controls";
import { getRandomInt } from "../../../utils/random";
import { MapComponent } from "../mapComponent";

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

export class RndWithFlagsMap extends MapComponent {
    params: MapTypes.TMapParams;
    flags: MapTypes.TFlag[];
    notUsedFlagsCount: number;
    doors: {
        prev: { position: TPoint, isOpen: boolean },
        next: { position: TPoint, isOpen: boolean },
    };

    constructor(params: MapTypes.TMapParams = { params: { width: 10, height: 10, flagCount: 3 }, generator: generateMap_Forest }) {
        super(params.params.width, params.params.height);

        let instance = this;
        this.params = params;

        const generatedResult = params.generator(params.params);
        this.map = generatedResult.map;
        this.flags = generatedResult.flags.positions;
        this.notUsedFlagsCount = generatedResult.flags.count;
        this.doors = generatedResult.doors;
        this.position = generatedResult.position;

        this.cellActions = {
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