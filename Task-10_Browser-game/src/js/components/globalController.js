export function GlobalController(startController) {
    let instance = this;
    this.currentController = startController;
    this.controllerStack = [];
    this.gameData = {};
};

GlobalController.prototype = {
    init() {
        //
    },
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
    }
};