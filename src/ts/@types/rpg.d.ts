declare namespace RPG {
    namespace Character {
        type TState = {
            value: number,
            expMultiplier: number,
            experience: number,
        };
        type TPrimaryStates = StrDictionary<TState>;

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

    type TCompetitionActorData = {
        skill: number,
        dice: TDiceExpressionResult,
        value: number,
    };

    type TCompetitionResult = {
        success: boolean,
        result: number,
        initiator: TCompetitionActorData,
        target: TCompetitionActorData,
    };
}