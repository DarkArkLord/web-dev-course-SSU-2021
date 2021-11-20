const TASK_FUNCS_7 = {
    task2(input, isText) {
        if (!input || !input.w || !Number.isInteger(input.w) || input.w < 1 || !input.h || !Number.isInteger(input.h) || input.h < 1) {
            return 'Invalid input';
        }

        function safeLetter(i) {
            return i < input.text.length ? input.text[i] : ' ';
        }
        const newLine = isText ? '\n' : '<br>';
        const space = isText ? ' ' : '&nbsp;';
        const horizontal = `+${'---+'.repeat(input.w)}${newLine}`;
        let result = horizontal;
        for (let hi = 0; hi < input.h; hi++) {
            result += '|';
            for (let wi = 0; wi < input.w; wi++) {
                const i = hi * input.w + wi;
                result += `${space}${safeLetter(i)}${space}|`;
            }
            result += newLine + horizontal;
        }

        return result;
    },
    task3(input) {
        if (input < 0) {
            let temp = TASK_FUNCS_7.task3(-input);
            return `1/(${temp})`;
        }
        if (input == 0) {
            return '1';
        }

        if (!input || !Number.isInteger(input) || input < -200 || input > 200) {
            return 'Invalid input';
        }

        function factor(n) {
            factor.mem = factor.mem || {};
            if(factor.mem[n]) return factor.mem[n];

            let res = BigInt(1);
            for(let i = 2; i <= n; i++) {
                res *= BigInt(i);
            }
            return factor.mem[n] = res;
        }

        function coeff(n, k) {
            return factor(n) / (factor(k) * factor(n - k));
        }

        function powStr(letter, pow) {
            return pow == 1 ? letter : `${letter}^${pow}`;
        }

        let result = powStr('a', input);
        for(let i = 1; i < input; i++) {
            let c = coeff(input, i);
            c = c == 1 ? '' : c;
            const a = powStr('a', input - i);
            const b = powStr('b', i);
            
            result += `+${c}${a}${b}`;
        }
        result += `+${powStr('b', input)}`;

        return result;
    },
};

const TASK_FUNCS_8 = {
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