export enum Commands {
    Up = 'UP',
    Down = 'DOWN',
    Right = 'RIGHT',
    Left = 'LEFT',
    Use = 'USE',
    Back = 'BACK',
    // Other = 'OTHER',
};

type TControlKeyList = {
    [key in Commands]: Array<string>;
}

export const ConstrolKeys = <TControlKeyList>{
    [Commands.Use]: [
        'KeyE',
        'Enter',
        'Space',
        'Numpad9'
    ],
    [Commands.Back]: [
        'KeyQ',
        'Escape',
        'Backspace',
        'Numpad7'
    ],
    [Commands.Up]: [
        'KeyW',
        'ArrowUp',
        'Numpad8'
    ],
    [Commands.Down]: [
        'KeyS',
        'ArrowDown',
        'Numpad5'
    ],
    [Commands.Right]: [
        'KeyD',
        'ArrowRight',
        'Numpad6'
    ],
    [Commands.Left]: [
        'KeyA',
        'ArrowLeft',
        'Numpad4'
    ],
};