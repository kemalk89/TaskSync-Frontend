import { parseDate } from "../parser";

describe("DatePicker", () => {
  it("should parse for locale 'tr'", () => {
    let date = parseDate("17.04.2026", "tr");
    expect(date!.getDate()).toBe(17);
    expect(date!.getMonth()).toBe(3);
    expect(date!.getFullYear()).toBe(2026);
  });

  it("should parse for locale 'de'", () => {
    let date = parseDate("17.04.2026", "de");
    expect(date!.getDate()).toBe(17);
    expect(date!.getMonth()).toBe(3);
    expect(date!.getFullYear()).toBe(2026);

    date = parseDate("7.5.2026", "de");
    expect(date!.getDate()).toBe(7);
    expect(date!.getMonth()).toBe(4);
    expect(date!.getFullYear()).toBe(2026);
  });

  it("should parse for locale 'en'", () => {
    const date = parseDate("17/04/2026", "en-GB");
    expect(date!.getDate()).toBe(17);
    expect(date!.getMonth()).toBe(3);
    expect(date!.getFullYear()).toBe(2026);
  });

  it("should parse for locale and region 'en-GB'", () => {
    const date = parseDate("17/04/2026", "en-GB");
    expect(date!.getDate()).toBe(17);
    expect(date!.getMonth()).toBe(3);
    expect(date!.getFullYear()).toBe(2026);
  });

  it("should parse for locale and region 'en-US'", () => {
    const date = parseDate("04/17/2026", "en-US");
    expect(date!.getDate()).toBe(17);
    expect(date!.getMonth()).toBe(3);
    expect(date!.getFullYear()).toBe(2026);
  });
});
