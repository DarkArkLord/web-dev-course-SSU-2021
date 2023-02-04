import { floorValue } from "../utils/common";
import { diceExpressionToString } from "./dices";
import { getDamageByStrength, getExpForStateLevelUp, States } from "./elements";

const CSS = {
    table: 'width-100 align-center',
    topData: 'vertical-align-top',
};

export function renderCharacter(character: RPG.TCharacter, translationsUtils: TTranslationsUtils) {
    const states = (<table class={CSS.table}>
        <tr>
            <td>
                Имя
            </td>
            <td>
                {character.name}
            </td>
        </tr>
        <tr>
            <td class={CSS.topData}>
                {renderStatesTable(character, translationsUtils)}
            </td>
            <td class={CSS.topData}>
                {renderEquipmentTable()}
            </td>
        </tr>
    </table>) as Render.TChild;

    return states;
}

function renderStatesTable(character: RPG.TCharacter, translationsUtils: TTranslationsUtils) {
    const statesTable = (<table class={CSS.table}>
        <tr>
            <td>
                Вторичные Характеристики
            </td>
        </tr>
        <tr>
            <td>
                {renderCommonStates(character.commonStates, translationsUtils)}
            </td>
        </tr>
        <tr>
            <td>
                Первичные Характеристики
            </td>
        </tr>
        <tr>
            <td>
                {renderPrimaryStates(character.primaryStates, translationsUtils)}
            </td>
        </tr>
        <tr>
            <td>
                Навыки
            </td>
        </tr>
        <tr>
            <td>
                {renderSkills()}
            </td>
        </tr>
    </table>) as Render.TChild;

    return statesTable;
}

function renderCommonStates(states: RPG.Character.TCommonStates, translationsUtils: TTranslationsUtils) {
    const statesTable = (<table class={CSS.table}>
        <tr>
            <td>
                Здоровье
            </td>
            <td>
                {getResourceInfo(states.health)}
            </td>
        </tr>
    </table>) as Render.TChild;

    return statesTable;
}

export function getResourceInfo(resource: RPG.Character.TResource) {
    return getInfoWithPercent(resource.current, resource.max);
}

function getInfoWithPercent(current: number, max: number) {
    const percent = floorValue(current / max * 100);
    return `${current}/${max} (${percent}%)`;
}

function renderPrimaryStates(states: RPG.Character.TPrimaryStates, translationsUtils: TTranslationsUtils) {
    const statesTable = (<table class={CSS.table}>
        <tr>
            <td>
                Название
            </td>
            <td>
                Уровень
            </td>
            <td>
                Опыт
            </td>
        </tr>
        {RenderStateRow(States.Strength, translationsUtils)}
        {RenderStateRow(States.Dexterity, translationsUtils)}
        {RenderStateRow(States.Intelligence, translationsUtils)}
        {RenderStateRow(States.Constitution, translationsUtils)}
    </table>) as Render.TChild;

    return statesTable;

    function RenderStateRow(stateName: string, translationsUtils: TTranslationsUtils) {
        const stateTranslation = translationsUtils.enumTranslations[stateName];
        const state = states[stateName];
        const expToUp = getExpForStateLevelUp(state);
        const stateRecord = (<tr>
            <td>
                {stateTranslation}
            </td>
            <td>
                {state.value.toString()}
            </td>
            <td>
                {getInfoWithPercent(state.experience, expToUp)}
            </td>
        </tr>) as Render.TChild;

        return stateRecord
    }
}

function renderSkills() {
    const skillsTable = (<table class={CSS.table}>
        <tr>
            <td>
                Название
            </td>
            <td>
                Уровень
            </td>
            <td>
                Опыт
            </td>
        </tr>
        <tr>
            <td>
                TODO
            </td>
            <td>
                TODO
            </td>
            <td>
                TODO
            </td>
        </tr>
    </table>) as Render.TChild;

    return skillsTable;
}

function renderEquipmentTable() {
    const equipmentTable = (<table class={CSS.table}>
        <tr>
            <td>
                Экипировка
            </td>
        </tr>
        <tr>
            <td>
                Броня
            </td>
        </tr>
        <tr>
            <td>
                {renderArmor()}
            </td>
        </tr>
        <tr>
            <td>
                Оружие
            </td>
        </tr>
        <tr>
            <td>
                {renderWeapon()}
            </td>
        </tr>
    </table>) as Render.TChild;

    return equipmentTable;
}

function renderArmor() {
    const armorTable = (<table class={CSS.table}>
        <tr>
            <td>
                Тип
            </td>
            <td>
                Название
            </td>
            <td>
                Уровень
            </td>
            <td>
                Броня
            </td>
        </tr>
        <tr>
            <td>
                TODO
            </td>
            <td>
                TODO
            </td>
            <td>
                TODO
            </td>
            <td>
                TODO
            </td>
        </tr>
    </table>) as Render.TChild;

    return armorTable;
}

function renderWeapon() {
    const weaponTable = (<table class={CSS.table}>
        <tr>
            <td>
                Тип
            </td>
            <td>
                Название
            </td>
            <td>
                Уровень
            </td>
            <td>
                Урон
            </td>
        </tr>
        <tr>
            <td>
                TODO
            </td>
            <td>
                TODO
            </td>
            <td>
                TODO
            </td>
            <td>
                TODO
            </td>
        </tr>
    </table>) as Render.TChild;

    return weaponTable;
}

export function renderBattleInfo(character: RPG.TCharacter, translationsUtils: TTranslationsUtils) {
    const strength = character.primaryStates[States.Strength].value;
    const baseDamage = getDamageByStrength(strength);

    const dexterity = character.primaryStates[States.Dexterity].value;
    const attackValue = dexterity;
    const defenseValue = dexterity;

    const info = (<table class={CSS.table}>
        <tr>
            <td colspan="2">
                {character.name}
            </td>
        </tr>
        <tr>
            <td>
                Здоровье
            </td>
            <td>
                {getResourceInfo(character.commonStates.health)}
            </td>
        </tr>
        <tr>
            <td>
                Базовый Урон
            </td>
            <td>
                {diceExpressionToString(baseDamage)}
            </td>
        </tr>
        <tr>
            <td>
                Значение Атаки
            </td>
            <td>
                {attackValue}
            </td>
        </tr>
        <tr>
            <td>
                Значение Защиты
            </td>
            <td>
                {defenseValue}
            </td>
        </tr>
    </table>) as Render.TChild;

    return info;
}