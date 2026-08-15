/**
 * Parses given date string to actual date object. Returns null if given input cannot be parsed.
 */
export const parseDate = (dateString: string, locale: string): Date | null => {
  let day, month, year;
  if (locale.startsWith("de") || locale.startsWith("tr")) {
    const parts = dateString.split(".");
    day = parts.at(0);
    month = parts.at(1);
    year = parts.at(2);
  }

  if (locale.toLowerCase() === "en-gb") {
    const parts = dateString.split("/");
    day = parts.at(0);
    month = parts.at(1);
    year = parts.at(2);
  }

  if (locale.toLowerCase() === "en-us") {
    const parts = dateString.split("/");
    month = parts.at(0);
    day = parts.at(1);
    year = parts.at(2);
  }

  if (!day || !month || !year) {
    return null;
  }

  return new Date(Number(year), Number(month) - 1, Number(day));
};
