export function render(tag: string, attributes?: any, ...childs: Array<HTMLElement | string>): HTMLElement {
    let element = document.createElement(tag);

    if (attributes) {
        for (const name in attributes) {
            let value = attributes[name];
            element.setAttribute(name, value);
        }
    }

    for (const child of childs) {
        element.appendChild(
            child instanceof HTMLElement
                ? child
                : document.createTextNode(child)
        );
    }

    return element;
}

export function jsx(tag: string, config: any) {
    let attributes = {...config};
    let childs = [];
    if(attributes.children) {
        delete attributes.children;
        childs.push(config.children);
    }
    return render(tag, attributes, ...childs);
}

export function jsxs(tag: string, config: any) {
    let attributes = {...config};
    let childs = [];
    if(attributes.children) {
        delete attributes.children;
        childs = config.children;
    }
    return render(tag, attributes, ...childs);
}