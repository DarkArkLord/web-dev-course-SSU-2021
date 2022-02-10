import '../scss/app.scss';

import { render } from './components/render.js'
import { ConstrolKeys, Commands } from './components/controls.js'
import { isInArray } from './components/utils.js'
import { MapComponent, testGenerator } from './components/mapComponent'

var mainDisplay = document.getElementById('main_disp');

let map = new MapComponent(20, 20);
map.init();

function renderMenu() {
    mainDisplay.innerHTML = '';
    let elemenet = map.createElement();
    let html = render(elemenet);
    mainDisplay.appendChild(html);
}

function action(command) {
    console.log(command);
    map.executeCommand(command);
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

import './demo.js';