import { test, expect } from "@playwright/test";

const URL_DEV_SERVER = "http://localhost:5173";
const DATA_TEST_ID_EDITOR = "editor";

test.describe("JatEditor", () => {
  test("User enters text. Expect text is visible.", async ({ page }) => {
    await page.goto(URL_DEV_SERVER);
    const editor = page.getByTestId(DATA_TEST_ID_EDITOR);
    await editor.pressSequentially("Hello world!");
    await expect(editor).toHaveText("Hello world!");
  });

  test("User enters text, presses Enter, enters another text. Expect two <p> blocks containing the texts.", async ({
    page,
  }) => {
    await page.goto(URL_DEV_SERVER);
    const editor = page.getByTestId(DATA_TEST_ID_EDITOR);
    await editor.pressSequentially("First line");
    await editor.press("Enter");
    await editor.pressSequentially("Second line");

    const paragraphs = editor.locator("p");
    await expect(paragraphs).toHaveCount(2);
    await expect(paragraphs.nth(0)).toHaveText("First line");
    await expect(paragraphs.nth(1)).toHaveText("Second line");
  });

  test("User enters text and formats it Bold.", async ({ page }) => {
    await page.goto(URL_DEV_SERVER);
    const editor = page.getByTestId(DATA_TEST_ID_EDITOR);
    await editor.pressSequentially("BoldMe");
    // Select all text
    await page.evaluate(() => {
      const editorEl = document.querySelector(`[data-testid="editor"]`);

      // Find the first text node inside the editor
      const walker = document.createTreeWalker(editorEl!, NodeFilter.SHOW_TEXT);
      const textNode = walker.nextNode();
      if (!textNode) return;

      const range = document.createRange();
      range.selectNodeContents(textNode);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    });
    // Click bold button
    await page.getByRole("button", { name: "B" }).click();
    // Expect <strong> in the editor
    const strong = editor.locator("strong");
    await expect(strong).toHaveText("BoldMe");
  });

  test("User enters text. New line, again text. Now user selects parts of both lines and formats it Bold.", async ({
    page,
  }) => {
    await page.goto(URL_DEV_SERVER);
    const editor = page.getByTestId(DATA_TEST_ID_EDITOR);
    await editor.pressSequentially("First");
    await editor.press("Enter");
    await editor.pressSequentially("Second");
    // Select from "st" in "First" to "Sec" in "Second"
    await page.evaluate(() => {
      const ps = document.querySelectorAll('[data-testid="editor"] p');

      const firstP = ps[0].firstChild;
      const secondP = ps[1].firstChild;

      const range = document.createRange();
      range.setStart(firstP!, 3); // "st" in "First"
      range.setEnd(secondP!, 3); // "Sec" in "Second"

      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    });
    // Click bold button
    await page.getByRole("button", { name: "B" }).click();

    // Expect <strong> wrapping the selected text across both lines
    const strongs = editor.locator("strong");
    await expect(strongs.first()).toContainText("st");
    await expect(strongs.last()).toContainText("Sec");
  });

  test("User puts caret in a line and formats as bullet list", async ({
    page,
  }) => {
    await page.goto(URL_DEV_SERVER);
    const editor = page.getByTestId(DATA_TEST_ID_EDITOR);

    // Type a line
    await editor.pressSequentially("Single line");

    // Place caret in the line (simulate click)
    await editor.click();

    // Click bullet list button
    await page.getByRole("button", { name: "UL" }).click();

    await editor.press("Enter");
    await editor.pressSequentially("Second line");

    // Expect a <ul> with 2 <li> containing the text
    const ul = editor.locator("ul");
    await expect(ul).toBeVisible();
    const lis = ul.locator("li");
    await expect(lis).toHaveCount(2);
    await expect(lis.nth(0)).toHaveText("Single line");
    await expect(lis.nth(1)).toHaveText("Second line");
  });
});
