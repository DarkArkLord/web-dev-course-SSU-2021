import { createTextControllerByHtml, ButtonsConfig } from "./textController";
import { HTMLTags } from "../render";
import * as rpg from "../rpgSystem";
import { getTranslation, languages } from "../translations/translation";

export function createStatesController(character) {
    function getStateRow(stateName) {
        let state = character.states[stateName];
        let result = {
            tag: HTMLTags.TableRow,
            childs: [
                {
                    tag: HTMLTags.TableData,
                    value: getTranslation(languages.ru, stateName)
                },
                {
                    tag: HTMLTags.TableData,
                    value: state.value.toString()
                },
                {
                    tag: HTMLTags.TableData,
                    value: state.experience.toString()
                },
                {
                    tag: HTMLTags.TableData,
                    value: rpg.expForLevelUpForState(state)
                },
            ]
        };
        return result;
    }

    function getArmorRow(part) {
        let level = character.armor[part];
        let health = rpg.getHealthByArmor(character.states[rpg.States.constitution].value, part, level);
        let shield = rpg.getShieldByArmor(character.states[rpg.States.constitution].value, part, level);
        return {
            tag: HTMLTags.TableRow,
            childs: [
                {
                    tag: HTMLTags.TableData,
                    value: getTranslation(languages.ru, part)
                },
                {
                    tag: HTMLTags.TableData,
                    value: level.toString()
                },
                {
                    tag: HTMLTags.TableData,
                    value: rpg.ArmorPartDefence[part](level).toString()
                },
                {
                    tag: HTMLTags.TableData,
                    value: `${health.toString()}/${shield.toString()}`
                }
            ]
        };
    }

    function getWeaponRow() {
        let baseDamage = rpg.WeaponBaseDamage(character.weapon);
        let damageExp = rpg.getDamageByStrength(character.states[rpg.States.strength].value * baseDamage);
        let damageModStr = damageExp.mod != 0
            ? ((damageExp.mod > 0 ? '+' : '') + damageExp.mod)
            : '';
        let damageStr = `${damageExp.count}d6${damageModStr}`;
        let damageRange = `${damageExp.count * damageExp.dice.min + damageExp.mod}-${damageExp.count * damageExp.dice.max + damageExp.mod}`;
        return {
            tag: HTMLTags.TableRow,
            childs: [
                {
                    tag: HTMLTags.TableData,
                    value: 'Оружие'
                },
                {
                    tag: HTMLTags.TableData,
                    value: character.weapon.toString()
                },
                {
                    tag: HTMLTags.TableData,
                    value: damageStr
                },
                {
                    tag: HTMLTags.TableData,
                    value: damageRange
                },
            ]
        };
    }

    let content = {
        tag: HTMLTags.Table,
        attributes: { class: 'width_100 align_center' },
        childs: [
            {
                tag: HTMLTags.TableRow,
                childs: [
                    {
                        tag: HTMLTags.TableData,
                        value: 'Имя'
                    },
                    {
                        tag: HTMLTags.TableData,
                        value: character.name
                    }
                ]
            },
            {
                tag: HTMLTags.TableRow,
                childs: [
                    {
                        tag: HTMLTags.TableData,
                        value: 'Характеристики'
                    },
                    {
                        tag: HTMLTags.TableData,
                        value: 'Экипировка'
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
                                tag: HTMLTags.Table,
                                attributes: { class: 'width_100 align_center' },
                                childs: [
                                    {
                                        tag: HTMLTags.TableRow,
                                        childs: [
                                            {
                                                tag: HTMLTags.TableData,
                                                value: 'Название'
                                            },
                                            {
                                                tag: HTMLTags.TableData,
                                                value: 'Уровень'
                                            },
                                            {
                                                tag: HTMLTags.TableData,
                                                value: 'Опыт'
                                            },
                                            {
                                                tag: HTMLTags.TableData,
                                                value: 'Для нового уровня'
                                            },
                                        ]
                                    },
                                    getStateRow(rpg.States.strength),
                                    getStateRow(rpg.States.dexterity),
                                    getStateRow(rpg.States.intelligence),
                                    getStateRow(rpg.States.constitution),
                                ]
                            }
                        ]
                    },
                    {
                        tag: HTMLTags.TableData,
                        childs: [
                            {
                                tag: HTMLTags.Table,
                                attributes: { class: 'width_100 align_center' },
                                childs: [
                                    {
                                        tag: HTMLTags.TableRow,
                                        childs: [
                                            {
                                                tag: HTMLTags.TableData,
                                                value: 'Название'
                                            },
                                            {
                                                tag: HTMLTags.TableData,
                                                value: 'Уровень'
                                            },
                                            {
                                                tag: HTMLTags.TableData,
                                                value: 'Базовая защита'
                                            },
                                            {
                                                tag: HTMLTags.TableData,
                                                value: 'Здоровье/Щиты'
                                            },
                                        ]
                                    },
                                    getArmorRow(rpg.ArmorParts.head),
                                    getArmorRow(rpg.ArmorParts.body),
                                    getArmorRow(rpg.ArmorParts.hands),
                                    getArmorRow(rpg.ArmorParts.legs),
                                    {
                                        tag: HTMLTags.TableRow,
                                        childs: [
                                            {
                                                tag: HTMLTags.TableData,
                                                attributes: { colspan: 4 },
                                            }
                                        ]
                                    },
                                    {
                                        tag: HTMLTags.TableRow,
                                        childs: [
                                            {
                                                tag: HTMLTags.TableData,
                                                value: 'Название'
                                            },
                                            {
                                                tag: HTMLTags.TableData,
                                                value: 'Уровень'
                                            },
                                            {
                                                tag: HTMLTags.TableData,
                                                attributes: { colspan: 2 },
                                                value: 'Урон'
                                            }
                                        ]
                                    },
                                    getWeaponRow()
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    };
    return createTextControllerByHtml([content], { buttons: ButtonsConfig.onlyBack, addCounter: false }).first;
}