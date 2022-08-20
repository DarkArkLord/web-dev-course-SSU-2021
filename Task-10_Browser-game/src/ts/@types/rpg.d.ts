declare namespace RPG {
    namespace Character {
        type TState = {
            value: number,
            expMultiplier: number,
            experience: number,
        };
        type TStatesList = {
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
        primaryStates: Character.TStatesList,
        commonStates: Character.TCommonStates,
    };

    type TAttackResult = {
        success: boolean,
        result: number,
        attackerDice: TDiceExpressionResult,
        targetDice: TDiceExpressionResult,
    };
}