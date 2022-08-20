/* STATES */

import { getMainDiceValue } from "../utils/random";

export function getExpForStateLevelUp(state: RPG.Character.TState): number {
    return (state.value + 1) * state.expMultiplier;
}

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

export function getDamageByStrength(strength: number): TDiceExpression {
    const baseStrength = 10;
    const modToDice = 4;
    const result = { count: 1, dice: { min: 1, max: 6 }, mod: 0 };
    const strengthMod = strength - baseStrength;
    if (strengthMod < 0) {
        result.mod = -Math.round(-strengthMod / 2);
    } else {
        result.mod = strengthMod % modToDice;
        result.count = ((strengthMod - result.mod) / modToDice) + 1;
        if (result.mod > (modToDice / 2)) {
            result.count += 1;
            result.mod -= modToDice;
        }
    }
    return result;
}