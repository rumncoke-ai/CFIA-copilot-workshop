import { expect, test } from "@playwright/test";

test("baseline valid save survives a real page reload and confirmed reset", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Synthetic Seed Facility", exact: true })).toBeVisible();
  await page.getByLabel("Inspector ID", { exact: true }).fill("INS-BROWSER");
  await page.getByLabel("Facility name", { exact: true }).fill("  Browser Demo Facility  ");
  await page.getByLabel("Inspection type", { exact: true }).fill("Routine");
  await page.getByRole("combobox", { name: /Severity/ }).selectOption("high");
  await page.getByLabel("Notes", { exact: true }).fill("Synthetic browser baseline.");
  await page.getByRole("button", { name: "Save finding", exact: true }).click();

  const saved = page.getByRole("status", { name: "Latest saved finding" });
  await expect(saved.getByRole("heading")).toHaveText("Finding saved: Browser Demo Facility");
  await expect(saved).toContainText("Risk score: 80");
  await expect(saved).toContainText("Follow-up: Prioritize immediate review");
  await expect(page.getByLabel("Facility name", { exact: true })).toHaveValue("");
  await page.reload();

  const findings = page.getByRole("region", { name: "Existing findings" });
  await expect(findings.getByRole("heading", { name: "Browser Demo Facility", exact: true })).toBeVisible();
  page.once("dialog", (dialog) => dialog.dismiss());
  await page.getByRole("button", { name: "Reset demo data", exact: true }).click();
  await expect(findings.getByRole("heading", { name: "Browser Demo Facility", exact: true })).toBeVisible();
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Reset demo data", exact: true }).click();
  await expect(findings.getByRole("heading", { name: "Browser Demo Facility", exact: true })).toHaveCount(0);
  await expect(findings.getByRole("heading", { name: "Synthetic Seed Facility", exact: true })).toBeVisible();
});
