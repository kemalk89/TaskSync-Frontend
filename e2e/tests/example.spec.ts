import { test, expect } from "@playwright/test";

test("accessing projects should be not possible", async ({ page }) => {
  await page.goto("http://localhost:3000/projects");
  await expect(
    page.getByRole("main").getByRole("button", { name: "Signin with Auth0" })
  ).toBeVisible();
});

test("load projects should work", async ({ page }) => {
  await page.goto("http://localhost:3002");
  await page.getByRole("button", { name: /request access token/i }).click();
  const pre = page.getByTestId("accesstoken");

  await expect(pre).not.toHaveText("");
  const accessToken = await pre.innerText();
  expect(accessToken).toContain("ey");
});
