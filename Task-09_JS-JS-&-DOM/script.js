const bodyElement = document.getElementsByTagName('body')[0];

function getLineByFuncWithInput(func, defaultInput, valudator) {
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

    let doButton = {
        tag: HTMLTags.Button,
        type: ItemTypes.Value,
        value: 'Do'
    };
    render(doButton);

    doButton.element.onclick = () => {
        try {
            output.value = '';
            let inputValue = JSON.parse(input.value);
            valudator && valudator(inputValue)
            let result = func(inputValue, true);
            output.value = result;
        } catch (ex) {
            alert(`Error:\n${ex}`);
        }
    };

    let clearButton = {
        tag: HTMLTags.Button,
        type: ItemTypes.Value,
        value: 'Clear'
    };
    render(clearButton);

    clearButton.element.onclick = () => {
        try {
            input.value = defaultInput;
            output.value = '';
        } catch (ex) {
            alert(`Smth went wrong: ${ex}`);
        }
    };

    let buttonsContainer = {
        tag: HTMLTags.Div,
        type: ItemTypes.Container,
        childs: [
            doButton,
            clearButton
        ]
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
                innerElement: render(buttonsContainer)
            }
        ],
    };
    return result;
}

function getHeaderLine(text) {
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

function getTextLine(text) {
    return {
        tag: HTMLTags.TableRow,
        type: ItemTypes.Container,
        childs: [
            {
                tag: HTMLTags.TableData,
                type: ItemTypes.Value,
                value: text
            }
        ],
    };
}

function getTaskValues(func, defaultInput, valudator) {
    let funcTable = {
        tag: HTMLTags.Table,
        type: ItemTypes.Container,
        attributes: { class: 'width_100' },
        childs: []
    }

    let inputLine = getLineByFuncWithInput(func, defaultInput, valudator);
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
        getHeaderLine('7.2. Форматирование строки в таблицу'),
        getTextLine('Требуется ввести объект в следующем виде:<br>'
            + '{"w":<width>,"h":<height>,"text":"<text>"}<br>'
            + 'Где:<br>'
            + '<width> - положительнео целое число, ширина таблицы<br>'
            + '<height> - положительнео целое число, высота таблицы<br>'
            + '<text> - текст для ячеек таблицы'),
        getTaskValues(TASK_FUNCS.task1,
            JSON.stringify({ w: 3, h: 4, text: 'Nice long pattern' }),
            value => {
                let header = 'Validation:\n';
                if (!value) throw header + 'Input is undefind.';
                if (value.w == undefined) throw header + 'Attribute "w" is undefind.';
                if (value.h == undefined) throw header + 'Attribute "h" is undefind.';
                if (value.text == undefined) throw header + 'Attribute "text" is undefind.';
                if (!Number.isInteger(value.w)) throw header + 'Value of "w" is not integer.';
                if (!Number.isInteger(value.h)) throw header + 'Value of "h" is not integer.';
                if (value.w < 1) throw header + 'Value of "w" is not positive.';
                if (value.h < 1) throw header + 'Value of "h" is not positive.';
            }),
        getHeaderLine('7.3. Формула для (a+b)^n'),
        getTextLine('Введите целое число от -200 до 200'),
        getTaskValues(TASK_FUNCS.task2, 5,
            value => {
                let header = 'Validation:\n';
                if (value == undefined) throw header + 'Input is undefind.';
                if (!Number.isInteger(value)) throw header + 'Input is not integer.';
                if (value < -200) throw header + 'Input is less then -200.';
                if (value > 200) throw header + 'Input is great then 200.';
            }),
        getHeaderLine('8.3. Калькулятор из функций'),
        getTextLine('Введите фунциональную последовательность из элементов:<br>'
            + 'Цифры: zero, one, two, three, four, five, six, seven, eight, nine<br>'
            + 'Операторы: plus, minus, times, dividedBy'),
        getTaskValues(TASK_FUNCS.task3,
            '"zero(dividedBy(zero()))"',
            value => {
                let header = 'Validation:\n';
                let valueWithpouComments = value.replace(/\/\/.*/, '').replace(/\s/g, '');

                let keywords = /(zero)|(one)|(two)|(three)|(four)|(five)|(six)|(seven)|(eight)|(nine)|(plus)|(minus)|(times)|(dividedBy)|(\()|(\))|(;)/g
                let valueWithoutKeywords = valueWithpouComments.replace(keywords, '');
                if (valueWithoutKeywords.length > 0) throw header + 'Input has unexpected characters.';

                let openBracketCount = (valueWithpouComments.match(/\(/g) || []).length;
                let closeBracketCount = (valueWithpouComments.match(/\)/g) || []).length;
                if (openBracketCount != closeBracketCount) throw header + 'Incorrect brackets count!';
            })
    ]
};

render(pageElement);

bodyElement.innerHTML = '';
bodyElement.append(pageElement.element);