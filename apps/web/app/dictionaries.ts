import "server-only";

export const defaultLanguage = "en";

export const supportedLanguages = ["de", "en", "tr"];

const dictionaries = {
  de: () =>
    import("./../dictionaries/de.json").then((module) => module.default),
  en: () =>
    import("./../dictionaries/en.json").then((module) => module.default),
  tr: () =>
    import("./../dictionaries/tr.json").then((module) => module.default),
};

export type Locale = keyof typeof dictionaries;

export const hasLocale = (locale: string): locale is Locale =>
  locale in dictionaries;

export const getDictionary = async (locale: Locale) => dictionaries[locale]();

export const i18n: { currentLanguage: Locale } = {
  currentLanguage: defaultLanguage,
};
