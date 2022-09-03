import { Commands } from "../controls";
import { tryCompetition } from "../rpg/actions";
import { getCharacterWithLevel } from "../rpg/characters";
import { renderBattleInfo } from "../rpg/characterToHtml";
import { States } from "../rpg/elements";
import { MenuComponent } from "./components/menuComponent";

const CSS = {
    table: 'width-100 align-center',
    logContainer: 'align-center',
};

export class BattleController extends MenuComponent {
    enemy: RPG.TCharacter;
    battleLog: string[];

    constructor(level: number) {
        const buttons = {
            attack: {
                value: "Атаковать",
                isActive: () => true,
            },
            back: {
                value: "Сбежать",
                isActive: () => true,
            },
        };

        super([buttons.attack, buttons.back], `Battle controller ${level}`);
        const instance = this;

        this.enemy = getCharacterWithLevel(`ENEMY ${level}`, level);
        this.battleLog = [];

        this.menuConfig.actions[buttons.attack.value] = function () {
            alert('attack');
        }

        this.menuConfig.actions[buttons.back.value] = function () {
            instance.globalController.popController();
        }

        this.commandActions[Commands.Back] = function () {
            instance.globalController.popController();
        }
    }
    onPush(globalController: IGlobalController): void {
        super.onPush(globalController);
        const instance = this;
        const isEnemyAttackFirst = checkEnemyAttackFirst(instance);
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

        const footerTable = (<textarea cols="100" rows="10" />) as HTMLTextAreaElement;
        footerTable.value = this.battleLog.join('\n');
        this.menuConfig.footer = footerTable;

        return super.createElement();
    }
}

function checkEnemyAttackFirst(controller: BattleController) {
    const log = controller.battleLog;

    const player = controller.globalController.gameData.character;
    const playerDexterity = player.primaryStates[States.Dexterity].value;

    const enemy = controller.enemy;
    const enemyDexterity = enemy.primaryStates[States.Dexterity].value;

    log.push('Проверка инициативы');
    while (true) {
        const result = tryCompetition(enemyDexterity, playerDexterity);
        log.push(`${player.name}: Ловкость ${playerDexterity} + Бросок ${result.target.dice.result} = ${result.target.value}`);
        log.push(`${enemy.name}: Ловкость ${enemyDexterity} + Бросок ${result.initiator.dice.result} = ${result.initiator.value}`);

        if (result.initiator.value == result.target.value) {
            log.push('Повторная проверка инициативы');
            continue;
        }

        if (result.success) {
            log.push('Противник ходит первым');
        } else {
            log.push('Игрок ходит первым');
        }

        return result.success;
    }
}