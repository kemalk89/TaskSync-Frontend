type Props = {
  date?: string | Date;
};

export const TextDate = ({ date }: Props) => {
  if (date === undefined) {
    return <span>unbekannt</span>;
  }

  const _date = typeof date === "string" ? new Date(date) : date;
  const formatted = new Intl.DateTimeFormat("de-DE", {
    timeStyle: "medium",
    dateStyle: "medium",
  }).format(_date);

  const displayedText = new Intl.DateTimeFormat("de-DE", {
    timeStyle: "short",
    dateStyle: "full",
  }).format(_date);

  return <span title={formatted}>{displayedText}</span>;
};
