import { Commands } from "../controls";
import { tryCompetition } from "../rpg/actions";
import { getCharacterWithLevel } from "../rpg/characters";
import { renderBattleInfo } from "../rpg/characterToHtml";
import { diceExpressionToString, getDiceExpressionValue } from "../rpg/dices";
import { getDamageByStrength, States } from "../rpg/elements";
import { ButtonsConfig, InfoComponent } from "./components/infoComponent";
import { MenuComponent } from "./components/menuComponent";

const CSS = {
    table: 'width-100 align-center',
};

export class BattleController extends MenuComponent {
    player: RPG.TCharacter;
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
            const playerAttack = tryAttack(instance.player, instance.enemy, instance.battleLog);
            tryDealDamage(instance.player, instance.enemy, playerAttack, instance.battleLog);
            if (checkEndBattle(instance)) {
                return;
            }

            const enemyAttack = tryAttack(instance.enemy, instance.player, instance.battleLog);
            tryDealDamage(instance.enemy, instance.player, enemyAttack, instance.battleLog);
            if (checkEndBattle(instance)) {
                return;
            }
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
        this.player = instance.globalController.gameData.character;
        const isEnemyAttackFirst = checkEnemyAttackFirst(instance);
        if (isEnemyAttackFirst) {
            const result = tryAttack(instance.enemy, instance.player, instance.battleLog);
            tryDealDamage(instance.enemy, instance.player, result, instance.battleLog);
            if (checkEndBattle(instance)) {
                return;
            }
        }
    }
    createElement(): HTMLElement {
        const enemyTable = renderBattleInfo(this.enemy);
        const characterTable = renderBattleInfo(this.player);

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
        this.menuConfig.footer = createLogElement(this);

        return super.createElement();
    }
}

function createLogElement(controller: BattleController) {
    const element = (<textarea cols="100" rows="10" readonly />) as HTMLTextAreaElement;
    element.value = controller.battleLog.join('\n');
    return element;
}

function checkEnemyAttackFirst(controller: BattleController) {
    const log = controller.battleLog;

    const player = controller.player;
    const playerDexterity = player.primaryStates[States.Dexterity].value;

    const enemy = controller.enemy;
    const enemyDexterity = enemy.primaryStates[States.Dexterity].value;

    log.unshift('--- Проверка инициативы ---');
    while (true) {
        const result = tryCompetition(enemyDexterity, playerDexterity);
        log.unshift(`${player.name}: Ловкость ${playerDexterity} + Бросок ${result.target.dice.result} = ${result.target.value}`);
        log.unshift(`${enemy.name}: Ловкость ${enemyDexterity} + Бросок ${result.initiator.dice.result} = ${result.initiator.value}`);

        if (result.initiator.value == result.target.value) {
            log.unshift('Повторная проверка инициативы');
            continue;
        }

        if (result.success) {
            log.unshift('> Противник ходит первым');
        } else {
            log.unshift('> Игрок ходит первым');
        }

        return result.success;
    }
}

function tryAttack(attacker: RPG.TCharacter, target: RPG.TCharacter, log: string[]): RPG.TCompetitionResult {
    log.unshift(`--- ${attacker.name} атакует ${target.name} ---`);

    const attackerDexterity = attacker.primaryStates[States.Dexterity].value;
    const targetDexterity = target.primaryStates[States.Dexterity].value;

    // Add skills

    const attackerValue = attackerDexterity;
    const targetValue = targetDexterity;

    const result = tryCompetition(attackerValue, targetValue);

    log.unshift(`Атака ${attacker.name}: Ловкость ${attackerDexterity} + Бросок ${result.initiator.dice.result} = ${result.initiator.value}`);
    log.unshift(`Защита ${target.name}: Ловкость ${targetDexterity} + Бросок ${result.target.dice.result} = ${result.target.value}`);

    return result;
}

function tryDealDamage(attacker: RPG.TCharacter, target: RPG.TCharacter, attackResult: RPG.TCompetitionResult, log: string[]) {
    // add states exp
    if (attackResult.success) {
        const attackMod = Math.floor(attackResult.result / 5);
        const attackStrength = attacker.primaryStates[States.Strength].value + attackMod;
        const damageDice = getDamageByStrength(attackStrength);
        const damage = getDiceExpressionValue(damageDice).result;

        log.unshift(`> ${attacker.name} бьет ${target.name} c результатом ${attackResult.result} нанося ${damage} (${diceExpressionToString(damageDice)}) урона`);

        target.commonStates.health.current -= damage;
    } else if (attackResult.result <= -5) {
        const attackMod = Math.floor(-attackResult.result / 5);
        const attackStrength = target.primaryStates[States.Strength].value + attackMod;
        const damageDice = getDamageByStrength(attackStrength);
        const damage = getDiceExpressionValue(damageDice).result;

        log.unshift(`> ${target.name} контратакует ${attacker.name} c результатом ${attackResult.result} нанося ${damage} (${diceExpressionToString(damageDice)}) урона`);

        attacker.commonStates.health.current -= damage;
    } else {
        log.unshift(`> ${target.name} блокирует атаку ${attacker.name} c результатом ${attackResult.result}`);
    }
}

function checkEndBattle(controller: BattleController): boolean {
    if (controller.enemy.commonStates.health.current < 1) {
        controller.globalController.popController();
        const message = (<table class={CSS.table}>
            <tr>
                <td>
                    Победа!
                </td>
            </tr>
            <tr>
                <td>
                    {createLogElement(controller)}
                </td>
            </tr>
        </table>) as Render.TChild;
        const messageController = new InfoComponent([message], ButtonsConfig.onlyNext);
        controller.globalController.pushController(messageController);
        return true;
    }

    if (controller.player.commonStates.health.current < 1) {
        const controllerDepth = controller.globalController.controllerStack.length;
        for (let i = 0; i < controllerDepth; i++) {
            controller.globalController.popController();
        }
        const message = (<table class={CSS.table}>
            <tr>
                <td>
                    Поражение!
                </td>
            </tr>
            <tr>
                <td>
                    {createLogElement(controller)}
                </td>
            </tr>
        </table>) as Render.TChild;
        const messageController = new InfoComponent([message], ButtonsConfig.onlyNext);
        controller.globalController.pushController(messageController);
        controller.player.commonStates.health.current = 0;
        return true;
    }

    return false;
}