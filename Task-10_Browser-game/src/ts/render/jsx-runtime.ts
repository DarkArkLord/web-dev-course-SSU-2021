function addChild(parent: HTMLElement, child: Render.TChildToAdd): void {
    if (Array.isArray(child)) {
        for (const innerChild of child) {
            addChild(parent, innerChild);
        }
    } else {
        parent.appendChild(
            child instanceof HTMLElement
                ? child
                : document.createTextNode(child)
        );
    }
}

export function render(tag: Render.TTag, attributes?: any, ...childs: Render.TChilds): HTMLElement {
    if (tag instanceof Function) {
        return (tag as Function)(attributes, ...childs);
    }

    let element = document.createElement(tag as string);

    if (attributes) {
        for (const name in attributes) {
            let value = attributes[name];
            element.setAttribute(name, value);
        }
    }

    for (const child of childs) {
        addChild(element, child);
    }

    return element;
}

export function jsx(tag: Render.TTag, config: any) {
    let attributes = { ...config };
    let childs = [];
    if (attributes.children) {
        delete attributes.children;
        childs.push(config.children);
    }
    return render(tag, attributes, ...childs);
}

export function jsxs(tag: Render.TTag, config: any) {
    let attributes = { ...config };
    let childs = [];
    if (attributes.children) {
        delete attributes.children;
        childs = config.children;
    }
    return render(tag, attributes, ...childs);
}

export function Fragment(attributes?: any, ...childs: Render.TChilds) {
    return childs;
}