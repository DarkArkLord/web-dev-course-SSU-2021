import { BaseController } from "./components/baseController";
import { BaseMapComponent } from "./components/baseMapComponent";

type TMapControllerParams = {
    sizeByLevel: (level: number) => number;
    fieldOfView: () => number,
    mainLevel: number,
    startLevel: number,
    endLevel: number,
    generators: {
        [level: number]: number;
    };
};

export class MapController extends BaseController {
    mapStack: BaseMapComponent[];
    currentMap: BaseMapComponent;
    currentLeve: number;
    constructor() {
        super();
    }
    createElement(): HTMLElement {
        return null;
    }
}