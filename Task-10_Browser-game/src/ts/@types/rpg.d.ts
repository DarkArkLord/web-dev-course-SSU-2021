declare namespace RPG {
    type TState = {
        value: number,
        expMultiplier: number,
        experience: number,
    };
    type TCharacterStates = {
        [state: string]: TState,
    };
    namespace Battle {
        type TAttackResult = {
            success: boolean,
            attackerDice: number,
            targetDice: number,
        };
    }
}