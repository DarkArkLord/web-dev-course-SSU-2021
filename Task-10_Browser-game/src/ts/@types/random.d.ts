declare type TValuesWithProbability<T> = {
    probability: number,
    value: T,
};

declare type TDice = {
    min: number,
    max: number,
    name?: string,
};

declare type TDiceExpression = {
    count: number,
    dice: TDice,
    mod: number,
};

declare type TDiceExpressionResult = {
    result: number,
    values: number[],
    mod: number,
};