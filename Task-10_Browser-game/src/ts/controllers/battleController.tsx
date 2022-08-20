import { Commands } from "../controls";
import { getCharacterWithLevel } from "../rpg/characters";
import { renderBattleInfo } from "../rpg/characterToHtml";
import { MenuComponent } from "./components/menuComponent";

const CSS = {
    table: 'width-100 align-center',
};

export class BattleController extends MenuComponent {
    enemy: RPG.TCharacter;

    constructor(level: number) {
        const buttons = {
            back: {
                value: "Назад",
                isActive: () => true,
            },
        };

        super([buttons.back], `Battle controller ${level}`);
        const instance = this;

        this.enemy = getCharacterWithLevel(`ENEMY ${level}`, level)

        this.menuConfig.actions[buttons.back.value] = function () {
            instance.globalController.popController();
        }

        this.commandActions[Commands.Back] = function () {
            instance.globalController.popController();
        }
    }
    createElement(): HTMLElement {
        const enemyTable = renderBattleInfo(this.enemy);
        const characterTable = renderBattleInfo(this.globalController.gameData.character);

        const headerTable = (<table class={CSS.table}>
            <tr>
                <td>
                    {enemyTable}
                </td>
                <td>
                    {characterTable}
                </td>
            </tr>
        </table>) as Render.TChild;
        this.menuConfig.header = headerTable;
        return super.createElement();
    }
}