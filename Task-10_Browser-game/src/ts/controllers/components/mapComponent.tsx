import { BaseController } from "./baseController";
import { getRange } from "../../utils/common";

const CSS = {
    table: {
        main: 'align_center no-border',
        row: 'align_center',
        data: 'width_19',
    }
};

function getFieldOfView(): TPoint {
    return { x: 12, y: 12 };
}

export abstract class MapComponent extends BaseController {
    width: number;
    height: number;
    map: string[][];
    cellActions: MapTypes.TCellActions;
    position: TPoint;

    constructor(width: number, height: number) {
        super();
        this.width = width;
        this.height = height;
        this.cellActions = {};
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

    protected abstract getCellContent(x: number, y: number): MapTypes.TCellContent;

    createElement(): HTMLElement {
        let instance = this;
        let fov = getFieldOfView();
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