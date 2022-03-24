import * as rpgSystem from "../rpgSystem";
import { getRandomVariantWithProbability } from "../utils";
import { MenuComponent } from "./components/menuComponent";
import { HTMLTags } from "../render";
import { createTextControllerByHtml, ButtonsConfig } from "./textController";

function getDefaultCharacter(name) {
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

export function getDefaultPlayer() {
    let character = getDefaultCharacter('Игрок');
    character.armor[rpgSystem.ArmorParts.head] = 1;
    character.armor[rpgSystem.ArmorParts.body] = 1;
    character.armor[rpgSystem.ArmorParts.hands] = 1;
    character.armor[rpgSystem.ArmorParts.legs] = 1;
    character.weapon = 1;
    character.hp = getMaxHP(character);
    return character;
}

function getEnemy(level) {
    let character = getDefaultCharacter('Враг');
    while (level > 0) {
        getRandomVariantWithProbability([
            {
                probability: 8,
                value: function() {
                    getRandomVariantWithProbability([
                        {
                            probability: 3,
                            value: function() {
                                character.armor[rpgSystem.ArmorParts.head]++;
                            }
                        },
                        {
                            probability: 1,
                            value: function() {
                                character.armor[rpgSystem.ArmorParts.body]++;
                            }
                        },
                        {
                            probability: 2,
                            value: function() {
                                character.armor[rpgSystem.ArmorParts.hands]++;
                            }
                        },
                        {
                            probability: 2,
                            value: function() {
                                character.armor[rpgSystem.ArmorParts.legs]++;
                            }
                        },
                    ])();
                }
            },
            {
                probability: 2,
                value: function() {
                    character.weapon++;
                }
            },
            {
                probability: 1,
                value: function() {
                    getRandomVariantWithProbability([
                        {
                            probability: 1,
                            value: function() {
                                character.states[rpgSystem.States.strength].value++;
                            }
                        },
                        {
                            probability: 1,
                            value: function() {
                                character.states[rpgSystem.States.dexterity].value++;
                            }
                        },
                        {
                            probability: 1,
                            value: function() {
                                character.states[rpgSystem.States.intelligence].value++;
                            }
                        },
                        {
                            probability: 1,
                            value: function() {
                                character.states[rpgSystem.States.constitution].value++;
                            }
                        },
                    ])();
                }
            },
        ])();
        level--;
    }
    character.hp = getMaxHP(character);
    return character;
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
    if (damage > 0) {
        rpgSystem.addStateExp(target.states[rpgSystem.States.constitution], 1);
    }

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
        let damage = rpgSystem.getDiceExpressionValue(damageDice).result;
        logs.push(`Успешный удар на ${damage} урона`);
        getDamage(target, damage);
    } else {
        let mod = Math.floor(-skillCheckDelta / 5);
        rpgSystem.addStateExp(targetDex, mod);
        if (mod >= 1) {
            let tempStp = (target.states[rpgSystem.States.strength].value + mod) * rpgSystem.WeaponBaseDamage(target.weapon);
            let damageDice = rpgSystem.getDamageByStrength(tempStp);
            let damage = rpgSystem.getDiceExpressionValue(damageDice).result;
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

function characterToTable(character, DEBUG = false) {
    let table = {
        tag: HTMLTags.Table,
        attributes: { class: 'width_100 align_center' },
        childs: [
            {
                tag: HTMLTags.TableRow,
                childs: [
                    {
                        tag: HTMLTags.TableData,
                        attributes: { colspan: 2 },
                        childs: [
                            { element: character.name }
                        ]
                    }
                ]
            },
            {
                tag: HTMLTags.TableRow,
                childs: [
                    {
                        tag: HTMLTags.TableData,
                        childs: [
                            { element: `Щит: ${character.hp.shield.current}/${character.hp.shield.max}` }
                        ]
                    }
                ]
            },
            {
                tag: HTMLTags.TableRow,
                childs: [
                    {
                        tag: HTMLTags.TableData,
                        childs: [
                            { element: `Жизнь: ${character.hp.health.current}/${character.hp.health.max}` }
                        ]
                    }
                ]
            },
        ]
    };
    if (DEBUG) {
        table.childs.push({
            tag: HTMLTags.TableRow,
            childs: [
                {
                    tag: HTMLTags.TableData,
                    childs: [
                        { element: JSON.stringify(character) }
                    ]
                }
            ]
        });
    }
    return table;
}

function createEndBatteController(message, logs) {
    let content = {
        tag: HTMLTags.Table,
        attributes: { class: 'width_100 align_center' },
        childs: [
            {
                tag: HTMLTags.TableRow,
                childs: [
                    {
                        tag: HTMLTags.TableData,
                        value: message
                    }
                ]
            },
            {
                tag: HTMLTags.TableRow,
                childs: [
                    {
                        tag: HTMLTags.TableData,
                        childs: [
                            {
                                tag: HTMLTags.TextArea,
                                attributes: { cols: 100, rows: 20 },
                                value: logs.join('\n')
                            }
                        ]
                    }
                ]
            }
        ]
    };
    return createTextControllerByHtml([content], { buttons: ButtonsConfig.onlyNext, addCounter: false }).first;
}

const battleItems = {
    attack: {
        value: "Атаковать",
        isActive: () => true,
    },
    run: {
        value: "Сбежать",
        isActive: () => true,
    },
};

const winText = 'Вы победили!';
const loseText = 'Вы проиграли и будете воскрешены в городе!'

export function BattleController(level, isInBattle) {
    let instance = this;
    this.isInBattle = isInBattle;
    this.level = level;
    this.enemy = getEnemy(level);
    this.logs = [];
    this.menu = new MenuComponent([battleItems.attack, battleItems.run]);
    this.menu.customInit = (mainController) => {
        instance.menu.items.actions[battleItems.attack.value] = function() {
            attack(instance.mainController.gameData.character, instance.enemy, instance.logs);
            if (instance.enemy.hp.health.current < 1) {
                let controller = createEndBatteController(winText, instance.logs);
                mainController.popController();
                mainController.pushController(controller);
                return;
            }
            if (instance.mainController.gameData.character.hp.health.current < 1) {
                let controller = createEndBatteController(loseText, instance.logs);
                mainController.popController();
                if(isInBattle) {
                    mainController.popController();
                }
                mainController.pushController(controller);
                mainController.gameData.character.hp.shield.current = mainController.gameData.character.hp.shield.max;
                mainController.gameData.character.hp.health.current = mainController.gameData.character.hp.health.max;
                return;
            }

            attack(instance.enemy, instance.mainController.gameData.character, instance.logs);
            if (instance.enemy.hp.health.current < 1) {
                let controller = createEndBatteController(winText, instance.logs);
                mainController.popController();
                mainController.pushController(controller);
                return;
            }
            if (instance.mainController.gameData.character.hp.health.current < 1) {
                let controller = createEndBatteController(loseText, instance.logs);
                mainController.popController();
                if(isInBattle) {
                    mainController.popController();
                }
                mainController.pushController(controller);
                mainController.gameData.character.hp.shield.current = mainController.gameData.character.hp.shield.max;
                mainController.gameData.character.hp.health.current = mainController.gameData.character.hp.health.max;
                return;
            }
        };
        instance.menu.items.actions[battleItems.run.value] = function() {
            mainController.popController();
        };
    };
}

BattleController.prototype = {
    init(mainController) {
        this.mainController = mainController;
        this.menu.init(mainController);
        mainController.gameData.character.hp.shield.current = mainController.gameData.character.hp.shield.max;
    },
    executeCommand(command) {
        this.menu.executeCommand(command);
    },
    createElement() {
        this.menu.header = {
            tag: HTMLTags.Table,
            attributes: { class: 'width_100 align_center' },
            childs: [
                {
                    tag: HTMLTags.TableRow,
                    childs: [
                        {
                            tag: HTMLTags.TableData,
                            childs: [characterToTable(this.enemy)]
                        },
                        {
                            tag: HTMLTags.TableData,
                            childs: [characterToTable(this.mainController.gameData.character)]
                        }
                    ]
                },
                {
                    tag: HTMLTags.TableRow,
                    childs: [
                        {
                            tag: HTMLTags.TableData,
                            attributes: { colspan: 2 },
                            childs: [
                                {
                                    tag: HTMLTags.TextArea,
                                    attributes: { cols: 100, rows: 10 },
                                    value: this.logs.join('\n')
                                }
                            ]
                        }
                    ]
                }
            ]
        };
        return this.menu.createElement();
    }
};