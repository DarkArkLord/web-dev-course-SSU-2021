import { getStatesTemplate, ArmorParts, States } from "../rpgSystem";

export function getDefaultCharacter() {
    let character = {
        states: getStatesTemplate(),
        armor: {
            [ArmorParts.head]: 0,
            [ArmorParts.body]: 0,
            [ArmorParts.hands]: 0,
            [ArmorParts.legs]: 0,
        },
        weapon: 0,
        hp: undefined
    };
    character.hp = getMaxHP(character);
    return character;
}

export function getMaxHP(character) {
    let constitution = character.states[States.constitution].value;
    let health = 0;
    let shield = 0;
    for (const part in character.armor) {
        const level = character.armor[part];
        health += getHealthByArmor(constitution, part, level);
        shield += getShieldByArmor(constitution, part, level);
    }

    let hp = {
        health: {
            max: health,
            current: health,
        },
        shield:  {
            max: shield,
            current: shield,
        },
    };

    if(character.hp) {
        hp.health.current = Math.round(character.hp.health.current * hp.health.max / character.hp.health.max);
    }

    return hp;
}