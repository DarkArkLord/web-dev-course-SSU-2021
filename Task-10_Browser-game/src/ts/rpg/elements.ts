export enum States {
    Strength = 'CHAR-STATE-STR',
    Dexterity = 'CHAR-STATE-DEX',
    Intelligence = 'CHAR-STATE-INT',
    Constitution = 'CHAR-STATE-CON',
};

export const defaultStateValue = 10;

export function getPrimaryStatesTemplate(): RPG.Character.TPrimaryStates {
    const expMult = 1;
    const startExp = 0;

    function getDefaultValues(): RPG.Character.TState {
        return {
            value: defaultStateValue,
            expMultiplier: expMult,
            experience: startExp,
        };
    }

    const states = {
        [States.Strength]: getDefaultValues(), // damage, weight
        [States.Dexterity]: getDefaultValues(), // attack, dodge
        [States.Intelligence]: getDefaultValues(), // magick
        [States.Constitution]: getDefaultValues(), // hp
    }

    return states;
}

export function getCommonStates(primaryStates: RPG.Character.TPrimaryStates): RPG.Character.TCommonStates {
    const health = primaryStates[States.Constitution].value;

    const commonStates = {
        health: {
            current: health,
            max: health,
        },
    } as RPG.Character.TCommonStates;

    return commonStates;
}