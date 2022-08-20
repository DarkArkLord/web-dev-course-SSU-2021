import { Commands } from "../controls";
import { States } from "../rpg/elements";
import { ButtonsConfig, InfoComponent } from "./components/infoComponent";

const CSS = {
    table: 'width_100 align_center',
};

export class ShowStatesController extends InfoComponent {
    constructor(character: RPG.TCharacter) {
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
                <td>
                    {renderStatesTable(character)}
                </td>
                <td>
                    {renderEquipmentTable()}
                </td>
            </tr>
        </table>) as Render.TChild;

        super([states], ButtonsConfig.onlyBack);
        const instance = this;

        instance.commandActions[Commands.Back] = function () {
            instance.globalController.popController();
        }
    }
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

function renderCommonStates(states: RPG.TCharCommonStates) {
    const statesTable = (<table class={CSS.table}>
        <tr>
            <td>
                Здоровье
            </td>
            <td>
                {states.health.current}/{states.health.max}
            </td>
        </tr>
    </table>) as Render.TChild;

    return statesTable;
}

function renderPrimaryStates(states: RPG.TCharStatesList) {
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
        const stateRecord = (<tr>
            <td>
                {stateName}
            </td>
            <td>
                {state.value.toString()}
            </td>
            <td>
                {state.experience.toString()}
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