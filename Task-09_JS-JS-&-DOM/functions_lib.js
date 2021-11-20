const COMMON_FUNCS = {
    safeLetter(index, text, defaultValue) {
        return index < text.length ? text[index] : defaultValue;
    },
    factor(n) {
        COMMON_FUNCS.factor.mem = COMMON_FUNCS.factor.mem || {};
        if (COMMON_FUNCS.factor.mem[n] == undefined) {
            let res = BigInt(1);
            for (let i = 2; i <= n; i++) {
                res *= BigInt(i);
            }
            COMMON_FUNCS.factor.mem[n] = res;
        }
        return COMMON_FUNCS.factor.mem[n];
    },
    coeff(n, k) {
        return COMMON_FUNCS.factor(n) / (COMMON_FUNCS.factor(k) * COMMON_FUNCS.factor(n - k));
    },
    powStr(letter, pow) {
        return pow == 1 ? letter : `${letter}^${pow}`;
    },
    getOperator: operator => numberRight => numberLeft => operator(numberLeft, numberRight),
    getNumber: value => operator => operator ? operator(value) : value,
};

const TASK_FUNCS = {
    task1(input, isText) {
        if (!input || !input.w || !Number.isInteger(input.w) || input.w < 1 || !input.h || !Number.isInteger(input.h) || input.h < 1) {
            return 'Invalid input';
        }

        const newLine = isText ? '\n' : '<br>';
        const space = isText ? ' ' : '&nbsp;';
        const horizontal = `+${'---+'.repeat(input.w)}${newLine}`;
        let result = horizontal;
        for (let hi = 0; hi < input.h; hi++) {
            result += '|';
            for (let wi = 0; wi < input.w; wi++) {
                const i = hi * input.w + wi;
                result += `${space}${COMMON_FUNCS.safeLetter(i, input.text, space)}${space}|`;
            }
            result += newLine + horizontal;
        }

        return result;
    },
    task2(input) {
        if (input < 0) {
            let temp = TASK_FUNCS.task2(-input);
            return `1/(${temp})`;
        }
        if (input == 0) {
            return '1';
        }

        if (!input || !Number.isInteger(input) || input < -200 || input > 200) {
            return 'Invalid input';
        }

        let result = COMMON_FUNCS.powStr('a', input);
        for (let i = 1; i < input; i++) {
            let c = COMMON_FUNCS.coeff(input, i);
            c = c == 1 ? '' : c;
            const a = COMMON_FUNCS.powStr('a', input - i);
            const b = COMMON_FUNCS.powStr('b', i);

            result += `+${c}${a}${b}`;
        }
        result += `+${COMMON_FUNCS.powStr('b', input)}`;

        return result;
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