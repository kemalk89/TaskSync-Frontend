import { test, expect } from "@playwright/test";
import { loginCommand } from "./commands/commands";

test("accessing projects should be not possible", async ({ page }) => {
  await page.goto("http://localhost:3000/projects");
  await expect(
    page.getByRole("main").getByRole("button", { name: "Signin with Auth0" })
  ).toBeVisible();
});

test("load projects should work", async ({ page }) => {
  await page.goto("http://localhost:3000");

  await loginCommand(page);

  await page.getByRole("link", { name: "Projekte" }).click();

  await expect(
    page.getByRole("button", { name: "Neues Projekt anlegen" })
  ).toBeVisible();
});
