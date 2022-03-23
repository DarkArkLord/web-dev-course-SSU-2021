import * as rpgSystem from "../rpgSystem";

export function getDefaultCharacter(name) {
    let character = {
        name: name,
        states: rpgSystem.getStatesTemplate(),
        armor: {
            [rpgSystem.ArmorParts.head]: 0,
            [rpgSystem.ArmorParts.body]: 0,
            [rpgSystem.ArmorParts.hands]: 0,
            [rpgSystem.ArmorParts.legs]: 0,
        },
        weapon: 0,
        hp: undefined
    };
    character.hp = getMaxHP(character);
    return character;
}

export function getMaxHP(character) {
    let constitution = character.states[rpgSystem.States.constitution].value;
    let health = 0;
    let shield = 0;
    for (const part in character.armor) {
        const level = character.armor[part];
        health += rpgSystem.getHealthByArmor(constitution, part, level);
        shield += rpgSystem.getShieldByArmor(constitution, part, level);
    }

    let hp = {
        health: {
            max: health,
            current: health,
        },
        shield: {
            max: shield,
            current: shield,
        },
    };

    if (character.hp) {
        hp.health.current = Math.round(character.hp.health.current * hp.health.max / character.hp.health.max);
    }

    return hp;
}

function getDamage(target, damage) {
    if (target.hp.shield.current > 0) {
        target.hp.shield.current -= damage;
        if (target.hp.shield.current <= 0) {
            damage = -target.hp.shield.current;
            target.hp.shield.current = 0;
        }
    }
    target.hp.health.current -= damage;

}

function attack(attacker, target, logs) {
    let attakerDex = attacker.states[rpgSystem.States.dexterity];
    let targetDex = target.states[rpgSystem.States.dexterity];

    let attackerDice = rpgSystem.getMainDiceValue().result;
    let targetDice = rpgSystem.getMainDiceValue().result;

    logs.push(`Атакующий: ${attacker.name}: ${attakerDex.value} + ${attackerDice}`);
    logs.push(`Защищающийся: ${target.name}: ${targetDex.value} + ${targetDice}`);

    let skillCheckDelta = (attakerDex.value + attackerDice) - (targetDex.value + targetDice);

    if (skillCheckDelta >= 0) {
        let mod = Math.floor(skillCheckDelta / 5);
        rpgSystem.addStateExp(attakerDex, mod);
        let tempStp = (attacker.states[rpgSystem.States.strength].value + mod) * rpgSystem.WeaponBaseDamage(attacker.weapon);
        let damageDice = rpgSystem.getDamageByStrength(tempStp);
        let damage = rpgSystem.getDiceExpressionValue(damageDice);
        logs.push(`Успешный удар на ${damage} урона`);
        getDamage(target, damage);
    } else {
        let mod = Math.floor(-skillCheckDelta / 5);
        rpgSystem.addStateExp(targetDex, mod);
        if (mod >= 1) {
            let tempStp = (target.states[rpgSystem.States.strength].value + mod) * rpgSystem.WeaponBaseDamage(target.weapon);
            let damageDice = rpgSystem.getDamageByStrength(tempStp);
            let damage = rpgSystem.getDiceExpressionValue(damageDice);
            logs.push(`Контратака на ${damage} урона`);
            getDamage(attacker, damage);
        } else {
            logs.push(`Атака парирована`);
        }
    }

    rpgSystem.addStateExp(attakerDex, 1);
    rpgSystem.addStateExp(targetDex, 1);
    logs.push('--- --- --- --- ---');
}