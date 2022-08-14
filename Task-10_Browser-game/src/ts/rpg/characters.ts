import { getStatesTemplate } from "./elements";

export function getCharacterTemplate(name: string): RPG.TCharacter {
    const states = getStatesTemplate();

    const character = {
        name,
        states,
    };

    return character;
}