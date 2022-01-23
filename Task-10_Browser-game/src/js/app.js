import '../scss/app.scss';

import { ConstrolKeys, Commands } from './components/controls.js'
import { isInArray } from './components/utils.js'

var mainDisplay = document.getElementById('main_disp');

//

document.getElementById('button_up').addEventListener("click", function() {
    console.log(Commands.Up);
});

document.getElementById('button_right').addEventListener("click", function() {
    console.log(Commands.Right);
});

document.getElementById('button_down').addEventListener("click", function() {
    console.log(Commands.Down);
});

document.getElementById('button_left').addEventListener("click", function() {
    console.log(Commands.Left);
});

document.getElementById('button_use').addEventListener("click", function() {
    console.log(Commands.Use);
});

document.getElementById('button_back').addEventListener("click", function() {
    console.log(Commands.Back);
});

document.addEventListener('keydown', function(e) {
    const currentKey = e.code;

    if (isInArray(currentKey, ConstrolKeys.Up)) {
        console.log(Commands.Up);
    } else if (isInArray(currentKey, ConstrolKeys.Right)) {
        console.log(Commands.Right);
    } else if (isInArray(currentKey, ConstrolKeys.Down)) {
        console.log(Commands.Down);
    } else if (isInArray(currentKey, ConstrolKeys.Left)) {
        console.log(Commands.Left);
    } else if (isInArray(currentKey, ConstrolKeys.Use)) {
        console.log(Commands.Use);
    } else if (isInArray(currentKey, ConstrolKeys.Back)) {
        console.log(Commands.Back);
    }
});

import './demo.js';