export enum States {
    Strength = 'CHAR-STATE-STR',
    Dexterity = 'CHAR-STATE-DEX',
    Intelligence = 'CHAR-STATE-INT',
    Constitution = 'CHAR-STATE-CON',
};

export function getStatesTemplate() {
    const startValue = 10;
    const expMult = 1;
    const startExp = 0;

    function getDefaultValues() {
        return {
            value: startValue,
            expMultiplier: expMult,
            experience: startExp,
        };
    }

    const states = {
        [States.Strength]: getDefaultValues(), // damage, weight
        [States.Dexterity]: getDefaultValues(), // attack, dodge
        [States.Intelligence]: getDefaultValues(), // magick
        [States.Constitution]: getDefaultValues(), // hp
    }


    return states;
}