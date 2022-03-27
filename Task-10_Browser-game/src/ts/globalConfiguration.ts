import { Commands, ConstrolKeys } from './controls'

const mainDisplay = document.getElementById('main_disp');

//

function renderMenu() {
    mainDisplay.innerHTML = '';
    // let elemenet = mainController.createElement();
    let elemenet = document.createTextNode('123');
    mainDisplay.appendChild(elemenet);
}

function action(command: Commands) {
    // mainController.executeCommand(command);
    alert(command);
    renderMenu();
}

document.getElementById('button_up').addEventListener("click", () => action(Commands.Up));
document.getElementById('button_down').addEventListener("click", () => action(Commands.Down));
document.getElementById('button_right').addEventListener("click", () => action(Commands.Right));
document.getElementById('button_left').addEventListener("click", () => action(Commands.Left));
document.getElementById('button_use').addEventListener("click", () => action(Commands.Use));
document.getElementById('button_back').addEventListener("click", () => action(Commands.Back));

document.addEventListener('keydown', function (e) {
    const currentKey = e.code;

    for (const cmdStr in ConstrolKeys) {
        const command = <Commands>cmdStr;
        if (ConstrolKeys[command].includes(currentKey)) {
            action(command);
            return;
        }
    }

    // action(Commands.Other);
});

renderMenu();