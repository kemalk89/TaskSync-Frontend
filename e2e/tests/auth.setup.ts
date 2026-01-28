import { test as setup, expect } from "@playwright/test";
import path from "path";
import { loginCommand } from "./commands/commands";

const authFile = path.join(__dirname, "../playwright/.auth/user.json");

setup("authenticate", async ({ page }) => {
  await page.goto("http://localhost:3000");

  await loginCommand(page);
  await expect(
    page.getByRole("button", { name: "Ticket anlegen" }),
  ).toBeVisible();

  await page.context().storageState({ path: authFile });
});
