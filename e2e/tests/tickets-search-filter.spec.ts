import { test, expect } from "@playwright/test";

test("Smoke test for fake-auth server", async ({ page }) => {
  await page.goto("http://localhost:3002");
  await page
    .getByRole("button", { name: /Request Access Token For Default User/i })
    .click();
  const pre = page.getByTestId("accesstoken");

  await expect(pre).not.toHaveText("");
  const accessToken = await pre.innerText();
  expect(accessToken).toContain("ey");
});

test("load projects should work", async ({ page }) => {
  await page.goto("http://localhost:3000/projects");

  await page
    .getByRole("main")
    .getByRole("button", { name: "Signin with Auth0" })
    .click();

  await page.getByRole("link", { name: "Projekte" }).click();

  await expect(
    page.getByRole("button", { name: "Neues Projekt anlegen" })
  ).toBeVisible();

  await expect(page.getByText("My First Project")).toBeVisible();
});
