export function isInArray(value, array) {
    return array.some(item => item == value);
}

export function IndexEnumerator(minValue, maxValue, startValue,
    nextFunc = (value) => value + 1,
    prevFunc = (value) => value - 1) {
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
        if(this.value > this.maxValue) {
            this.value = this.minValue;
        }
        return this.value;
    },
    prev() {
        this.value = this.prevFunc(this.value);
        if(this.value < this.minValue) {
            this.value = this.maxValue;
        }
        return this.value;
    }
};