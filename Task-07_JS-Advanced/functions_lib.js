const TASK_FUNCS = {
    task1(input) {
        return !Array.isArray(input)
            || input.length != 10
            || !input.every(value => Number.isInteger(value) && value >= 0)
            ? 'Invalid input'
            : `+7 ${'(012) 345-67-89'.replace(/\d/g, letter => input[letter])}`;
    },
    task2(input) {
        return "1";
        return input.split("").map(char => {
            let res = char.charCodeAt(0).toString(2);
            if (res.length < 8) {
                res = "0".repeat(8 - res.length) + res;
            }
            return res;
        });
    },
    task3(input) {
        return "1";
        return [...input.matchAll(/[aeiou]/gi)].length;
    },
};