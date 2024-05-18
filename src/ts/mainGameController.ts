import { getCharacterTemplate } from "./rpg/characters";
import { DataController } from "./utils/dataController";
import { StatesController } from "./utils/stateMachine";

export class MainGameController {
    private display: HTMLElement;
    private dataController: DataController<TGameData>;
    private statesController: StatesController;

    constructor(display: HTMLElement) {
        this.display = display;

        const GAME_SAVE_NAME = 'GAME-SAVE';
        function defaultGameData() {
            // TODO ???
            return {
                lastOpenMapLevel: 1,
                character: getCharacterTemplate('PLAYER'),
            };
        }

        this.dataController = new DataController<TGameData>(GAME_SAVE_NAME, defaultGameData);
        this.statesController = new StatesController(this.dataController, this.reDrawDisplay);
    }

    public executeCommand(command: Commands): void {
        this.statesController.executeCommand(command);
    }

    public reDrawDisplay() {
        const content = this.statesController.createElement();
        this.display.innerHTML = '';
        this.display.appendChild(content);
    }
}