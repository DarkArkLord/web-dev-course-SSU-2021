import { GlobalController } from './controllers/globalController';
import { Commands, ConstrolKeys } from './controls'

const mainDisplay = document.getElementById('main_disp');

const globalController = new GlobalController();

/* --- --- --- --- --- --- --- */

import { render } from './render/jsx-runtime';
import { MenuComponent } from './controllers/components/menuComponent';

const items = {
    i1: {
        value: 'i1',
        isActive: () => true,
    },
    i2: {
        value: 'i2',
        isActive: () => false,
    },
    i3: {
        value: 'i3',
        isActive: () => true,
    },
};

const menu = new MenuComponent([items.i1, items.i2, items.i3], render('div', null, 'head'), render('div', null, 'foot'));

Object.values(items).forEach(item => {
    menu.items.actions[item.value] = () => alert(item.value);
});

globalController.pushController(menu);

/* --- --- --- --- --- --- --- */

function renderMenu() {
    mainDisplay.innerHTML = '';
    let element = globalController.createElement();
    mainDisplay.appendChild(element);
}

function action(command: Commands) {
    globalController.executeCommand(command);
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