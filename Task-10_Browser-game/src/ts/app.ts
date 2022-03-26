import '../scss/styles.scss';
import { render, HTMLTags } from './render';

import './test'

let item = render(HTMLTags.Div, null,
    render(HTMLTags.Div, null, 'caaaat'),
    render(HTMLTags.Div, null, 'cates'),
    '123'
);

const mainDisplay = document.getElementById('main_disp');
mainDisplay.innerHTML = '';
mainDisplay.append(item);