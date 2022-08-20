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