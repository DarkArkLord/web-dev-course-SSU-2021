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
    }
};