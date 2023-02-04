import { TownButtonsText } from "../../controllers/townController";
import { States } from "../../rpg/elements";

const enumTranslations = {
    // Характеристики
    [States.Strength]: 'Сила',
    [States.Dexterity]: 'Ловкость',
    [States.Intelligence]: 'Интеллект',
    [States.Constitution]: 'Выносливость',
};

export const TranslationsUtils = {
    enumTranslations,
};