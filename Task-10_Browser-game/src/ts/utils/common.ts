export class NumberEnumerator {
    private minValue: number;
    private maxValue: number;
    private currentValue: number;
    private startValue: number;
    private nextValue: (value: number) => number;
    private prevValue: (value: number) => number;

    constructor(minValue: number, maxValue: number, startValue: number,
        nextValue?: (value: number) => number, prevValue?: (value: number) => number) {
        this.minValue = minValue;
        this.maxValue = maxValue;
        this.currentValue = this.startValue = startValue;
        this.nextValue = nextValue || (value => value + 1);
        this.prevValue = prevValue || (value => value - 1);
    }

    current() {
        return this.currentValue;
    }
    next() {
        this.currentValue = this.nextValue(this.currentValue);
        if (this.currentValue > this.maxValue) {
            this.currentValue = this.minValue;
        }
        return this.currentValue;
    }
    prev() {
        this.currentValue = this.prevValue(this.currentValue);
        if (this.currentValue < this.minValue) {
            this.currentValue = this.maxValue;
        }
        return this.currentValue;
    }
    reset() {
        this.currentValue = this.startValue;
    }
}

export function getRange(count: number, start: number = 0, step: number = 1) {
    return Array.from(Array(count).keys()).map(x => x * step + start);
}