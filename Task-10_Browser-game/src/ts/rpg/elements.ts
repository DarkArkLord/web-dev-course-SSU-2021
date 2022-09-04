import { D6_DICE } from "./dices";

/* PRIMARY STATES */

export enum States {
    Strength = 'CHAR-STATE-STR',
    Dexterity = 'CHAR-STATE-DEX',
    Intelligence = 'CHAR-STATE-INT',
    Constitution = 'CHAR-STATE-CON',
};

export const defaultStateValue = 10;

export function getPrimaryStatesTemplate(): RPG.Character.TPrimaryStates {
    const expMultiply = 1;
    const startExp = 0;

    function getDefaultValues(): RPG.Character.TState {
        return {
            value: defaultStateValue,
            expMultiplier: expMultiply,
            experience: startExp,
        };
    }

    const states = {
        [States.Strength]: getDefaultValues(), // damage, weight
        [States.Dexterity]: getDefaultValues(), // attack, dodge
        [States.Intelligence]: getDefaultValues(), // magic
        [States.Constitution]: getDefaultValues(), // hp
    }

    return states;
}

export function getExpForStateLevelUp(state: RPG.Character.TState): number {
    return (state.value + 1) * state.expMultiplier;
}

export function getDamageByStrength(strength: number): TDiceExpression {
    const modToDice = 4;
    const result = { count: 1, dice: D6_DICE, mod: 0 };
    const strengthMod = strength - defaultStateValue;
    if (strengthMod < 0) {
        result.mod = -Math.round(-strengthMod / 2);
    } else {
        result.mod = strengthMod % modToDice;
        result.count = ((strengthMod - result.mod) / modToDice) + 1;
        if (result.mod > (modToDice / 2)) {
            result.count += 1;
            result.mod -= modToDice;
        }
    }
    return result;
}

/* COMMON STATES */

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