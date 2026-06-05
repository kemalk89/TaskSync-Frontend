import "server-only";

import { cookies } from "next/headers";

const defaultLanguage = "en";
export const getDefaultLanguage = async (): Promise<Locale> => defaultLanguage;

export const getSupportedLanguages = async (): Promise<Locale[]> => [
  "de",
  "en",
  "tr",
];

const dictionaries = {
  de: () =>
    import("./../dictionaries/de.json").then((module) => module.default),
  en: () =>
    import("./../dictionaries/en.json").then((module) => module.default),
  tr: () =>
    import("./../dictionaries/tr.json").then((module) => module.default),
};

export type Locale = keyof typeof dictionaries;

export const hasLocale = async (locale: string): Promise<boolean> =>
  locale in dictionaries;

export const getDictionary = async (locale: Locale) => dictionaries[locale]();

export const getCurrentLanguage = async (): Promise<Locale> => {
  const fromCookie = await getStoredLanguageFromCookie();
  return fromCookie || defaultLanguage;
};

export const storeLanguageInCookie = async (locale: Locale) => {
  const maxAgeInMs = 60 * 60 * 24 * 365 * 1000;
  (await cookies()).set({
    name: "language",
    value: locale,
    path: "/",
    maxAge: maxAgeInMs,
    expires: new Date(Date.now() + maxAgeInMs),
    sameSite: "lax",
    httpOnly: true,
  });
};

export const getStoredLanguageFromCookie = async (): Promise<
  Locale | undefined
> => {
  const language = (await cookies()).get("language")?.value as
    | Locale
    | undefined;
  return language;
};
