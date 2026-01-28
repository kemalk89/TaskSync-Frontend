import { test, expect } from "@playwright/test";
import { loginCommand } from "./commands/commands";

// Reset storage state to avoid being authenticated
test.use({ storageState: { cookies: [], origins: [] } });

test("accessing projects should be not possible", async ({ page }) => {
  await page.goto("http://localhost:3000/projects");
  await expect(
    page.getByRole("main").getByRole("button", { name: "Signin with Auth0" }),
  ).toBeVisible();
});

test.describe(() => {
  test.use({ storageState: "e2e/playwright/.auth/user.json" });

  test("load projects should work", async ({ page }) => {
    await page.goto("http://localhost:3000");

    await page.getByRole("link", { name: "Projekte" }).click();

    await expect(
      page.getByRole("button", { name: "Neues Projekt anlegen" }),
    ).toBeVisible();
  });
});
