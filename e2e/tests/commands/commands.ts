import { expect, test, Page } from "@playwright/test";

export async function loginCommand(page: Page) {
  await page.getByRole("button", { name: "Login mit Auth0" }).click();
}

export async function selectDropdownOption(
  page: Page,
  { name, option }: { name: string; option: string },
) {
  await page.getByRole("button", { name }).click();
  await page.getByRole("button", { name: option }).click();
}

export async function createNewProject(page: Page, title: string) {
  await page.goto("http://localhost:3000/projects");
  await page.getByRole("link", { name: "Projects" }).click();

  await page.getByRole("button", { name: "Neues Projekt anlegen" }).click();

  await page.getByRole("textbox", { name: "Titel *" }).fill(title);

  await page.getByRole("button", { name: "Speichern" }).click();
}
