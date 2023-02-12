type TDictionary<TValue> = {
    [key: string]: TValue,
};

type TTranslationsUtils = {
    enumTranslations: TDictionary<string>,
    controllers: {
        town: {
            header: () => string,
            other: () => string,
            levelSelector: {
                header: () => string,
                levelItem: (level: number) => string,
                enemyLevelItem: (mainLevel: number, subLevel: number) => string,
            },
            temple: {
                header: () => string,
                healedHealth: (healedHealth: number) => string,
            },
        }
    },
};