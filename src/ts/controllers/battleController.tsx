import { Commands } from "../controls";
import { addStateExp, tryCompetition } from "../rpg/actions";
import { getCharacterWithLevel, updateCommonStates } from "../rpg/characters";
import { getResourceInfo, renderBattleInfo } from "../rpg/characterToHtml";
import { diceExpressionToString, getDiceExpressionValue } from "../rpg/dices";
import { getDamageByStrength, States } from "../rpg/elements";
import { NavigationButtons } from "../utils/common";
import { ButtonsConfig, InfoComponent } from "./components/infoComponent";
import { MenuComponent } from "./components/menuComponent";

const CSS = {
    table: 'width-100 align-center',
};

export enum BattleControllerTexts {
    BtnAttack = 'CTRL-BTTL-BTN-ATTACK',
};

export class BattleController extends MenuComponent {
    player: RPG.TCharacter;
    enemy: RPG.TCharacter;
    battleLog: string[];

    constructor(level: number) {
        const buttons = {
            attack: {
                value: BattleControllerTexts.BtnAttack,
                isActive: () => true,
            },
            back: {
                value: NavigationButtons.Back,
                isActive: () => true,
            },
        } as StrDictionary<TMenuItem>;

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
    commonInit(): void {
        const instance = this;

        Object.values(instance.menuConfig.items).forEach((item: TMenuItem) => {
            item.description = instance.globalController.translationsUtils.enumTranslations[item.value];
        })
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
        const enemyTable = renderBattleInfo(this.enemy, this.globalController.translationsUtils);
        const characterTable = renderBattleInfo(this.player, this.globalController.translationsUtils);

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
    const playerDexterity = player.primaryStates[States.Dexterity];

    const enemy = controller.enemy;
    const enemyDexterity = enemy.primaryStates[States.Dexterity];

    log.unshift('--- Проверка инициативы ---');
    while (true) {
        const result = tryCompetition(enemyDexterity.value, playerDexterity.value);

        log.unshift(`${player.name}: Ловкость ${playerDexterity.value} + Бросок ${result.target.dice.result} = ${result.target.value}`);
        addStateExp(playerDexterity, 1);

        log.unshift(`${enemy.name}: Ловкость ${enemyDexterity.value} + Бросок ${result.initiator.dice.result} = ${result.initiator.value}`);
        addStateExp(enemyDexterity, 1);

        if (result.initiator.value == result.target.value) {
            log.unshift('Повторная проверка инициативы');
            continue;
        }

        if (result.success) {
            log.unshift('> Противник ходит первым <');
            addStateExp(enemyDexterity, 1);
        } else {
            log.unshift('> Игрок ходит первым <');
            addStateExp(playerDexterity, 1);
        }

        return result.success;
    }
}

function tryAttack(attacker: RPG.TCharacter, target: RPG.TCharacter, log: string[]): RPG.TCompetitionResult {
    log.unshift(`--- ${attacker.name} атакует ${target.name} ---`);

    const attackerDexterity = attacker.primaryStates[States.Dexterity];
    const targetDexterity = target.primaryStates[States.Dexterity];

    // Add skills

    const attackerValue = attackerDexterity.value;
    const targetValue = targetDexterity.value;

    const result = tryCompetition(attackerValue, targetValue);

    log.unshift(`Атака ${attacker.name}: Ловкость ${attackerDexterity.value} + Бросок ${result.initiator.dice.result} = ${result.initiator.value}`);
    addStateExp(attackerDexterity, 1);
    log.unshift(`Защита ${target.name}: Ловкость ${targetDexterity.value} + Бросок ${result.target.dice.result} = ${result.target.value}`);
    addStateExp(targetDexterity, 1);

    return result;
}

function tryDealDamage(attacker: RPG.TCharacter, target: RPG.TCharacter, attackResult: RPG.TCompetitionResult, log: string[]) {
    if (attackResult.success) {
        const attackMod = Math.floor(attackResult.result / 5);
        addStateExp(attacker.primaryStates[States.Dexterity], 1 + attackMod);

        const attackStrength = attacker.primaryStates[States.Strength];
        addStateExp(attackStrength, 1);
        const damageDice = getDamageByStrength(attackStrength.value + attackMod);
        const damage = getDiceExpressionValue(damageDice).result;

        target.commonStates.health.current -= damage;
        log.unshift(`> ${attacker.name} бьет ${target.name} c результатом ${attackResult.result} нанося ${damage} (${diceExpressionToString(damageDice)}) урона с результатом ${getResourceInfo(target.commonStates.health)} <`);
        addStateExp(target.primaryStates[States.Constitution], damage);
        updateCommonStates(target);
    } else if (attackResult.result <= -5) {
        const attackMod = Math.floor(-attackResult.result / 5);
        addStateExp(target.primaryStates[States.Dexterity], 1 + attackMod);

        const attackStrength = target.primaryStates[States.Strength];
        addStateExp(attackStrength, 1);
        const damageDice = getDamageByStrength(attackStrength.value + attackMod);
        const damage = getDiceExpressionValue(damageDice).result;

        attacker.commonStates.health.current -= damage;
        log.unshift(`> ${target.name} контратакует ${attacker.name} c результатом ${attackResult.result} нанося ${damage} (${diceExpressionToString(damageDice)}) урона с результатом ${getResourceInfo(attacker.commonStates.health)} <`);
        addStateExp(attacker.primaryStates[States.Constitution], damage);
        updateCommonStates(attacker);
    } else {
        log.unshift(`> ${target.name} блокирует атаку ${attacker.name} c результатом ${attackResult.result} <`);
        addStateExp(target.primaryStates[States.Dexterity], 1);
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