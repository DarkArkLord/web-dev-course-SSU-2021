import { createTextController, createTextControllerByHtml, ButtonsConfig } from "./textController";

// export const helpController = createTextController(['Помостч', ], { buttons: ButtonsConfig.onlyBack, addCounter: false }).first;

import { HTMLTags } from "../render";
import { getTranslation, languages } from "../translations/translation";
import { ArmorTypes, ArmorParts, ArmorDefence, ArmorPartHealth, ArmorPartShields, WeaponTypes, WeaponDamage } from "../rpgSystem";

function getTestArmorWeaponValues(startValue = 1, count = 10) {
    const content = {
        tag: HTMLTags.Table,
        attributes: { class: 'width_100 align_center' },
        childs: [
            {
                tag: HTMLTags.TableRow,
                childs: [
                    {
                        tag: HTMLTags.TableData,
                        attributes: { rowspan: 3 },
                        value: 'Level'
                    },
                    {
                        tag: HTMLTags.TableData,
                        attributes: { colspan: 8 },
                        value: 'Armor'
                    },
                    {
                        tag: HTMLTags.TableData,
                        attributes: { colspan: 4, rowspan: 2 },
                        value: 'Weapon'
                    },
                ]
            },
            {
                tag: HTMLTags.TableRow,
                childs: [
                    {
                        tag: HTMLTags.TableData,
                        attributes: { colspan: 4 },
                        value: getTranslation(languages.ru, ArmorTypes.softArmor)
                    },
                    {
                        tag: HTMLTags.TableData,
                        attributes: { colspan: 4 },
                        value: getTranslation(languages.ru, ArmorTypes.hardArmor)
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
                    {
                        tag: HTMLTags.TableData,
                        value: getTranslation(languages.ru, WeaponTypes.knife)
                    },
                    {
                        tag: HTMLTags.TableData,
                        value: getTranslation(languages.ru, WeaponTypes.sword)
                    },
                    {
                        tag: HTMLTags.TableData,
                        value: getTranslation(languages.ru, WeaponTypes.axe)
                    },
                    {
                        tag: HTMLTags.TableData,
                        value: getTranslation(languages.ru, WeaponTypes.bow)
                    },
                ]
            },
        ]
    };

    for (let i = 0; i < count; i++) {
        const lvl = startValue + i;

        function getArmor(level, type, part) {
            let health = ArmorPartHealth[part](level, ArmorDefence[type]);
            let shields = ArmorPartShields[part](level, ArmorDefence[type]);
            return `${health}/${shields}`;
        }

        function getWeapon(level, type) {
            return WeaponDamage[type](level);
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
                    value: getArmor(lvl, ArmorTypes.softArmor, ArmorParts.head)
                },
                {
                    tag: HTMLTags.TableData,
                    value: getArmor(lvl, ArmorTypes.softArmor, ArmorParts.body)
                },
                {
                    tag: HTMLTags.TableData,
                    value: getArmor(lvl, ArmorTypes.softArmor, ArmorParts.hands)
                },
                {
                    tag: HTMLTags.TableData,
                    value: getArmor(lvl, ArmorTypes.softArmor, ArmorParts.legs)
                },
                {
                    tag: HTMLTags.TableData,
                    value: getArmor(lvl, ArmorTypes.hardArmor, ArmorParts.head)
                },
                {
                    tag: HTMLTags.TableData,
                    value: getArmor(lvl, ArmorTypes.hardArmor, ArmorParts.body)
                },
                {
                    tag: HTMLTags.TableData,
                    value: getArmor(lvl, ArmorTypes.hardArmor, ArmorParts.hands)
                },
                {
                    tag: HTMLTags.TableData,
                    value: getArmor(lvl, ArmorTypes.hardArmor, ArmorParts.legs)
                },
                {
                    tag: HTMLTags.TableData,
                    value: getWeapon(lvl, WeaponTypes.knife)
                },
                {
                    tag: HTMLTags.TableData,
                    value: getWeapon(lvl, WeaponTypes.sword)
                },
                {
                    tag: HTMLTags.TableData,
                    value: getWeapon(lvl, WeaponTypes.axe)
                },
                {
                    tag: HTMLTags.TableData,
                    value: getWeapon(lvl, WeaponTypes.bow)
                },
            ]
        });
    }

    return createTextControllerByHtml([content], { buttons: ButtonsConfig.onlyBack, addCounter: false }).first;
}

export const helpController = getTestArmorWeaponValues(1, 10);