import { GlobalController } from './controllers/globalController';
import { Commands, ConstrolKeys } from './controls'

const mainDisplay = document.getElementById('main_disp');

const globalController = new GlobalController();

/* --- --- --- --- --- --- --- */

import { render } from './render/jsx-runtime';
import { InfoComponent, ButtonsConfig } from './controllers/components/infoComponent';

const values = [
    'test 1',
    render('table', null,
        render('tr', null,
            render('td', null, 'test 2_1'),
            render('td', null, 'test 2_2')),
        render('tr', null,
            render('td', null, 'test 2_3'),
            render('td', null, 'test 2_4'))),
    'test 3',
]
const info = new InfoComponent(values, ButtonsConfig.both, true);

globalController.pushController(info);

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