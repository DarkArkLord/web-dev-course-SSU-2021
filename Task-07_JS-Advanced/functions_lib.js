const TASK_FUNCS = {
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
            let temp = TASK_FUNCS.task3(-input);
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