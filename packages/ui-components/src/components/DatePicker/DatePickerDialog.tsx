import styles from "./styles.module.css";
import {
  getDaysOfLastMonth,
  getDaysOfMonth,
  getFirstDayOfMonth,
} from "./utils";

// Calendar will always display 6 rows
const NUM_ROWS = 6;

type Props = {
  dictionaryMonths: string[];
  onSelect?: (day: number, month: number, year: number) => void;
  /**
   * Index of the month starting with 0.
   */
  month?: number;
  year?: number;
  day?: number;
  onClose: () => void;
};

/**
 * This is a pure component (no side effects and state).
 */
export const DatePickerDialog = ({
  onClose,
  onSelect,
  dictionaryMonths,
  day = new Date().getDate(),
  month = new Date().getMonth(),
  year = new Date().getFullYear(),
}: Props) => {
  const handleClick = (
    _: React.MouseEvent,
    day: number,
    month: number,
    year: number,
  ) => {
    handleSelect(day, month, year);
    onClose();
  };

  const handleSelect = (day: number, month: number, year: number) => {
    if (typeof onSelect === "function") {
      onSelect(day, month, year);
    }
  };

  const renderFirstRowOfMonth = () => {
    const firstDayOfMonth = getFirstDayOfMonth(year, month);

    const days = [];
    for (let weekDay = 1; weekDay <= 7; weekDay++) {
      if (weekDay < firstDayOfMonth) {
        // fill days of prev month
        const daysOfLastMonth = getDaysOfLastMonth(year, month);
        const dayOfLastMonth =
          daysOfLastMonth - (firstDayOfMonth - weekDay) + 1;
        const prevMonth = month === 0 ? 11 : month - 1;
        const prevYear = month === 0 ? year - 1 : year;

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
        const classNames = [styles.day];
        const dayCounter = weekDay - firstDayOfMonth + 1;
        if (day === dayCounter) {
          classNames.push(styles.daySelected);
        }

        days.push(
          <div
            key={weekDay}
            className={classNames.join(" ")}
            onClick={(e) => handleClick(e, dayCounter, month, year)}
          >
            {dayCounter}
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
    <div className={styles.monthViewContainer}>
      <div className={styles.monthYearSelectionContainer}>
        <div>
          <select
            name="month"
            value={month}
            onChange={(e) => handleSelect(day, Number(e.target.value), year)}
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
            value={year}
            onChange={(e) => handleSelect(day, month, Number(e.target.value))}
          >
            <option value={year}>{year}</option>
            <option value={year + 1}>{year + 1}</option>
          </select>
        </div>

        <button
          type="button"
          className="btn-close btn-sm"
          onClick={onClose}
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
            const daysOfMonth = getDaysOfMonth(year, month);
            for (let weekDay = 1; weekDay <= 7; weekDay++) {
              let dayCounter =
                7 * index + weekDay - getFirstDayOfMonth(year, month) + 1;
              const isNextMonth = dayCounter > daysOfMonth;
              if (isNextMonth) {
                dayCounter = dayCounter - daysOfMonth;
              }

              const classNames = [styles.day];
              if (isNextMonth) {
                classNames.push(styles.dayOutsideOfMonth);
              }

              if (day === dayCounter && !isNextMonth) {
                classNames.push(styles.daySelected);
              }

              const nextMonth = month === 11 ? 0 : month + 1;
              const nextYear = year === 11 ? year + 1 : year;

              days.push(
                <div
                  key={index + "-" + dayCounter}
                  className={classNames.join(" ")}
                  data-testid={isNextMonth ? "day-outside-month" : undefined}
                  onClick={(e) =>
                    handleClick(
                      e,
                      dayCounter,
                      isNextMonth ? nextMonth : month,
                      isNextMonth ? nextYear : year,
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
  );
};
