import { test, expect } from "@playwright/test";
import { randomUUID } from "crypto";

test("Register and login with local-auth", async ({ page }) => {
  const username = "e2e-user-" + randomUUID();
  const password = "e2e-user-pw";

  await page.goto("http://localhost:3000");
  await page.getByRole("button", { name: "Test User" }).click();
  await page.getByRole("button", { name: "Sign Out" }).click();

  // Register e2e user
  await page.getByRole("link", { name: "Create a new account" }).click();
  await expect(
    page.getByRole("heading", { name: "Registrierung" }),
  ).toBeVisible();
  await page.getByRole("textbox", { name: "E-Mail" }).fill(username);
  await page.getByRole("textbox", { name: "Password" }).fill(password);
  await page.getByRole("button", { name: "Registrieren" }).click();
  await expect(page.getByText("Registrierung erfolgreich.")).toBeVisible();

  // Try login with e2e user using wrong pw
  await page.getByRole("link", { name: "Login" }).click();
  await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();
  await page.locator("#email").fill(username);
  await page.getByRole("textbox", { name: "Password" }).fill("wrong-pw");
  await page.getByRole("button", { name: "Login", exact: true }).click();
  await expect(
    page.getByText("Die eingegebenen Zugangsdaten sind leider nicht korrekt"),
  ).toBeVisible();

  // Try login again with correct credentials
  await page.locator("#email").fill(username);
  await page.getByRole("textbox", { name: "Password" }).fill(password);
  await page.getByRole("button", { name: "Login", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Login" })).not.toBeVisible();
});
