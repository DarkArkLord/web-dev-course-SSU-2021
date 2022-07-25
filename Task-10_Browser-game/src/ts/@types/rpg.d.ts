declare namespace RPG {
    type TState = {
        value: Number,
        expMultiplier: Number,
        experience: Number,
    };
    type TCharacterStates = {
        [state: string]: TState,
    }
}