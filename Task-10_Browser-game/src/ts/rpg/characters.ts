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

    for (let i = 0; i < additionalLevels; i++) {
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
    } as RPG.TCharacter;

    return character;
}

export function updateCommonStates(character: RPG.TCharacter) {
    const commonStates = getCommonStates(character.primaryStates);
    character.commonStates.health.max = commonStates.health.max;
}