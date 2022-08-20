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

/* ATTACK */

export function tryAttack(attacker: RPG.TCharacter, target: RPG.TCharacter): RPG.TAttackResult {
    const attackerDexterity = attacker.primaryStates[States.Dexterity].value;
    const targetDexterity = target.primaryStates[States.Dexterity].value;

    const attackerDice = getMainDiceValue();
    const targetDice = getMainDiceValue();

    const attackerValue = attackerDexterity + attackerDice.result;
    const targetValue = targetDexterity + targetDice.result;

    const successCheck = targetValue - attackerValue;

    return {
        success: successCheck >= 0,
        result: successCheck,
        attackerDice,
        targetDice
    };
}