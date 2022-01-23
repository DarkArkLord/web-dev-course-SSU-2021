export const HTMLTags = {
    Table: 'table',
    TableRow: 'tr',
    TableData: 'td',
    h2: 'h2',
    TextArea: 'textarea',
    Button: 'button',
    Div: 'div',
}

export const ItemTypes = {
    Value: 'VALUE',
    Container: 'CONTAINER',
    HtmlElementContainer: 'HTML_ELEMENT_CONTAINER'
}

export function render(item) {
    if (item.element) {
        return item.element;
    }

    let element = document.createElement(item.tag);
    item.element = element;

    if (item.attributes) {
        for (let name in item.attributes) {
            let value = item.attributes[name];
            element.setAttribute(name, value);
        }
    }

    switch (item.type) {
        case ItemTypes.Value:
            if (item.value) {
                element.innerHTML = item.value;
            }
            break;
        case ItemTypes.Container:
            if (item.childs) {
                for (let child of item.childs) {
                    if (!child.element) {
                        render(child);
                    }
                    element.append(child.element);
                }
            }
            break;
        case ItemTypes.HtmlElementContainer:
            if (item.innerElement) {
                element.append(item.innerElement);
            }
            break;
    }

    return element;
}