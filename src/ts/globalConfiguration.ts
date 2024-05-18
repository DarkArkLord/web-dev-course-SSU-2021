import { GlobalController } from './controllers/globalController';
import { Commands, ControlKeys } from './controls'
import { MainGameController } from './mainGameController';
import { DataController } from './utils/dataController';

const mainDisplay = document.getElementById('main-display');

// const globalController = new GlobalController(mainDisplay);

/* --- --- --- --- --- --- --- */
/* --- -- - FOR TESTS - -- --- */
/* --- --- --- --- --- --- --- */

// import { render } from './render/jsx-runtime';
// import { MainMenuController } from './controllers/mainMenuController';

// const menu = new MainMenuController();

// globalController.pushController(menu);

/* --- --- --- --- --- --- --- */

const gameController = new MainGameController(mainDisplay);

function action(command: Commands) {
    // globalController.executeCommand(command);
    // globalController.reDraw();
    gameController.executeCommand(command);
    gameController.reDrawDisplay();
}

document.getElementById('button-up').addEventListener("click", () => action(Commands.Up));
document.getElementById('button-down').addEventListener("click", () => action(Commands.Down));
document.getElementById('button-right').addEventListener("click", () => action(Commands.Right));
document.getElementById('button-left').addEventListener("click", () => action(Commands.Left));
document.getElementById('button-use').addEventListener("click", () => action(Commands.Use));
document.getElementById('button-back').addEventListener("click", () => action(Commands.Back));

document.addEventListener('keydown', function (e) {
    const currentKey = e.code;

    for (const cmdStr in ControlKeys) {
        const command = <Commands>cmdStr;
        if (ControlKeys[command].includes(currentKey)) {
            action(command);
            return;
        }
    }

    // action(Commands.Other);
});

// globalController.reDraw();
gameController.reDrawDisplay();