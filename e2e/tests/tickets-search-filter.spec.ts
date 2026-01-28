import { test, expect } from "@playwright/test";
import { loginCommand, selectDropdownOption } from "./commands/commands";

test("Create tickets and filter tickets by assignees", async ({ page }) => {
  await page.goto("http://localhost:3000");

  await page.getByRole("link", { name: "Tickets" }).click();
  // Create new ticket for Deniz
  await page.getByRole("button", { name: "Ticket anlegen" }).click();

  await selectDropdownOption(page, {
    name: "Projekt auswählen",
    option: "My First Project",
  });
  await page
    .getByRole("textbox", { name: "Titel *" })
    .fill("E2E Test Ticket for Deniz");
  await selectDropdownOption(page, {
    name: "Dieses Ticket hat den Typ",
    option: "Story",
  });
  await selectDropdownOption(page, {
    name: "Um dieses Ticket kümmert sich",
    option: "Deniz",
  });
  await page.getByRole("button", { name: "Speichern" }).click();

  // Create new ticket for Kerem
  await page.getByRole("button", { name: "Ticket anlegen" }).click();

  await selectDropdownOption(page, {
    name: "Projekt auswählen",
    option: "My First Project",
  });
  await page
    .getByRole("textbox", { name: "Titel *" })
    .fill("E2E Test Ticket for Kerem");
  await selectDropdownOption(page, {
    name: "Dieses Ticket hat den Typ",
    option: "Bug",
  });
  await selectDropdownOption(page, {
    name: "Um dieses Ticket kümmert sich",
    option: "Kerem",
  });
  await page.getByRole("button", { name: "Speichern" }).click();

  // Now use filters to find the newly created ticket
  await selectDropdownOption(page, {
    name: "Bearbeiter",
    option: "Kerem",
  });
  await expect(page.getByText("E2E Test Ticket for Kerem")).toBeVisible();
  await expect(page.getByText("E2E Test Ticket for Deniz")).not.toBeVisible();

  await page.getByRole("button", { name: "Deniz" }).click();

  await expect(page.getByText("E2E Test Ticket for Deniz")).toBeVisible();
});
