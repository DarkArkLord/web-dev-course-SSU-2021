declare namespace RPG {
    type TCharState = {
        value: number,
        expMultiplier: number,
        experience: number,
    };
    type TCharStatesList = {
        [state: string]: TCharState,
    };

    type TCharacter = {
        name: string,
        states: TCharStatesList,
    };

    type TAttackResult = {
        success: boolean,
        result: number,
        attackerDice: TDiceExpressionResult,
        targetDice: TDiceExpressionResult,
    };
}