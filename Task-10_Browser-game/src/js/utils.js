export function isInArray(value, array) {
    return array.some(item => item == value);
}

export function IndexEnumerator(minValue, maxValue, startValue,
    nextFunc = (value) => value + 1,
    prevFunc = (value) => value - 1) {
    this.startValue = startValue;
    this.value = startValue;
    this.minValue = minValue;
    this.maxValue = maxValue;
    this.nextFunc = nextFunc;
    this.prevFunc = prevFunc;
}

IndexEnumerator.prototype = {
    current() {
        return this.value;
    },
    next() {
        this.value = this.nextFunc(this.value);
        if (this.value > this.maxValue) {
            this.value = this.minValue;
        }
        return this.value;
    },
    prev() {
        this.value = this.prevFunc(this.value);
        if (this.value < this.minValue) {
            this.value = this.maxValue;
        }
        return this.value;
    },
    reset() {
        this.value = this.startValue;
    }
};

export function getRandomInt(min, max) {
    return ((Math.random() * (max + 1 - min)) + min) | 0;
}

export function getRandomVariantWithProbability(values) {
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