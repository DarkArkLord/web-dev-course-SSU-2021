declare namespace RPG {
    type TState = {
        value: number,
        expMultiplier: number,
        experience: number,
    };
    type TCharacterStates = {
        [state: string]: TState,
    }
}