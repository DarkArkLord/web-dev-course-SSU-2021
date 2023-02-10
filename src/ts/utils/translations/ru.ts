import { States } from "../../rpg/elements";
import { NavigationButtons } from "../common";
import { TownControllerTexts, TownTempleTexts } from "../../controllers/townController";
import { MainMenuControllerTexts } from "../../controllers/mainMenuController";
import { BattleControllerTexts } from "../../controllers/battleController";

const enumTranslations = {
    // Характеристики
    [States.Strength]: 'Сила',
    [States.Dexterity]: 'Ловкость',
    [States.Intelligence]: 'Интеллект',
    [States.Constitution]: 'Выносливость',
    // Главное меню
    [MainMenuControllerTexts.BtnNewGame]: 'Новая игра',
    [MainMenuControllerTexts.BtnContinue]: 'Продолжить',
    [MainMenuControllerTexts.BtnHelp]: 'Справка',
    // Стандартные кнопки навигации
    [NavigationButtons.Next]: 'Дальше',
    [NavigationButtons.Back]: 'Назад',
    // Контроллер города
    [TownControllerTexts.BtnToMap]: 'Отправиться',
    [TownControllerTexts.BtnToBattle]: 'Искать врагов',
    [TownControllerTexts.BtnTemple]: 'Храм',
    [TownControllerTexts.BtnStates]: 'Характеристики',
    [TownControllerTexts.BtnOther]: 'Другое',
    // Контроллер храма
    [TownTempleTexts.BtnHeal]: 'Исцеление',
    // Боевой контроллер
    [BattleControllerTexts.BtnAttack]: 'Атаковать',
};

export const TranslationsUtils = {
    enumTranslations,
};