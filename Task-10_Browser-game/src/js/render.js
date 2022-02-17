export const HTMLTags = {
    Table: 'table',
    TableRow: 'tr',
    TableData: 'td',
    h2: 'h2',
    TextArea: 'textarea',
    Button: 'button',
    Div: 'div',
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

    if (item.value) {
        element.innerHTML = item.value;
    }

    if (item.childs) {
        for (let child of item.childs) {
            if (!child.element) {
                render(child);
            }
            element.append(child.element);
        }
    }

    return element;
}