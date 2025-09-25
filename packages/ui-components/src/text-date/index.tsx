type Props = {
  date?: string | Date;
  mode?: "full" | "short";
};

/**
 * Mode full = Donnerstag, 25. September 2025 um 12:37
 * Mode short = 25.09.2025, 12:05:10
 */
export const TextDate = ({ date, mode = "full" }: Props) => {
  if (date === undefined) {
    return <span>unbekannt</span>;
  }

  const _date = typeof date === "string" ? new Date(date) : date;
  const formatted = new Intl.DateTimeFormat("de-DE", {
    timeStyle: "medium",
    dateStyle: "medium",
  }).format(_date);

  let displayedText = new Intl.DateTimeFormat("de-DE", {
    timeStyle: "short",
    dateStyle: "full",
  }).format(_date);

  if (mode === "short") {
    displayedText = formatted;
  }

  return <span title={formatted}>{displayedText}</span>;
};
