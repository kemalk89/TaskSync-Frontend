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
