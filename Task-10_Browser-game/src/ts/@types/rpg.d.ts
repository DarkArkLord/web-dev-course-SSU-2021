declare namespace RPG {
    type TState = {
        value: number,
        expMultiplier: number,
        experience: number,
    };
    type TCharacterStates = {
        [state: string]: TState,
    };
    type TAttackResult = {
        success: boolean,
        result: number,
        attackerDice: TDiceExpressionResult,
        targetDice: TDiceExpressionResult,
    };
}