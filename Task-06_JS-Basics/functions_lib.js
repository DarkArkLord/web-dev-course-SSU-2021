const TASK_FUNCS = {
    task1(input) {
        let result = [];
        for(const item of input) {
            result.push(...item);
        }
        return result.sort()
    }
};