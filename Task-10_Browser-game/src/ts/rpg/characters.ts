import { getRandomValueWithProbability } from "../utils/random";
import { States, getPrimaryStatesTemplate, getCommonStates } from "./elements";

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

export function getCharacterWithLevel(name: string, additionalLevels: number): RPG.TCharacter {
    const primaryStates = getPrimaryStatesTemplate();

    for (let i = 1; i < additionalLevels; i++) {
        const probabilities = [
            { probability: 1, value: States.Strength, },
            { probability: 1, value: States.Dexterity, },
            { probability: 1, value: States.Intelligence, },
            { probability: 1, value: States.Constitution, },
        ];
        const state = getRandomValueWithProbability(probabilities);
        primaryStates[state].value += 1;
    }

    const commonStates = getCommonStates(primaryStates);

    const character = {
        name,
        primaryStates,
        commonStates,
    };

    return character;
}