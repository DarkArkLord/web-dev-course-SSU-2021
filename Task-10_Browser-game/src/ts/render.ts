export enum HTMLTags {
    Table = 'table',
    TableRow = 'tr',
    TableData = 'td',
    h2 = 'h2',
    TextArea = 'textarea',
    Button = 'button',
    Div = 'div',
}

interface IRenderItem {
    element?: HTMLElement,
    tag?: HTMLTags,
    attributes?: any,
    childs?: Array<IRenderItem | string>,
    value?: string
}

export function render(tag: HTMLTags, attributes?: any, ...childs: Array<HTMLElement | string>): HTMLElement {
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

// export function render(item: IRenderItem) {
//     if (item.element) {
//         return item.element;
//     }

//     let element: HTMLElement

//     if (item.tag) {
//         element = document.createElement(item.tag);
//     } else {
//         element = document.createTextNode(item.value);
//     }


//     item.element = element;

//     if (item.attributes) {
//         for (let name in item.attributes) {
//             let value = item.attributes[name];
//             element.setAttribute(name, value);
//         }
//     }

//     if (item.childs) {
//         for (let child of item.childs) {
//             if (!child.element) {
//                 render(child);
//             }
//             element.append(child.element);
//         }
//     }

//     return element;
// }

// export class RenderItemBuilder implements IRenderItem {
//     element?: HTMLElement | string;
//     tag?: HTMLTags;
//     attributes?: any;
//     childs?: Array<IRenderItem>;
//     value?: string;

//     constructor(tag?: HTMLTags) {
//         this.tag = tag;
//     }

//     static create(tag: HTMLTags): RenderItemBuilder {
//         return new RenderItemBuilder(tag);
//     }
//     static createText(text: string): IRenderItem {
//         return <IRenderItem>{ value: text };
//     }

//     public setAttribute(name: string, value: string): RenderItemBuilder {
//         this.attributes = this.attributes || {};
//         this.attributes[name] = value;
//         return this;
//     }
//     public setValue(value: string): RenderItemBuilder {
//         this.value = value;
//         return this;
//     }
//     public addChilds(...child: IRenderItem[]): RenderItemBuilder {
//         this.childs = this.childs || [];
//         this.childs.push(...child);
//         return this;
//     }
//     public render(): RenderItemBuilder {
//         render(this);
//         return this;
//     }
// }

export const React = {
    createElement: function (tag: string, attrs: any, ...children: Array<any>) {
        var element = document.createElement(tag);

        for (let name in attrs) {
            if (name && attrs.hasOwnProperty(name)) {
                let value = attrs[name];
                if (value === true) {
                    element.setAttribute(name, name);
                } else if (value !== false && value != null) {
                    element.setAttribute(name, value.toString());
                }
            }
        }
        for (let i = 2; i < arguments.length; i++) {
            let child = arguments[i];
            element.appendChild(
                child.nodeType == null ?
                    document.createTextNode(child.toString()) : child);
        }
        return element;
    }
};
