"use client";

import { useState } from "react";
import {
  getDaysOfLastMonth,
  getDaysOfMonth,
  getFirstDayOfMonth,
} from "./utils";
import styles from "./styles.module.css";

// Calendar will always display 6 rows
const NUM_ROWS = 6;

export const DatePicker = ({
  label,
  dictionaryMonths,
  onSelect,
  month = new Date().getMonth(),
  year = new Date().getFullYear(),
}: Props) => {
  const [isOpen, setOpen] = useState(false);

  const [selectedMonth, setSelectedMonth] = useState(month);
  const [selectedYear, setSelectedYear] = useState(year);

  const handleClick = (
    _: React.MouseEvent,
    day: number,
    month: number,
    year: number,
  ) => {
    if (typeof onSelect === "function") {
      const date = new Date(year, month, day);

      onSelect(date);
    }
  };

  const renderFirstRowOfMonth = () => {
    const firstDayOfMonth = getFirstDayOfMonth(selectedYear, selectedMonth);

    const days = [];
    for (let weekDay = 1; weekDay <= 7; weekDay++) {
      if (weekDay < firstDayOfMonth) {
        // fill days of prev month
        const daysOfLastMonth = getDaysOfLastMonth(selectedYear, selectedMonth);
        const dayOfLastMonth =
          daysOfLastMonth - (firstDayOfMonth - weekDay) + 1;
        const prevMonth = selectedMonth === 0 ? 11 : selectedMonth - 1;
        const prevYear = selectedMonth === 0 ? selectedYear - 1 : selectedYear;

        days.push(
          <div
            key={weekDay}
            onClick={(e) => handleClick(e, dayOfLastMonth, prevMonth, prevYear)}
            className={[styles.day, styles.dayOutsideOfMonth].join(" ")}
            data-testid="day-outside-month"
          >
            {dayOfLastMonth}
          </div>,
        );
      } else {
        days.push(
          <div
            key={weekDay}
            className={styles.day}
            onClick={(e) =>
              handleClick(
                e,
                weekDay - firstDayOfMonth + 1,
                selectedMonth,
                selectedYear,
              )
            }
          >
            {weekDay - firstDayOfMonth + 1}
          </div>,
        );
      }
    }
    return (
      <div key={`row-${0}`} className={styles.row} data-testid="calendar-row">
        {days}
      </div>
    );
  };

  return (
    <div style={{ position: "relative" }}>
      {isOpen && (
        <div className={styles.monthViewContainer}>
          <div className={styles.monthYearSelectionContainer}>
            <select
              name="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
            >
              <option value="0">{dictionaryMonths[0]}</option>
              <option value="1">{dictionaryMonths[1]}</option>
              <option value="2">{dictionaryMonths[2]}</option>
              <option value="3">{dictionaryMonths[3]}</option>
              <option value="4">{dictionaryMonths[4]}</option>
              <option value="5">{dictionaryMonths[5]}</option>
              <option value="6">{dictionaryMonths[6]}</option>
              <option value="7">{dictionaryMonths[7]}</option>
              <option value="8">{dictionaryMonths[8]}</option>
              <option value="9">{dictionaryMonths[9]}</option>
              <option value="10">{dictionaryMonths[10]}</option>
              <option value="11">{dictionaryMonths[11]}</option>
            </select>{" "}
            <select
              name="year"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              <option value={year}>{year}</option>
              <option value={year + 1}>{year + 1}</option>
            </select>
            <button
              type="button"
              className="btn-close btn-sm"
              onClick={() => setOpen(false)}
            ></button>
          </div>
          <div className={styles.monthViewHeader}>
            <div>Mo</div>
            <div>Tu</div>
            <div>We</div>
            <div>Th</div>
            <div>Fr</div>
            <div>Sa</div>
            <div>Su</div>
          </div>
          <div>
            {Array(NUM_ROWS)
              .fill(0)
              .map((_, index) => {
                const isFirstRowInMonth = index === 0;
                if (isFirstRowInMonth) {
                  return renderFirstRowOfMonth();
                }

                const days = [];
                const daysOfMonth = getDaysOfMonth(selectedYear, selectedMonth);
                for (let weekDay = 1; weekDay <= 7; weekDay++) {
                  let dayCounter =
                    7 * index +
                    weekDay -
                    getFirstDayOfMonth(selectedYear, selectedMonth) +
                    1;
                  const isNextMonth = dayCounter > daysOfMonth;
                  if (isNextMonth) {
                    dayCounter = dayCounter - daysOfMonth;
                  }

                  const classNames = [styles.day];
                  if (isNextMonth) {
                    classNames.push(styles.dayOutsideOfMonth);
                  }

                  const nextMonth =
                    selectedMonth === 11 ? 0 : selectedMonth + 1;
                  const nextYear =
                    selectedMonth === 11 ? selectedYear + 1 : selectedYear;

                  days.push(
                    <div
                      key={index + "-" + dayCounter}
                      className={classNames.join(" ")}
                      data-testid={
                        isNextMonth ? "day-outside-month" : undefined
                      }
                      onClick={(e) =>
                        handleClick(
                          e,
                          dayCounter,
                          isNextMonth ? nextMonth : selectedMonth,
                          isNextMonth ? nextYear : selectedYear,
                        )
                      }
                    >
                      {dayCounter}
                    </div>,
                  );
                }

                return (
                  <div
                    key={`row-${index}`}
                    className={styles.row}
                    data-testid="calendar-row"
                  >
                    {days}
                  </div>
                );
              })}
          </div>
        </div>
      )}
      <button onClick={() => setOpen(true)}>{label}</button>
    </div>
  );
};

type Props = {
  label: string;
  dictionaryMonths: string[];
  onSelect?: (date: Date) => void;
  /**
   * Index of the month starting with 0.
   */
  month?: number;
  year?: number;
};
