import { translations as langRu } from "./langRu";

export const languages = { ru: 'LANG-RU' };

const langList = {
    [languages.ru]: langRu,
};

export function getTranslation(language, id) {
    let translation = langList[language];
    let steps = id.split('-');
    for (let step of steps) {
        if (!translation) return '!ERROR!';
        translation = translation[step];
    }
    return translation;
}