import { getPrimaryStatesTemplate } from "./elements";

export function getCharacterTemplate(name: string): RPG.TCharacter {
    const primaryStates = getPrimaryStatesTemplate();

    const character = {
        name,
        primaryStates,
    };

    return character;
}

// add generate character by level