"use client";

import { useState, useEffect, useMemo } from "react";
import { isValidDate } from "./utils";
import { DatePickerDialog } from "./DatePickerDialog";
import { parseDate } from "./parser";

import styles from "./styles.module.css";

export const DatePicker = ({
  placeholder = "",
  dictionaryMonths,
  onSelect,
  locale,
  className = "",
  startOfWeek = "monday",
  showCalendarWeeks = false,
  day,
  month = new Date().getMonth(),
  year = new Date().getFullYear(),
}: Props) => {
  const [isOpen, setOpen] = useState(false);

  const [selectedMonth, setSelectedMonth] = useState(month);
  const [selectedYear, setSelectedYear] = useState(year);
  const [selectedDay, setSelectedDay] = useState(day);

  const selectedDate = useMemo(
    () => new Date(year, month, day),
    [day, month, year],
  );
  const [value, setValue] = useState(
    isValidDate(selectedDate) ? selectedDate.toLocaleDateString(locale) : "",
  );

  // Start: Event handlers
  const handleSelect = (day: number, month: number, year: number) => {
    const date = new Date(year, month, day);

    setValue(date.toLocaleDateString(locale));
    setSelectedDay(day);
    setSelectedMonth(month);
    setSelectedYear(year);

    if (typeof onSelect === "function") {
      onSelect(date);
    }
  };

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);

    const parsed = Date.parse(e.target.value);
    if (isValidDate(parsed)) {
      const parsedDate = parseDate(e.target.value, locale ?? "en-gb");

      if (parsedDate !== null) {
        setSelectedDay(parsedDate.getDate());
        setSelectedMonth(parsedDate.getMonth());
        setSelectedYear(parsedDate.getFullYear());
      }
    }
  };
  // End: Event handlers

  // Start: Hooks
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        event.stopPropagation();
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown, true);
    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isValidDate(selectedDate)) {
      setValue(selectedDate.toLocaleDateString(locale));
    }
  }, [locale, selectedDate]);
  // End: Hooks

  return (
    <div style={{ position: "relative" }}>
      {isOpen && (
        <>
          <div
            className={styles.overlay}
            onClick={() => setOpen(false)}
            tabIndex={0}
            role="button"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setOpen(false);
              }
            }}
          ></div>
          <DatePickerDialog
            day={selectedDay}
            month={selectedMonth}
            year={selectedYear}
            onSelect={handleSelect}
            dictionaryMonths={dictionaryMonths}
            onClose={() => setOpen(false)}
            startOfWeek={startOfWeek}
            showCalendarWeeks={showCalendarWeeks}
          />
        </>
      )}
      <input
        type="text"
        placeholder={placeholder}
        className={className}
        value={value}
        onChange={(e) => handleChangeInput(e)}
        onClick={() => setOpen(true)}
      />
    </div>
  );
};

type Props = {
  /**
   * The 2-letter locale (for example "de", "en").
   * Optionally, also accepts 4-letter locale containing the region (for example "en-US", "en-GB").
   */
  locale?: string;
  placeholder?: string;
  className?: string;
  dictionaryMonths: string[];
  onSelect?: (date: Date) => void;
  /**
   * Index of the month starting with 0.
   */
  month?: number;
  year?: number;
  day?: number;

  startOfWeek?: "monday" | "sunday";
  showCalendarWeeks?: boolean;
};
