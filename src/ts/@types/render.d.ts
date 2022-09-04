declare namespace JSX {
    interface IntrinsicElements {
        [elemName: string]: any;
    }
}

declare namespace Render {
    type TChild = HTMLElement | string;
    type TChildToAdd = TChild | Array<TChild | TChildToAdd>;
    type TChilds = Array<TChild>;
    type TTag = string | Function
}