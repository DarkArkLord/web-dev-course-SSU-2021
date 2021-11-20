const COMMON_FUNCS = {
    randInt(min, max) {
        return min + (Math.random() * (max - min)) | 0;
    },
    getRandomValue(values) {
        let index = COMMON_FUNCS.randInt(0, values.length);
        return values[index];
    },
    getOperator: operator => numberRight => numberLeft => operator(numberLeft, numberRight),
    getNumber: value => operator => operator ? operator(value) : value,
};

const TASK_FUNCS = {
    task1(input) {
        const numbers = '0123456789';
        const lettersLow = 'abcdefghijklmnopqrstuvwxyz';
        const lettersUp = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        const resultLength = COMMON_FUNCS.randInt(6, 20 + 1);

        let res = COMMON_FUNCS.getRandomValue(numbers)
            + COMMON_FUNCS.getRandomValue(lettersLow)
            + COMMON_FUNCS.getRandomValue(lettersUp);
        while (res.length < resultLength) {
            let variant = COMMON_FUNCS.randInt(1, 3);
            switch (variant) {
                case 1:
                    res += COMMON_FUNCS.getRandomValue(numbers);
                    break;
                case 2:
                    res += COMMON_FUNCS.getRandomValue(lettersLow);
                    break;
                case 3:
                    res += COMMON_FUNCS.getRandomValue(lettersUp);
                    break;
            }
        }

        return res;
    },
    task2(input) {
        let queue = Array.from({ length: input.count }, (_, i) => i + 1);
        for (let step = 1; queue.length > 1; step++) {
            let cur = queue.shift();
            if (step % input.step == 0) {
                step = 0;
                continue;
            }
            queue.push(cur);
        }
        return queue.shift();
    },
    task3(input) {
        // * * * * * * * * * *
        // * Короткая версия *
        // * * * * * * * * * *

        // var f = new Function('zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
        //     'plus', 'minus', 'times', 'dividedBy',
        //     `return ${input}`);
        // return f(getNumber(0), getNumber(1), getNumber(2), getNumber(3), getNumber(4), getNumber(5), getNumber(6), getNumber(7), getNumber(8), getNumber(9),
        //     getOperator((a, b) => a + b), getOperator((a, b) => a - b),
        //     getOperator((a, b) => a * b), getOperator((a, b) => Number.isFinite(a / b) ? ((a / b) | 0) : (a / b)));

        const zero = COMMON_FUNCS.getNumber(0);
        const one = COMMON_FUNCS.getNumber(1);
        const two = COMMON_FUNCS.getNumber(2);
        const three = COMMON_FUNCS.getNumber(3);
        const four = COMMON_FUNCS.getNumber(4);
        const five = COMMON_FUNCS.getNumber(5);
        const six = COMMON_FUNCS.getNumber(6);
        const seven = COMMON_FUNCS.getNumber(7);
        const eight = COMMON_FUNCS.getNumber(8);
        const nine = COMMON_FUNCS.getNumber(9);
        const plus = COMMON_FUNCS.getOperator((a, b) => a + b);
        const minus = COMMON_FUNCS.getOperator((a, b) => a - b);
        const times = COMMON_FUNCS.getOperator((a, b) => a * b);
        const dividedBy = COMMON_FUNCS.getOperator((a, b) => Number.isFinite(a / b) ? ((a / b) | 0) : (a / b));

        return eval(input);
    },
};