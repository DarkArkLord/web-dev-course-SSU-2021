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
                value: JSON.stringify(funcRes)
            }
        ],
    };
    return result;
}

function getLineByFuncWithInput(func) {
    let input = render({
        tag: HTMLTags.TextArea,
        attributes: { cols: "30", rows: "5" },
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
            let result = func(inputValue);
            output.value = JSON.stringify(result);
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

function getTaskValues(func, testValues) {
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
    let inputLine = getLineByFuncWithInput(func);
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
        getTaskValues(TASK_FUNCS.task1, [
            [[3, 2, 1], [4, 6, 5], [], [9, 7, 8]],
            [],
            [[], []],
            [[], [1]],
            [[1, 3, 5], [-100], [2, 4, 6]],
        ]),
        getTextLine('6.2. Бинарное слово'),
        getTaskValues(TASK_FUNCS.task2, [
            'man',
            'AB',
            'wecking',
            'Ruby',
            'Yosemite',
        ]),
    ]
};

render(pageElement);

bodyElement.innerHTML = '';
bodyElement.append(pageElement.element);