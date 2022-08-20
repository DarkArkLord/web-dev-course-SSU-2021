declare namespace RPG {
    type TCharState = {
        value: number,
        expMultiplier: number,
        experience: number,
    };
    type TCharStatesList = {
        [state: string]: TCharState,
    };

    type TCharResource = {
        current: number,
        max: number,
    };
    type TCharResourcesList = {
        health: TCharResource,
    };

    type TCharacter = {
        name: string,
        primaryStates: TCharStatesList,
    };

    type TAttackResult = {
        success: boolean,
        result: number,
        attackerDice: TDiceExpressionResult,
        targetDice: TDiceExpressionResult,
    };
}