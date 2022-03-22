import { HTMLTags } from "../render";
import { MenuComponent } from "./components/menuComponent";

const controllerButtons = {
    next: {
        value: "Продолжить",
        isActive: () => true,
    },
    back: {
        value: "Назад",
        isActive: () => true,
    },
};

export const ButtonsConfig = {
    onlyNext: { next: true, back: false },
    onlyBack: { next: false, back: true },
    both: { next: true, back: true },
};

export function createTextControllerByHtml(elements, config = { buttons: ButtonsConfig.both, addCounter: true }) {
    const buttons = [
        ...(config.buttons.next ? [controllerButtons.next] : []),
        ...(config.buttons.back ? [controllerButtons.back] : []),
    ];

    let result = { first: undefined, list: [] };
    result.list = elements.map((value, index) => {
        let footer = undefined;
        if (config.addCounter) {
            footer = { element: `${index + 1}/${elements.length}` };
        }

        let controller = new MenuComponent(buttons, value, footer);
        const nextIndex = index + 1;
        const prevIndex = index - 1;
        controller.customInit = (mainController) => {
            controller.items.actions[controllerButtons.next.value] = function() {
                mainController.popController();
                if (nextIndex < result.list.length) {
                    mainController.pushController(result.list[nextIndex]);
                }
            };
            controller.items.actions[controllerButtons.back.value] = function() {
                mainController.popController();
                if (prevIndex >= 0) {
                    mainController.pushController(result.list[prevIndex]);
                }
            };
        };
        return controller;
    });
    result.first = result.list[0];
    return result;
}

export function createTextController(textElements, config = { buttons: ButtonsConfig.both, addCounter: true }) {
    const elements = textElements.map(value => { return { element: value }; });
    return createTextControllerByHtml(elements, config);
}