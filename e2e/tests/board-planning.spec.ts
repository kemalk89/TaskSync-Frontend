import { test, expect, Locator } from "@playwright/test";

test("create new project and plan a board", async ({ page, request }) => {
  await page.goto("http://localhost:3000/projects");
  await page.getByRole("link", { name: "Projekte" }).click();

  await test.step("Create a test project", async () => {
    await page.getByRole("button", { name: "Neues Projekt anlegen" }).click();

    await page
      .getByRole("textbox", { name: "Titel *" })
      .fill("E2E Test Projekt");

    await page.getByRole("button", { name: "Speichern" }).click();
  });

  await test.step("Goto test project and select tab Backlog", async () => {
    await page.getByRole("heading", { name: "E2E Test Projekt" }).click();

    await page.getByRole("link", { name: "Backlog" }).click();

    await expect(
      page.getByText(
        "Tickets können per Drag&Drop in diesen Abschnitt gezogen werden",
      ),
    ).toBeVisible();
  });

  await test.step("Create 3 tickets in backlog via API", async () => {
    // Get projectId from URL
    const projectId = new URL(page.url()).pathname.split("/").pop();

    for (let i = 0; i < 3; i++) {
      const newTicket = await request.post(`/api/backend/ticket`, {
        data: {
          projectId,
          title: "E2E Test Ticket #" + (i + 1),
          type: "story",
        },
      });
      expect(newTicket.ok()).toBeTruthy();
    }

    await page.reload();

    await expect(page.getByText("E2E Test Ticket #1")).toBeVisible();
    await expect(page.getByText("E2E Test Ticket #2")).toBeVisible();
    await expect(page.getByText("E2E Test Ticket #3")).toBeVisible();
  });

  await test.step("Reorder tickets in backlog", async () => {
    const ticket1 = page.getByText("E2E Test Ticket #1");
    const ticket2 = page.getByText("E2E Test Ticket #2");
    const ticket3 = page.getByText("E2E Test Ticket #3");

    // ensure initial order
    await ensureOrder([ticket1, ticket2, ticket3]);

    // Drag 1st ticket to 1st dropable -> order should not change
    await page
      .getByTestId("draggable-ticket-0")
      .dragTo(page.locator("div[id='backlog'] .droppable").first());

    await ensureOrder([ticket1, ticket2, ticket3]);

    // Drag last ticket to last dropable -> order should not change
    await page
      .getByTestId("draggable-ticket-2")
      .dragTo(page.locator("div[id='backlog'] .droppable").last());

    await ensureOrder([ticket1, ticket2, ticket3]);

    // Drag 1st ticket to last dropable
    await page
      .getByTestId("draggable-ticket-0")
      .dragTo(page.locator("div[id='backlog'] .droppable").last());

    await ensureOrder([ticket2, ticket3, ticket1]);

    // Drag #2 ticket to first dropable
    await page
      .getByTestId("draggable-ticket-1")
      .dragTo(page.locator("div[id='backlog'] .droppable").first());

    await ensureOrder([ticket3, ticket2, ticket1]);
  });
  await test.step("Move tickets from backlog to draft board", async () => {});
  await test.step("Reorder tickets in draft board", async () => {});
  await test.step("Move tickets from draft board to backlog", async () => {});
});

async function ensureOrder(locators: Locator[]) {
  if (locators.length <= 1) {
    return;
  }

  for (let i = 0; i < locators.length; i++) {
    const locator1 = await locators.at(i)!.boundingBox();
    const y1 = locator1!.y;

    if (locators.at(i + 1) !== undefined) {
      const locator2 = await locators.at(i + 1)!.boundingBox();
      const y2 = locator2!.y;

      expect(y1).toBeLessThan(y2);
    }
  }

  const lastLocator = await locators.at(-1)!.boundingBox();
  const prevLocator = await locators.at(-2)!.boundingBox();
  expect(prevLocator!.y).toBeLessThan(lastLocator!.y);
}
