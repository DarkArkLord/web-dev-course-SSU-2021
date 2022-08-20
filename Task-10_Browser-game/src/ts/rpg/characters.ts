import { getPrimaryStatesTemplate, getCommonStates } from "./elements";

export function getCharacterTemplate(name: string): RPG.TCharacter {
    const primaryStates = getPrimaryStatesTemplate();
    const commonStates = getCommonStates(primaryStates);

    const character = {
        name,
        primaryStates,
        commonStates,
    };

    return character;
}

// add generate character by level