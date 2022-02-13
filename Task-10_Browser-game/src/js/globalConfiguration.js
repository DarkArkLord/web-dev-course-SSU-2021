import { render } from './render.js'
import { Commands, ConstrolKeys } from './controls.js'
import { isInArray } from './utils.js'

import { mainController } from './components/controllersConfiguration.js';

const mainDisplay = document.getElementById('main_disp');

function renderMenu() {
    mainDisplay.innerHTML = '';
    let elemenet = mainController.createElement();
    let html = render(elemenet);
    mainDisplay.append(html);
}

function action(command) {
    mainController.executeCommand(command);
    renderMenu();
}

renderMenu();

document.getElementById('button_up').addEventListener("click", function() {
    action(Commands.Up);
});

document.getElementById('button_right').addEventListener("click", function() {
    action(Commands.Right);
});

document.getElementById('button_down').addEventListener("click", function() {
    action(Commands.Down);
});

document.getElementById('button_left').addEventListener("click", function() {
    action(Commands.Left);
});

document.getElementById('button_use').addEventListener("click", function() {
    action(Commands.Use);
});

document.getElementById('button_back').addEventListener("click", function() {
    action(Commands.Back);
});

document.addEventListener('keydown', function(e) {
    const currentKey = e.code;

    if (isInArray(currentKey, ConstrolKeys.Up)) {
        action(Commands.Up);
    } else if (isInArray(currentKey, ConstrolKeys.Right)) {
        action(Commands.Right);
    } else if (isInArray(currentKey, ConstrolKeys.Down)) {
        action(Commands.Down);
    } else if (isInArray(currentKey, ConstrolKeys.Left)) {
        action(Commands.Left);
    } else if (isInArray(currentKey, ConstrolKeys.Use)) {
        action(Commands.Use);
    } else if (isInArray(currentKey, ConstrolKeys.Back)) {
        action(Commands.Back);
    }
});