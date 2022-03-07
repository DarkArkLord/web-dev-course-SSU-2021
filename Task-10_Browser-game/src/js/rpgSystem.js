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

    function getDefValues(id) {
        return { id, value: statesDefValue, expMultiplier: statesDefExpMult, experience: statesDefExp };
    }

    let states = {
        [StateIds.strength]: getDefValues(StateIds.strength), // damage, weight
        [StateIds.dexterity]: getDefValues(StateIds.dexterity), // stelth, dodge
        [StateIds.intelligence]: getDefValues(StateIds.intelligence), // magick
        [StateIds.constitution]: getDefValues(StateIds.constitution), // hp
        [StateIds.perception]: getDefValues(StateIds.perception), // perseprion, gathering
        [StateIds.meleeWeapon]: getDefValues(StateIds.meleeWeapon), // melee attack, parry
        [StateIds.rangedWeapon]: getDefValues(StateIds.rangedWeapon), // ranged attack
    };

    return states;
}

export const BodyPartId = {
    head: 'CHAR-PART-HEAD',
    body: 'CHAR-PART-BODY',
    hands: 'CHAR-PART-HANDS',
    legs: 'CHAR-PART-LEGS',
    vitalOrgans: 'CHAR-PART-VITAL',
}