import { StartOfWeek } from "./types";

/**
 * Example: At May 2026, the first day of month is Friday, which means this
 * method will return 5.
 */
export const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay();
};

/**
 * Returns total number of days for a month.
 */
export const getDaysOfMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

/**
 * Returns total number of days of last month.
 */
export const getDaysOfLastMonth = (year: number, month: number) => {
  return new Date(year, month, 0).getDate();
};

/**
 * Checks if given input is a valid date.
 *
 * @param dateInMs Date object or date in milliseconds
 */
export const isValidDate = (date: number | Date) => {
  if (typeof date === "number") {
    return !isNaN(date);
  }
  if (date instanceof Date) {
    return !isNaN(date.getTime());
  }

  return false;
};

export const getOffset = (startOfWeek: StartOfWeek) => {
  return startOfWeek === "monday" ? 0 : 1;
};
