import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { DatePicker } from "../DatePicker";

describe("DatePicker", () => {
  const mockDictionaryMonths = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  it("should render the label", () => {
    render(
      <DatePicker
        placeholder="Select Date"
        dictionaryMonths={mockDictionaryMonths}
        month={4}
        year={2026}
      />,
    );

    expect(screen.getByPlaceholderText("Select Date")).toBeInTheDocument();
  });

  it("should not render the calendar dialog by default", () => {
    render(
      <DatePicker
        placeholder="Select Date"
        dictionaryMonths={mockDictionaryMonths}
        month={4}
        year={2026}
      />,
    );

    expect(screen.queryByText("Mo")).not.toBeInTheDocument();
  });

  it("should open the calendar when the label button is clicked", () => {
    render(
      <DatePicker
        placeholder="Select Date"
        dictionaryMonths={mockDictionaryMonths}
        month={4}
        year={2026}
      />,
    );

    fireEvent.click(screen.getByPlaceholderText("Select Date"));

    expect(screen.getByText("Mo")).toBeInTheDocument();
    expect(screen.getByText("Tu")).toBeInTheDocument();
    expect(screen.getByText("We")).toBeInTheDocument();
    expect(screen.getByText("Th")).toBeInTheDocument();
    expect(screen.getByText("Fr")).toBeInTheDocument();
    expect(screen.getByText("Sa")).toBeInTheDocument();
    expect(screen.getByText("Su")).toBeInTheDocument();
  });

  it("should close the calendar when the close button is clicked", () => {
    render(
      <DatePicker
        placeholder="Select Date"
        dictionaryMonths={mockDictionaryMonths}
        month={4}
        year={2026}
      />,
    );

    fireEvent.click(screen.getByPlaceholderText("Select Date"));
    expect(screen.getByText("Mo")).toBeInTheDocument();

    const closeBtn = screen.getByRole("button", { name: "" });
    fireEvent.click(closeBtn);
    expect(screen.queryByText("Mo")).not.toBeInTheDocument();
  });

  it("should re-open the calendar after closing", () => {
    render(
      <DatePicker
        placeholder="Select Date"
        dictionaryMonths={mockDictionaryMonths}
        month={4}
        year={2026}
      />,
    );

    fireEvent.click(screen.getByPlaceholderText("Select Date"));
    expect(screen.getByText("Mo")).toBeInTheDocument();

    const closeBtn = screen.getByRole("button", { name: "" });
    fireEvent.click(closeBtn);
    expect(screen.queryByText("Mo")).not.toBeInTheDocument();

    fireEvent.click(screen.getByPlaceholderText("Select Date"));
    expect(screen.getByText("Mo")).toBeInTheDocument();
  });

  it("should render other month days with a different color style", () => {
    render(
      <DatePicker
        placeholder="Select Date"
        dictionaryMonths={mockDictionaryMonths}
        month={4}
        year={2026}
      />,
    );

    fireEvent.click(screen.getByPlaceholderText("Select Date"));

    const grayDayElements = screen.getAllByTestId("day-outside-month");
    expect(grayDayElements.length).toBeGreaterThan(0);

    const grayTexts = Array.from(grayDayElements).map((el) => el.textContent);
    // In May 2026, first row has April 27,28,29,30 and last row has June 1-7
    expect(grayTexts.some((t) => t === "27")).toBe(true);
    expect(grayTexts.some((t) => t === "30")).toBe(true);
    expect(grayTexts.some((t) => t === "31")).toBe(false);
    expect(grayTexts.some((t) => t === "7")).toBe(true);
    expect(grayTexts.some((t) => t === "8")).toBe(false);
  });

  it("should render the calendar for June 2026 with correct first row", () => {
    render(
      <DatePicker
        placeholder="Pick a Day"
        dictionaryMonths={mockDictionaryMonths}
        month={5}
        year={2026}
      />,
    );

    fireEvent.click(screen.getByPlaceholderText("Pick a Day"));

    // June 1, 2026 is a Monday, so the first row should be:
    // Mo(1), Tu(2), We(3), Th(4), Fr(5), Sa(6), Su(7)
    const rows = screen.getAllByTestId("calendar-row");
    const firstRow = rows[0];
    const firstRowTexts = Array.from(firstRow!.children).map(
      (el) => el.textContent,
    );

    expect(firstRowTexts).toEqual(["1", "2", "3", "4", "5", "6", "7"]);
  });

  it("should render the calendar for a leap year February 2024", () => {
    render(
      <DatePicker
        placeholder="Pick a Day"
        dictionaryMonths={mockDictionaryMonths}
        month={1}
        year={2024}
      />,
    );

    fireEvent.click(screen.getByPlaceholderText("Pick a Day"));

    // February 2024 is a leap year with 29 days
    // Row 1: Jan 29, 30, 31 + Feb 1, 2, 3, 4
    const rows = screen.getAllByTestId("calendar-row");
    const firstRow = rows[0];
    const firstRowTexts = Array.from(firstRow!.children).map(
      (el) => el.textContent,
    );

    expect(firstRowTexts).toEqual(["29", "30", "31", "1", "2", "3", "4"]);

    // Verify the last row
    const lastRow = rows[rows.length - 1];
    const lastRowTexts = Array.from(lastRow!.children).map(
      (el) => el.textContent,
    );
    expect(lastRowTexts).toEqual(["4", "5", "6", "7", "8", "9", "10"]);
  });

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Test event handlers
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////
  it("should update month dropdown selection when onChange is triggered", () => {
    render(
      <DatePicker
        placeholder="Select Date"
        dictionaryMonths={mockDictionaryMonths}
        month={0}
        year={2026}
      />,
    );

    fireEvent.click(screen.getByPlaceholderText("Select Date"));

    const selects = screen.getAllByRole("combobox");
    const monthSelect = selects[0];
    fireEvent.change(monthSelect!, { target: { value: "11" } });

    expect(monthSelect).toHaveValue("11");
  });

  it("should update year dropdown selection when onChange is triggered", () => {
    const currentYear = new Date().getFullYear();

    render(
      <DatePicker
        placeholder="Select Date"
        dictionaryMonths={mockDictionaryMonths}
        month={0}
        year={currentYear}
      />,
    );

    fireEvent.click(screen.getByPlaceholderText("Select Date"));

    const selects = screen.getAllByRole("combobox");
    const yearSelect = selects[1];
    fireEvent.change(yearSelect!, {
      target: { value: currentYear + 1 },
    });

    expect(yearSelect).toHaveValue(String(currentYear + 1));
  });

  it("should call onSelect with the correct date when a day is clicked", () => {
    const mockOnSelect = jest.fn();

    render(
      <DatePicker
        placeholder="Select Date"
        dictionaryMonths={mockDictionaryMonths}
        onSelect={mockOnSelect}
        month={4}
        year={2026}
      />,
    );

    fireEvent.click(screen.getByPlaceholderText("Select Date"));

    const dayElement = screen.getByText("15");
    fireEvent.click(dayElement);

    expect(mockOnSelect).toHaveBeenCalledTimes(1);
    expect(mockOnSelect).toHaveBeenCalledWith(new Date(2026, 4, 15));
  });

  it("should close the calendar when ESC key is pressed", () => {
    render(
      <DatePicker
        placeholder="Select Date"
        dictionaryMonths={mockDictionaryMonths}
        month={4}
        year={2026}
      />,
    );

    fireEvent.click(screen.getByPlaceholderText("Select Date"));
    expect(screen.getByText("Mo")).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape", code: "Escape" });
    expect(screen.queryByText("Mo")).not.toBeInTheDocument();
  });

  it("should call onSelect with the correct date for a next-month day number", () => {
    const mockOnSelect = jest.fn();
    render(
      <DatePicker
        placeholder="Select Date"
        dictionaryMonths={mockDictionaryMonths}
        onSelect={mockOnSelect}
        month={4} // May
        year={2026}
      />,
    );

    fireEvent.click(screen.getByPlaceholderText("Select Date"));

    const grayDayElements = screen.getAllByTestId("day-outside-month");
    const nextMonthDay = grayDayElements[grayDayElements.length - 1];
    fireEvent.click(nextMonthDay!);

    expect(mockOnSelect).toHaveBeenCalledWith(
      new Date(2026, 5, Number(nextMonthDay!.textContent)),
    );
  });
});
