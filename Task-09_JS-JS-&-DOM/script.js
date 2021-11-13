const bodyElement = document.getElementsByTagName('body')[0];

function getLineByFunc(input, func) {
    let funcRes = func(input);
    let result = {
        tag: HTMLTags.TableRow,
        type: ItemTypes.Container,
        childs: [
            {
                tag: HTMLTags.TableData,
                type: ItemTypes.Value,
                value: JSON.stringify(input)
            },
            {
                tag: HTMLTags.TableData,
                type: ItemTypes.Value,
                value: funcRes + ''
            }
        ],
    };
    return result;
}

function getLineByFuncWithInput(func, defaultInput) {
    let input = render({
        tag: HTMLTags.TextArea,
        type: ItemTypes.Value,
        attributes: { cols: "30", rows: "5" },
        value: defaultInput || ''
    });

    let output = render({
        tag: HTMLTags.TextArea,
        attributes: { cols: "30", rows: "5", readonly: 'true' },
    });

    let button = render({
        tag: HTMLTags.Button,
        type: ItemTypes.Value,
        value: 'Do'
    });

    button.onclick = () => {
        try {
            let inputValue = JSON.parse(input.value);
            let result = func(inputValue, true);
            output.value = result;
        } catch (ex) {
            alert(`Smth went wrong: ${ex}`);
        }
    };

    let result = {
        tag: HTMLTags.TableRow,
        type: ItemTypes.Container,
        childs: [
            {
                tag: HTMLTags.TableData,
                type: ItemTypes.HtmlElementContainer,
                innerElement: input
            },
            {
                tag: HTMLTags.TableData,
                type: ItemTypes.HtmlElementContainer,
                innerElement: output
            },
            {
                tag: HTMLTags.TableData,
                type: ItemTypes.HtmlElementContainer,
                innerElement: button
            }
        ],
    };
    return result;
}

function getTextLine(text) {
    return {
        tag: HTMLTags.TableRow,
        type: ItemTypes.Container,
        childs: [
            {
                tag: HTMLTags.TableData,
                type: ItemTypes.Container,
                childs: [
                    {
                        tag: HTMLTags.h2,
                        type: ItemTypes.Value,
                        value: text
                    }
                ],
            }
        ],
    };


}

function getTaskValues(func, testValues, defaultInput) {
    let funcTable = {
        tag: HTMLTags.Table,
        type: ItemTypes.Container,
        attributes: { class: 'width_100' },
        childs: []
    }

    for (const val of testValues) {
        const line = getLineByFunc(val, func);
        funcTable.childs.push(line);
    }
    let inputLine = getLineByFuncWithInput(func, defaultInput);
    funcTable.childs.push(inputLine);

    return {
        tag: HTMLTags.TableRow,
        type: ItemTypes.Container,
        childs: [
            {
                tag: HTMLTags.TableData,
                type: ItemTypes.Container,
                childs: [funcTable]
            }
        ],
    };
}

const pageElement = {
    tag: HTMLTags.Table,
    type: ItemTypes.Container,
    childs: [
        // --- --- --- --- --- --- ---
        // --- --- ---  6  --- --- ---
        // --- --- --- --- --- --- ---
        getTextLine('6.1. Плоский массив'),
        getTaskValues(TASK_FUNCS_6.task1, [
            [[3, 2, 1], [4, 6, 5], [], [9, 7, 8]],
            [],
            [[], []],
            [[], [1]],
            [[1, 3, 5], [-100], [2, 4, 6]],
        ], JSON.stringify([[3, 2, 1], [4, 6, 5], [], [9, 7, 8]])),
        getTextLine('6.2. Бинарное слово'),
        getTaskValues(TASK_FUNCS_6.task2, [
            'man',
            'AB',
            'wecking',
            'Ruby',
            'Yosemite',
        ], '"man"'),
        getTextLine('6.3. Подсчёт гласных'),
        getTaskValues(TASK_FUNCS_6.task3, [
            'abracadabra',
            'ABRACADABRA',
            'o a kak ushakov lil vo kashu kakao',
            'my pyx'
        ], '"abracadabra"'),
        getTextLine('6.4. Форматирование строки'),
        getTaskValues(TASK_FUNCS_6.task4, [
            "abcd",
            "RqaEzty",
            "cwAt"
        ], '"cat"'),
        getTextLine('6.5. Изограммы'),
        getTaskValues(TASK_FUNCS_6.task5, [
            "Dermatoglyphics",
            "aba",
            "moOse",
            ""
        ], '"Dermatoglyphics"'),
        // --- --- --- --- --- --- ---
        // --- --- ---  7  --- --- ---
        // --- --- --- --- --- --- ---
        getTextLine('7.1. Форматирование телефонного номера'),
        getTaskValues(TASK_FUNCS_7.task1, [
            [9, 0, 0, 1, 1, 1, 2, 2, 3, 3],
            [9, 2, 7, 5, 5, 5, 6, 6, 9, 0],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, -11],
            [],
            'aw93fha=',
        ], [9, 2, 7, 5, 5, 5, 6, 6, 9, 0]),
        getTextLine('7.2. Форматирование строки в таблицу'),
        getTaskValues(TASK_FUNCS_7.task2, [
            { w: 4, h: 4, text: 'Hello World!' },
            { w: 3, h: 4, text: 'Nice pattern' },
            { w: 4, h: 3, text: 'Nice pattern' },
            { w: 3, h: 4, text: 'Nice long pattern' },
            { w: 4, h: 3, text: 'Nice long pattern' },
            { w: 3, h: 4, text: 'N s p' },
            { w: 4, h: 3, text: 'N s p' },
            { w: 4, h: 4, text: '' },
        ], JSON.stringify({ w: 3, h: 4, text: 'Nice long pattern' })),
        getTextLine('7.3. Формула для (a+b)^n'),
        getTaskValues(TASK_FUNCS_7.task3, [0, 1, 2, -2, 3, 5, 201, 3.14, ], 5),
        // --- --- --- --- --- --- ---
        // --- --- ---  8  --- --- ---
        // --- --- --- --- --- --- ---
        getTextLine('8.1. Генератор паролей'),
        getTaskValues(TASK_FUNCS_8.task1, [
            'none', 'none', 'none', 'none', 'none',
        ], '"none"'),
        getTextLine('8.2. Игра на выбывание'),
        getTaskValues(TASK_FUNCS_8.task2, [
            { count: 7, step: 3 },
            { count: 11, step: 19 },
            { count: 1, step: 300 },
        ], JSON.stringify({ count: 7, step: 3 })),
        getTextLine('8.3. Калькулятор из функций'),
        getTaskValues(TASK_FUNCS_8.task3, [
            "seven(times(five())); // должно вернуть 35",
            "four(plus(nine())); // 13",
            "eight(minus(three())); // 5",
            "six(dividedBy(two())); // 3",
            "eight(dividedBy(three())); // 2, а не 2.666666(6)",
            "three(times(three(times(three())))); // 27",
            "two(plus(two(times(two(minus(one())))))); // 4",
            "zero(plus(one(dividedBy(one())))); // 1",
            "one(dividedBy(zero())); // Infinity",
            "one();"
        ], '"zero(dividedBy(zero()))"')
    ]
};

render(pageElement);

bodyElement.innerHTML = '';
bodyElement.append(pageElement.element);