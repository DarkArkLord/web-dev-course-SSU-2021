const TASK_FUNCS = {
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
            while (res.length < 8) {
                res = '0' + res;
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