declare namespace JSX {
    interface IntrinsicElements {
        [elemName: string]: any;
    }
}

declare namespace Render {
    type TChildToAdd = HTMLElement | string | Array<HTMLElement | string | TChildToAdd>;
    type TChilds = Array<HTMLElement | string>;
    type TTag = string | Function
}