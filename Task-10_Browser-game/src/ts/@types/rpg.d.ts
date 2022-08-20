declare namespace RPG {
    namespace Character {
        type TState = {
            value: number,
            expMultiplier: number,
            experience: number,
        };
        type TPrimaryStates = {
            [state: string]: TState,
        };
    
        type TResource = {
            current: number,
            max: number,
        };
        type TCommonStates = {
            health: TResource,
        };
    }

    type TCharacter = {
        name: string,
        primaryStates: Character.TPrimaryStates,
        commonStates: Character.TCommonStates,
    };

    type TAttackResult = {
        success: boolean,
        result: number,
        attackerDice: TDiceExpressionResult,
        targetDice: TDiceExpressionResult,
    };
}