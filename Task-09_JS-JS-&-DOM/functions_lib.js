const TASK_FUNCS_6 = {
    task1(input) {
        let result = [];
        for (const item of input) {
            result.push(...item);
        }
        return result.sort()
    },
    task2(input) {
        return input.split('').map(char => {
            let res = char.charCodeAt(0).toString(2);
            if(res.length < 8) {
                res = '0'.repeat(8 - res.length) + res;
            }
            return res;
        })
    },
    task3(input) {
        return [...input.matchAll(/[aeiou]/gi)].length;
    },
    task4(input) {
        function* letterGeneartor(letter, count) {
            let upper = letter.toUpperCase();
            let lower = letter.toLowerCase();
            yield upper;
            for (let i = 1; i < count; i++) {
                yield lower;
            }
        }

        let words = [];
        for (let letterIndex = 0; letterIndex < input.length; letterIndex++) {
            const letter = input[letterIndex];
            const count = letterIndex + 1;
            let word = [...letterGeneartor(letter, count)].join('');
            words.push(word);
        }
        return words.join('-');
    },
    task5(input) {
        let arr = input.toLowerCase().split('');
        return arr.every((char, index) => index == arr.indexOf(char));
    },
};

const TASK_FUNCS_7 = {
    task1(input) {
        return !Array.isArray(input)
            || input.length != 10
            || !input.every(value => Number.isInteger(value) && value >= 0)
            ? 'Invalid input'
            : `+7 ${'(012) 345-67-89'.replace(/\d/g, letter => input[letter])}`;
    },
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