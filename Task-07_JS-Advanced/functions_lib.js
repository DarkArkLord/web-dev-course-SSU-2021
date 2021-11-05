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
        return "1";
        return [...input.matchAll(/[aeiou]/gi)].length;
    },
};