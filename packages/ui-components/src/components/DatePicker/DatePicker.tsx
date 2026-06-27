"use client";

import { useState, useEffect } from "react";
import { isValidDate } from "./utils";
import { DatePickerDialog } from "./DatePickerDialog";
import { parseDate } from "./parser";

export const DatePicker = ({
  placeholder = "",
  dictionaryMonths,
  onSelect,
  locale,
  className = "",
  day,
  month = new Date().getMonth(),
  year = new Date().getFullYear(),
}: Props) => {
  const [isOpen, setOpen] = useState(false);

  const [selectedMonth, setSelectedMonth] = useState(month);
  const [selectedYear, setSelectedYear] = useState(year);
  const [selectedDay, setSelectedDay] = useState(day);

  const selectedDate = new Date(year, month, day);
  const [value, setValue] = useState(
    isValidDate(selectedDate) ? selectedDate.toLocaleDateString(locale) : "",
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown, true);
    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isValidDate(selectedDate)) {
      setValue(selectedDate.toLocaleDateString(locale));
    }
  }, [locale]);

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

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape" && isOpen) {
      event.stopPropagation();
      setOpen(false);
    }
  };
  // End: Event handlers

  return (
    <div style={{ position: "relative" }}>
      {isOpen && (
        <DatePickerDialog
          day={selectedDay}
          month={selectedMonth}
          year={selectedYear}
          onSelect={handleSelect}
          dictionaryMonths={dictionaryMonths}
          onClose={() => setOpen(false)}
        />
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
};
