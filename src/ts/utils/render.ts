declare namespace Render {
    type TTag = HTMLTags | Function;
    type TChild = HTMLElement | string | Array<TChild>;
    type TChilds = Array<TChild>;
}

export enum HTMLTags {
    Table = 'table',
    TableRow = 'tr',
    TableData = 'td',
    UnorderedList = 'ul',
    ListItem = 'li',
    Div = 'div',
    h1 = 'h1',
    h2 = 'h2',
    h3 = 'h3',
    TextArea = 'textarea',
    Button = 'button',
};

export function render(tag: Render.TTag, attributes?: any, ...childs: Render.TChilds): HTMLElement {
    if (tag instanceof Function) {
        return tag(attributes, ...childs);
    }

    const element = document.createElement(tag);

    if (attributes) {
        for (const name in attributes) {
            const value = attributes[name];
            element.setAttribute(name, value);
        }
    }

    for (const child of childs) {
        addChild(element, child);
    }

    return element;
}

function addChild(parent: HTMLElement, child: Render.TChild) {
    if (Array.isArray(child)) {
        for (const innerChild of child) {
            addChild(parent, innerChild);
        }
    } else {
        parent.appendChild(
            typeof child == 'number' || typeof child == 'string'
                ? document.createTextNode(child)
                : child
        );
    }
}