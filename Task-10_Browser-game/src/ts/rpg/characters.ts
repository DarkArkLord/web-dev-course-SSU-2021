import { getStatesTemplate } from "./elements";

export function getCharacterTemplate(): RPG.TCharacter {
    const states = getStatesTemplate();

    const character = {
        states,
    };

    return character;
}