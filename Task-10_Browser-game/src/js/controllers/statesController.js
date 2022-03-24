import { createTextControllerByHtml, ButtonsConfig } from "./textController";

export function createStatesController(character) {
    return createTextControllerByHtml([{element: 'aaaa'}], { buttons: ButtonsConfig.onlyBack, addCounter: false }).first;
}