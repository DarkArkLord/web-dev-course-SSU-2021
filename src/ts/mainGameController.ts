import { getCharacterTemplate } from "./rpg/characters";
import { MainMenuState } from "./states/mainMenuState";
import { DataController } from "./utils/dataController";
import { StatesController } from "./utils/stateMachine";


export class GameDataKeeper {
    private gameData: DataController<TGameData>;
    private settingsData: DataController<TSettingsData>;

    constructor() {
        const GAME_SAVE_NAME = 'GAME-SAVE';
        function defaultGameData(): TGameData {
            // TODO ???
            return {
                lastOpenMapLevel: 1,
                character: getCharacterTemplate('PLAYER'),
            };
        }

        this.gameData = new DataController<TGameData>(GAME_SAVE_NAME, defaultGameData);

        const SETTINGS_SAVE_NAME = 'SETTINGS-SAVE';
        function defaultSettingsData(): TSettingsData {
            return {
                test: 'test data',
            };
        }

        this.settingsData = new DataController<TSettingsData>(SETTINGS_SAVE_NAME, defaultSettingsData);
    }

    public getGameData() {
        return this.gameData;
    }

    public getSettingsData() {
        return this.settingsData;
    }
}

export class MainGameController {
    private display: HTMLElement;
    private dataKeeper: GameDataKeeper;
    private statesController: StatesController;

    constructor(display: HTMLElement) {
        this.display = display;


        this.dataKeeper = new GameDataKeeper();
        this.statesController = new StatesController(this.dataKeeper, this.reDrawDisplay);

        const mmState = new MainMenuState();
        this.statesController.useState(mmState);
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