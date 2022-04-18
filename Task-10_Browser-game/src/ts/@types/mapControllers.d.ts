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

    type TDoor = { position: TPoint, isOpen: boolean, };

    /* GENERATION */

    type TGeneratorParams = {
        width: number,
        height: number,
        getFOV: () => TPoint,
        flagCount: number,
    };
    type TMapInfo = {
        size: TPoint,
        getFOV: () => TPoint,
        map: string[][],
        position: TPoint,
        flags: { count: number, positions: TPoint[], },
        doors: { prev: TDoor, next: TDoor, },
    };
    type TFMapGenerator = (params: TGeneratorParams) => TMapInfo;
}

declare type TMapControllerParams = {
    mainLevel: number,
    startLevel: number,
    endLevel: number,
    generators: {
        [level: number]: () => MapTypes.TMapInfo;
    };
};