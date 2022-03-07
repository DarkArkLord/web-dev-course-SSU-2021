export function getDamageByStrength(strength) {
    const baseStrength = 10;
    const modToDice = 4;
    let result = { dices: 1, mod: 0 };
    let delta = strength - baseStrength;
    if (delta < 0) {
        result.mod = Math.sign(delta) * Math.round(Math.abs(delta) / 2);
    } else {
        result.mod = delta;
        while (result.mod > 2) {
            result.dices += 1;
            result.mod -= modToDice;
        }
    }
    return result;
}