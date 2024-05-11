export function getRandomInt(min: number, max: number): number {
    return ((Math.random() * (max + 1 - min)) + min) | 0;
}

export function getRandomValueWithProbability<T>(values: TValuesWithProbability<T>[]): T {
    const maxProbability = values.map(value => value.probability).reduce((acc, value) => acc + value, 0);
    const rndValue = getRandomInt(1, maxProbability);
    let i = 0;
    let prev = 1;
    while (i < values.length - 1 && (prev > rndValue || rndValue > values[i].probability)) {
        i++;
        prev = values[i].probability;
    }
    return values[i].value;
}