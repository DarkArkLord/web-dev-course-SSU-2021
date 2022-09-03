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
        initiatorDice,
        initiatorValue,
        targetDice,
        targetValue
    };
}

export function tryAttack(attacker: RPG.TCharacter, target: RPG.TCharacter): RPG.TCompetitionResult {
    const attackerDexterity = attacker.primaryStates[States.Dexterity].value;
    const targetDexterity = target.primaryStates[States.Dexterity].value;

    // Add skills

    const attackerValue = attackerDexterity;
    const targetValue = targetDexterity;

    return tryCompetition(attackerValue, targetValue);
}