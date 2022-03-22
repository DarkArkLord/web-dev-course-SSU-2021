import { createTextController, createTextControllerByHtml, ButtonsConfig } from "./textController";

// export const helpController = createTextController(['Помостч', ], { buttons: ButtonsConfig.onlyBack, addCounter: false }).first;

import { HTMLTags } from "../render";
import { getTranslation, languages } from "../translations/translation";
import { ArmorParts, ArmorPartDefence, WeaponBaseDamage } from "../rpgSystem";

function getTestArmorWeaponValues() {
    const content = {
        tag: HTMLTags.Table,
        attributes: { class: 'width_100 align_center' },
        childs: [
            {
                tag: HTMLTags.TableRow,
                childs: [
                    {
                        tag: HTMLTags.TableData,
                        attributes: { rowspan: 2 },
                        value: 'Level'
                    },
                    {
                        tag: HTMLTags.TableData,
                        attributes: { colspan: 4 },
                        value: 'Armor'
                    },
                    {
                        tag: HTMLTags.TableData,
                        attributes: { rowspan: 2 },
                        value: 'Weapon'
                    },
                ]
            },
            {
                tag: HTMLTags.TableRow,
                childs: [
                    {
                        tag: HTMLTags.TableData,
                        value: getTranslation(languages.ru, ArmorParts.head)
                    },
                    {
                        tag: HTMLTags.TableData,
                        value: getTranslation(languages.ru, ArmorParts.body)
                    },
                    {
                        tag: HTMLTags.TableData,
                        value: getTranslation(languages.ru, ArmorParts.hands)
                    },
                    {
                        tag: HTMLTags.TableData,
                        value: getTranslation(languages.ru, ArmorParts.legs)
                    },
                ]
            },
        ]
    };

    function addTableRow(lvl) {
        function getArmor(level, part) {
            return `${ArmorPartDefence[part](level)}`;
        }

        function getWeapon(level) {
            let dmg = WeaponBaseDamage(level);
            return `${dmg}`;
        }

        content.childs.push({
            tag: HTMLTags.TableRow,
            childs: [
                {
                    tag: HTMLTags.TableData,
                    value: lvl
                },
                {
                    tag: HTMLTags.TableData,
                    value: getArmor(lvl, ArmorParts.head)
                },
                {
                    tag: HTMLTags.TableData,
                    value: getArmor(lvl, ArmorParts.body)
                },
                {
                    tag: HTMLTags.TableData,
                    value: getArmor(lvl, ArmorParts.hands)
                },
                {
                    tag: HTMLTags.TableData,
                    value: getArmor(lvl, ArmorParts.legs)
                },
                {
                    tag: HTMLTags.TableData,
                    value: getWeapon(lvl)
                }
            ]
        });
    }

    addTableRow(0);
    addTableRow(1);
    addTableRow(2);
    addTableRow(3);
    addTableRow(4);
    for (let lvl = 10; lvl <= 150; lvl += 10) {
        addTableRow(lvl);
    }

    return createTextControllerByHtml([content], { buttons: ButtonsConfig.onlyBack, addCounter: false }).first;
}

export const helpController = getTestArmorWeaponValues();