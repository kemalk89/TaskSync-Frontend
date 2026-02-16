import { Page } from "@playwright/test";

export async function loginCommand(page: Page) {
  await page.getByRole("main").getByRole("link", { name: "Sign In" }).click();
  await page.getByRole("button", { name: "Sign in with Auth0" }).click();
}

export async function selectDropdownOption(
  page: Page,
  { name, option }: { name: string; option: string },
) {
  await page.getByRole("button", { name }).click();
  await page.getByRole("button", { name: option }).click();
}
