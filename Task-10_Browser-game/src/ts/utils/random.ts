export function getRandomInt(min: number, max: number): number {
    return ((Math.random() * (max + 1 - min)) + min) | 0;
}

export function getRandomValueWithProbability<T>(values: TValuesWithProbability<T>[]): T {
    let maxProbability = values.map(value => value.probability).reduce((acc, value) => acc + value, 0);
    let result = getRandomInt(1, maxProbability);
    let i = 0,
        prev = 1,
        cur = values[i].probability;
    while (i < values.length - 1 && (prev > result || result > cur)) {
        i++;
        prev = cur;
        cur += values[i].probability;
    }
    return values[i].value;
}

function getDiceValue(dice: TDice) {
    return getRandomInt(dice.min, dice.max);
}

export function getDiceExpressionValue(expression: TDiceExpression): TDiceExpressionResult {
    let result = expression.mod || 0;
    let values = [];

    for (let i = 0; i < expression.count; i++) {
        let value = getDiceValue(expression.dice);
        result += value;
        values.push(value);
    }

    return { result, values, mod: expression.mod };
}

export const D6_DICE: TDice = { min: 1, max: 6, name: '6' };
export const MAIN_DICE: TDice = { min: -3, max: 3, name: '3F' };
export const MAIN_DICE_EXPRESSION: TDiceExpression = { count: 3, dice: MAIN_DICE, mod: 0 };

export function getMainDiceValue() {
    return getDiceExpressionValue(MAIN_DICE_EXPRESSION);
}

export function diceExpressionToString(dice: TDiceExpression) {
    const name = dice.dice.name ?? dice.dice.max;
    const mod = dice.mod > 0
        ? `+${dice.mod}`
        : dice.mod < 0
            ? dice.mod.toString()
            : '';
    return `${dice.count}d${name}${mod}`;
}