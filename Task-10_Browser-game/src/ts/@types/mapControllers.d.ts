type TPoint = { x: number, y: number };

declare namespace MapTypes {
    /* BASE */

    type TCellContent = {
        value: string,
        classes: string[],
    };
    type TCellContentList = {
        [value: string]: TCellContent,
    };

    type TFPointUpdate = (position: TPoint) => void;
    type TCellActions = { [arg: string]: TFPointUpdate, };

    type TFMove = (value: number) => number;

    type TFlag = { position: TPoint, used: boolean, };
    type TDoor = { position: TPoint, isOpen: boolean, };

    /* GENERATION */

    type TGeneratorParams = {
        width: number,
        height: number,
        flagCount: number,
    };
    type TGeneratedMap = {
        map: string[][],
        position: TPoint,
        flags: { count: number, positions: TFlag[], },
        doors: { prev: TDoor, next: TDoor, },
    };
    type TFMapGenerator = (params: TGeneratorParams) => TGeneratedMap;
    type TMapParams = { params: TGeneratorParams, generator: TFMapGenerator };
}