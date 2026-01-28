import { test, expect } from "@playwright/test";

test("load tickets should work", async ({ page }) => {
  await page.goto("http://localhost:3000/tickets");

  await page.getByRole("link", { name: "Tickets" }).click();

  await expect(page.getByText("Demo Ticket").first()).toBeVisible();
});
