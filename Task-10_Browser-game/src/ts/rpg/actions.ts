/* STATES */

import { getMainDiceValue } from "./dices";
import { States, getExpForStateLevelUp } from "./elements";

export function addStateExp(state: RPG.Character.TState, exp: number) {
    state.experience += exp;
    const nextLevelExp = getExpForStateLevelUp(state);
    if (state.experience >= nextLevelExp) {
        state.value++;
        state.experience = 0;
    }
}

/* COMPETITIONS */

export function tryCompetition(initiatorSkill: number, targetSkill: number): RPG.TCompetitionResult {
    const initiatorDice = getMainDiceValue();
    const targetDice = getMainDiceValue();

    const initiatorValue = initiatorSkill + initiatorDice.result;
    const targetValue = targetSkill + targetDice.result;

    const successCheck = initiatorValue - targetValue;

    return {
        success: successCheck >= 0,
        result: successCheck,
        initiator: {
            skill: initiatorSkill,
            dice: initiatorDice,
            value: initiatorValue,
        },
        target: {
            skill: targetSkill,
            dice: targetDice,
            value: targetValue,
        },
    };
}