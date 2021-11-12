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
                value: funcRes
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
        getTextLine('8.1. Генератор паролей'),
        getTaskValues(TASK_FUNCS.task1, [
            'none', 'none', 'none', 'none', 'none',
        ], '"none"'),
        getTextLine('8.2. Игра на выбывание'),
        getTaskValues(TASK_FUNCS.task2, [
            { count: 7, step: 3 },
            { count: 11, step: 19 },
            { count: 1, step: 300 },
        ], JSON.stringify({ count: 7, step: 3 })),
        getTextLine('8.3. Формула для (a+b)^n'),
        getTaskValues(TASK_FUNCS.task3, [0, 1, 2, -2, 3, 5, 201, 3.14, ])
    ]
};

render(pageElement);

bodyElement.innerHTML = '';
bodyElement.append(pageElement.element);