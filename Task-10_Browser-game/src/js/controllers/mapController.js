import { MapComponent, testGenerator, CellType } from "./components/mapComponent";

const testParams = {
    width: 20,
    height: 20,
    fieldOfView: () => 12,
    startLevel: 1,
    endLevel: 3,
    generator: testGenerator,
};

export function MapController(params = testParams) {
    let instance = this;
    this.mainController = undefined;
    this.params = params;
    this.mapsStack = [];
    this.currentMap = undefined;
}

MapController.prototype = {
    initCurrentMap(level) {
        if(!this.currentMap) {
            let params = this.params;
            this.currentMap = new MapComponent(params.width * level, params.height * level, { fieldOfView: params.fieldOfView, flagCount: level }, params.generator);
            this.currentMap.init(this.mainController);
        }
        this.currentMap.mapObjectActions[CellType.Door.Prev] = function() {
            alert("prev controller");
        }
        this.currentMap.mapObjectActions[CellType.Door.Next] = function() {
            alert("next controller");
        }
    },
    init(mainController) {
        this.mainController = mainController;
        this.initCurrentMap(this.params.startLevel);
    },
    executeCommand(command) {
        if(this.currentMap) {
            this.currentMap.executeCommand(command);
        }
    },
    createElement() {
        if(this.currentMap) {
            return this.currentMap.createElement();
        }
    }
};

export const mapController = new MapController();