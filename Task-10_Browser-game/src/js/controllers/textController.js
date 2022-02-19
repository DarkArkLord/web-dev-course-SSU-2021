import { MenuComponent } from "./components/menuComponent";

const ContinueButton = {
    value: "Продолжить",
    isActive: () => true,
};

export function createTextController(textElements, mainController) {
    const elements = textElements.map(value => { return { element: value }; });
    return createTextControllerHtml(elements, mainController);
}

export function createTextControllerHtml(elements, mainController) {
    let i = 0;
    const controllers = elements.map(value => {
        let controller = new MenuComponent([ContinueButton], value);
        controller.items.actions[ContinueButton.value] = function() {
            i++;
            mainController.popController();
            if(i < controllers.length) {
                mainController.pushController(controllers[i]);
            }
        }
        return controller;
    });
    mainController.pushController(controllers[0]);
}