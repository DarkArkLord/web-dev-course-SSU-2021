import { floorValue } from "../utils/common";
import { getExpForStateLevelUp, States } from "./elements";

const CSS = {
    table: 'width-100 align-center',
    topData: 'vertical-align-top',
};

export function renderCharacter(character: RPG.TCharacter) {
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
                {renderStatesTable(character)}
            </td>
            <td class={CSS.topData}>
                {renderEquipmentTable()}
            </td>
        </tr>
    </table>) as Render.TChild;

    return states;
}

function renderStatesTable(character: RPG.TCharacter) {
    const statesTable = (<table class={CSS.table}>
        <tr>
            <td>
                Вторичные Характеристики
            </td>
        </tr>
        <tr>
            <td>
                {renderCommonStates(character.commonStates)}
            </td>
        </tr>
        <tr>
            <td>
                Первичные Характеристики
            </td>
        </tr>
        <tr>
            <td>
                {renderPrimaryStates(character.primaryStates)}
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

function renderCommonStates(states: RPG.Character.TCommonStates) {
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

function getResourceInfo(resource: RPG.Character.TResource) {
    return getInfoWithPercent(resource.current, resource.max);
}

function getInfoWithPercent(current: number, max: number) {
    const percent = floorValue(current / max * 100);
    return `${current}/${max} (${percent}%)`;
}

function renderPrimaryStates(states: RPG.Character.TPrimaryStates) {
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
        {RenderStateRow(States.Strength)}
        {RenderStateRow(States.Dexterity)}
        {RenderStateRow(States.Intelligence)}
        {RenderStateRow(States.Constitution)}
    </table>) as Render.TChild;

    return statesTable;

    function RenderStateRow(stateName: string) {
        const state = states[stateName];
        const expToUp = getExpForStateLevelUp(state);
        const stateRecord = (<tr>
            <td>
                {stateName}
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