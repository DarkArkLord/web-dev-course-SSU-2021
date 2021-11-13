const TASK_FUNCS = {
    task1(input) {
        function randInt(min, max) {
            return min + (Math.random() * (max - min)) | 0;
        }

        function getRandomValue(values) {
            let index = randInt(0, values.length);
            return values[index];
        }
        const numbers = '0123456789';
        const lettersLow = 'abcdefghijklmnopqrstuvwxyz';
        const lettersUp = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        const resultLength = randInt(6, 20 + 1);

        let res = getRandomValue(numbers) + getRandomValue(lettersLow) + getRandomValue(lettersUp);
        while (res.length < resultLength) {
            let variant = randInt(1, 3);
            switch (variant) {
                case 1:
                    res += getRandomValue(numbers);
                    break;
                case 2:
                    res += getRandomValue(lettersLow);
                    break;
                case 3:
                    res += getRandomValue(lettersUp);
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
        const getOperator = operator => numberRight => numberLeft => operator(numberLeft, numberRight);
        const getNumber = value => operator => operator ? operator(value) : value;

        // * * * * * * * * * *
        // * Короткая версия *
        // * * * * * * * * * *

        // var f = new Function('zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
        //     'plus', 'minus', 'times', 'dividedBy',
        //     `return ${input}`);
        // return f(getNumber(0), getNumber(1), getNumber(2), getNumber(3), getNumber(4), getNumber(5), getNumber(6), getNumber(7), getNumber(8), getNumber(9),
        //     getOperator((a, b) => a + b), getOperator((a, b) => a - b),
        //     getOperator((a, b) => a * b), getOperator((a, b) => Number.isFinite(a / b) ? ((a / b) | 0) : (a / b)));

        const zero = getNumber(0);
        const one = getNumber(1);
        const two = getNumber(2);
        const three = getNumber(3);
        const four = getNumber(4);
        const five = getNumber(5);
        const six = getNumber(6);
        const seven = getNumber(7);
        const eight = getNumber(8);
        const nine = getNumber(9);
        const plus = getOperator((a, b) => a + b);
        const minus = getOperator((a, b) => a - b);
        const times = getOperator((a, b) => a * b);
        const dividedBy = getOperator((a, b) => Number.isFinite(a / b) ? ((a / b) | 0) : (a / b));

        return eval(input);
    },
};