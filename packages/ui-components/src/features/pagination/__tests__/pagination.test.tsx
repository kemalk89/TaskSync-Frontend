import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Pagination } from "./../pagination";

describe("Pagination", () => {
  it("renders all pages", () => {
    const paged = { total: 70, pageSize: 10, pageNumber: 1 };
    const onPageSelected = jest.fn();
    render(<Pagination paged={paged} onPageSelected={onPageSelected} />);

    ["1", "2", "3", "4", "5", "6", "7"].forEach((text) => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });

    expect(screen.queryByText("...")).not.toBeInTheDocument();
  });

  it("renders 1, 2, 3, 4, 5, ..., 8", () => {
    const paged = { total: 80, pageSize: 10, pageNumber: 1 };
    const onPageSelected = jest.fn();
    render(<Pagination paged={paged} onPageSelected={onPageSelected} />);

    ["1", "2", "3", "4", "5", "8"].forEach((text) => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });

    expect(screen.getByText("...")).toBeInTheDocument();
  });

  it("renders 1, ..., 96, 97, 98, 99, 100", () => {
    const paged = { total: 1000, pageSize: 10, pageNumber: 98 };
    const onPageSelected = jest.fn();
    render(<Pagination paged={paged} onPageSelected={onPageSelected} />);

    ["1", "96", "97", "98", "99", "100"].forEach((text) => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });

    expect(screen.getByText("...")).toBeInTheDocument();
  });

  it("renders 1, ..., 4, 5, 6, ..., 8", () => {
    const paged = { total: 80, pageSize: 10, pageNumber: 5 };
    const onPageSelected = jest.fn();
    render(<Pagination paged={paged} onPageSelected={onPageSelected} />);

    ["1", "4", "5", "6", "8"].forEach((text) => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });

    expect(screen.queryByText("2")).not.toBeInTheDocument();
    expect(screen.queryByText("3")).not.toBeInTheDocument();
    expect(screen.queryByText("7")).not.toBeInTheDocument();

    expect(screen.getAllByText("...")).toHaveLength(2);
  });
});
