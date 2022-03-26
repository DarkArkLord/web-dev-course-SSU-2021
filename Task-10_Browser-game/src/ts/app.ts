import '../scss/styles.scss';
import { RenderItemBuilder, HTMLTags } from './render';

import './test'

let htmlBuilder = RenderItemBuilder.create;
let textBuilder = RenderItemBuilder.createText;

let item = htmlBuilder(HTMLTags.Div)
    .addChilds(
        htmlBuilder(HTMLTags.Div)
            .setValue('caaaaat'),
        htmlBuilder(HTMLTags.Div)
            .setValue('caaaaats'),
        textBuilder('123')
    );
let result = item.render().element;

const mainDisplay = document.getElementById('main_disp');
mainDisplay.innerHTML = '';
mainDisplay.append(result);