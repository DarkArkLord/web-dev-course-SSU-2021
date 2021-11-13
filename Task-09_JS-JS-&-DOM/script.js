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
        getTextLine('6.1. Плоский массив'),
        getTaskValues(TASK_FUNCS_6.task1, [
            [[3, 2, 1], [4, 6, 5], [], [9, 7, 8]],
            [],
            [[], []],
            [[], [1]],
            [[1, 3, 5], [-100], [2, 4, 6]],
        ]),
        getTextLine('6.2. Бинарное слово'),
        getTaskValues(TASK_FUNCS_6.task2, [
            'man',
            'AB',
            'wecking',
            'Ruby',
            'Yosemite',
        ]),
        getTextLine('6.3. Подсчёт гласных'),
        getTaskValues(TASK_FUNCS_6.task3, [
            'abracadabra',
            'ABRACADABRA',
            'o a kak ushakov lil vo kashu kakao',
            'my pyx'
        ]),
        getTextLine('6.4. Форматирование строки'),
        getTaskValues(TASK_FUNCS_6.task4, [
            "abcd",
            "RqaEzty",
            "cwAt"
        ]),
        getTextLine('6.5. Изограммы'),
        getTaskValues(TASK_FUNCS_6.task5, [
            "Dermatoglyphics",
            "aba",
            "moOse",
            ""
        ]),
    ]
};

render(pageElement);

bodyElement.innerHTML = '';
bodyElement.append(pageElement.element);