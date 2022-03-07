import { getRandomInt } from "./utils";

/* DICES */

export function getDiceExpressionValue(expression) {
    let result = expression.mod || 0;
    let values = [];

    for (let i = 0; i < expression.count; i++) {
        let value = getRandomInt(expression.dice.min, expression.dice.max);
        result += value;
        values.push(value);
    }

    return { result, values, mod: expression.mod };
}

export function getMainDiceValue() {
    let result = getDiceExpressionValue({ count: 3, dice: { mim: -3, max: 3 }, mod: 0 });
    return result.result;
}

/* STATES */

export function getDamageByStrength(strength) {
    const baseStrength = 10;
    const modToDice = 4;
    let result = { count: 1, dice: { min: 1, max: 6 }, mod: 0 };
    let delta = strength - baseStrength;
    if (delta < 0) {
        result.mod = Math.sign(delta) * Math.round(Math.abs(delta) / 2);
    } else {
        result.mod = delta;
        while (result.mod > 2) {
            result.count += 1;
            result.mod -= modToDice;
        }
    }
    return result;
}

export const StateIds = {
    strength: 'CHAR-STATE-STR',
    dexterity: 'CHAR-STATE-DEX',
    intelligence: 'CHAR-STATE-INT',
    constitution: 'CHAR-STATE-CON',
    perception: 'CHAR-STATE-PER',
    meleeWeapon: 'CHAR-STATE-MW',
    rangedWeapon: 'CHAR-STATE-RW',
};

export function getStatesTemplate() {
    const statesDefValue = 10;
    const statesDefExpMult = 1;
    const statesDefExp = 0;

    let states = {
        strength: { id: StateIds.strength, value: statesDefValue, expMultiplier: statesDefExpMult, experience: statesDefExp }, // damage, weight
        dexterity: { id: StateIds.dexterity, value: statesDefValue, expMultiplier: statesDefExpMult, experience: statesDefExp }, // stelth, dodge
        intelligence: { id: StateIds.intelligence, value: statesDefValue, expMultiplier: statesDefExpMult, experience: statesDefExp }, // magick
        constitution: { id: StateIds.constitution, value: statesDefValue, expMultiplier: statesDefExpMult, experience: statesDefExp }, // hp
        perception: { id: StateIds.perception, value: statesDefValue, expMultiplier: statesDefExpMult, experience: statesDefExp }, // perseprion, gathering
        meleeWeapon: { id: StateIds.meleeWeapon, value: statesDefValue, expMultiplier: statesDefExpMult, experience: statesDefExp }, // melee attack, parry
        rangedWeapon: { id: StateIds.rangedWeapon, value: statesDefValue, expMultiplier: statesDefExpMult, experience: statesDefExp }, // ranged attack
    };

    return states;
}