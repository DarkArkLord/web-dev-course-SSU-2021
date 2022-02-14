export function GlobalController() {
    let instance = this;
    this.currentController = undefined;
    this.controllerStack = [];
    this.gameData = undefined;
};

GlobalController.prototype = {
    executeCommand(command) {
        if (this.currentController) {
            this.currentController.executeCommand(command);
        }
    },
    createElement() {
        if (this.currentController) {
            return this.currentController.createElement();
        }
        return { element: 'no content' };
    },
    pushController(controller) {
        if (this.currentController) {
            this.controllerStack.push(this.currentController);
        }
        this.currentController = controller;
    },
    popController() {
        this.currentController = this.controllerStack.pop();
    },
};