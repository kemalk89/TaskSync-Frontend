import { test, expect } from "@playwright/test";

// Reset storage state to avoid being authenticated
test.use({ storageState: { cookies: [], origins: [] } });

test("accessing settings should be not possible without authentication", async ({
  page,
}) => {
  await page.goto("/settings");
  await expect(
    page.getByRole("button", { name: "Login", exact: true }),
  ).toBeVisible();
});

test.describe(() => {
  test.use({ storageState: "e2e/playwright/.auth/user.json" });

  test("language switch should work correctly", async ({ page }) => {
    await page.goto("/settings");

    await expect(page.getByRole("link", { name: "Projects" })).toBeVisible();

    let languageSelect = page.getByRole("button", { name: "English" });
    await expect(languageSelect).toBeVisible();
    await languageSelect.click();

    // Select English option
    const optionGerman = page.getByRole("button", { name: "Deutsch" });
    await expect(optionGerman).toBeVisible();
    await optionGerman.click();

    await expect(
      page.getByText("Die Sprache wurde erfolgreich geändert."),
    ).toBeVisible();

    await expect(page.getByRole("link", { name: "Projekte" })).toBeVisible();

    // switch back to english
    languageSelect = page.getByRole("button", { name: "Deutsch" });
    await languageSelect.click();
    const optionEnglish = page.getByRole("button", { name: "English" });
    await optionEnglish.click();

    await expect(page.getByRole("link", { name: "Projects" })).toBeVisible();
  });
});
