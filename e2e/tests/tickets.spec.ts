import { test, expect } from "@playwright/test";
import { loginCommand } from "./commands/commands";

test("load tickets should work", async ({ page }) => {
  await page.goto("http://localhost:3000/tickets");

  await loginCommand(page);

  await page.getByRole("link", { name: "Tickets" }).click();

  await expect(page.getByText("Demo Ticket").first()).toBeVisible();
});
