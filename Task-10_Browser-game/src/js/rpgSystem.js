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
    return getDiceExpressionValue({ count: 3, dice: { mim: -3, max: 3 }, mod: 0 });
}

/* STATES */

export const States = {
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
        [States.strength]: getDefValues(States.strength), // damage, weight
        [States.dexterity]: getDefValues(States.dexterity), // stelth, dodge
        [States.intelligence]: getDefValues(States.intelligence), // magick
        [States.constitution]: getDefValues(States.constitution), // hp
        [States.perception]: getDefValues(States.perception), // perseprion, gathering
        [States.meleeWeapon]: getDefValues(States.meleeWeapon), // melee attack, parry
        [States.rangedWeapon]: getDefValues(States.rangedWeapon), // ranged attack
    };

    return states;
}

/* BODY TYPES */

export const BodyParts = {
    head: 'CHAR-PART-HEAD',
    body: 'CHAR-PART-BODY',
    hands: 'CHAR-PART-HANDS',
    legs: 'CHAR-PART-LEGS',
    vitalOrgans: 'CHAR-PART-VITAL',
};

export const BodyPartAttackProbability = [
    { attackProbability: 1, value: BodyParts.head },
    { attackProbability: 15, value: BodyParts.body },
    { attackProbability: 10, value: BodyParts.hands },
    { attackProbability: 5, value: BodyParts.legs },
];

export const BodyPartAttackPenalty = {
    [BodyParts.head]: -6,
    [BodyParts.body]: 0,
    [BodyParts.hands]: -2,
    [BodyParts.legs]: -4,
    [BodyParts.vitalOrgans]: -8,
};

/* ARMOR */

export const ArmorTypes = {
    softArmor: 'ITEM-EQUIP-ARMOR-TYPE-SOFT',
    hardArmor: 'ITEM-EQUIP-ARMOR-TYPE-HARD',
};

export const ArmorPenalty = {
    [ArmorTypes.softArmor]: 0,
    [ArmorTypes.hardArmor]: -1,
};

export const ArmorDefence = {
    [ArmorTypes.softArmor]: 1,
    [ArmorTypes.hardArmor]: 2,
};

export const ArmorParts = {
    head: 'ITEM-EQUIP-ARMOR-PART-HEAD',
    body: 'ITEM-EQUIP-ARMOR-PART-BODY',
    hands: 'ITEM-EQUIP-ARMOR-PART-HANDS',
    legs: 'ITEM-EQUIP-ARMOR-PART-LEGS',
}

export const BodyToArmorParts = {
    [BodyParts.head]: ArmorParts.head,
    [BodyParts.body]: ArmorParts.body,
    [BodyParts.hands]: ArmorParts.hands,
    [BodyParts.legs]: ArmorParts.legs,
}

export const ArmorToBodyParts = {
    [ArmorParts.head]: BodyParts.head,
    [ArmorParts.body]: BodyParts.body,
    [ArmorParts.hands]: BodyParts.hands,
    [ArmorParts.legs]: BodyParts.legs,
}

export const ArmorPartAdditional = {
    [ArmorParts.head]: (lvl) => - Math.ceil(lvl / 3),
    [ArmorParts.body]: (lvl) => Math.ceil(lvl / 3),
    [ArmorParts.hands]: (lvl) => 0,
    [ArmorParts.legs]: (lvl) => 0,
};

/* COMMON */

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