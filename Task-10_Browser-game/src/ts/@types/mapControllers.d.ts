declare type TCellContent = {
    value: string,
    classes: string[]
};

declare type TCellContentList = {
    [value: string]: TCellContent
};

declare type TPoint = { x: number, y: number };

declare type TMapObjectActions = { [arg: string]: (position: TPoint) => void };

declare type TMoveFunc = (value: number) => number;