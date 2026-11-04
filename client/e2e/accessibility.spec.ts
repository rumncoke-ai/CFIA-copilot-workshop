import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("baseline loaded page has no detected violations in the selected WCAG rules", async ({ page }, testInfo) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Synthetic Seed Facility", exact: true })).toBeVisible();
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();

  await testInfo.attach("axe-results", {
    body: JSON.stringify(results, null, 2),
    contentType: "application/json",
  });
  expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
});
