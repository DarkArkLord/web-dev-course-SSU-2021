import { getStatesTemplate, ArmorParts, getMaxHP } from "../rpgSystem";

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