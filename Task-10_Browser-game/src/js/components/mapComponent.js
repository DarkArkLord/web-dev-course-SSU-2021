import { HTMLTags, ItemTypes } from './render.js'
import { Commands } from './controls.js'

const CellContent = {
    Player: {
        Value: '@',
        Class: '',
    },
    Cell: {
        Empty: {
            Value: '.',
            Class: '',
        },
        Wall: {
            Value: '#',
            Class: '',
        },
        Invisible: {
            Value: '&nbsp;',
            Class: '',
        },
    },
    Flag: {
        Normal: {
            Value: 'F',
            Class: '',
        },
        Used: {
            Value: '!',
            Class: '',
        },
    },
    Door: {
        Next: {
            Value: '>',
            Class: '',
        },
        Prev: {
            Value: '<',
            Class: '',
        },
        Closed: {
            Value: 'X',
            Class: '',
        },
    },
};

export function MapComponent() {
    //
}