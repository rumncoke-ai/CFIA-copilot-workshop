import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import App from "./App";
import { STORAGE_KEY } from "./findings";
import seeds from "./seed-findings.json";

beforeEach(() => localStorage.clear());
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

async function enterFinding() {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("Inspector ID"), "INS-001");
  await user.type(screen.getByLabelText("Facility name"), "Demo Facility");
  await user.type(screen.getByLabelText("Inspection type"), "Routine");
  await user.selectOptions(screen.getByLabelText("Severity"), "high");
  await user.type(screen.getByLabelText("Notes"), "Synthetic finding: damaged storage seal.");
  return user;
}

it("saves through the real form/service, refreshes and survives remount", async () => {
  const view = render(<App />);
  await screen.findByText("Synthetic Seed Facility");
  const user = await enterFinding();
  await user.click(screen.getByRole("button", { name: "Save finding" }));
  const status = await screen.findByRole("status");
  expect(within(status).getByText("80").textContent).toBe("80");
  expect(within(status).getByText("Follow-up: Prioritize immediate review")).toBeTruthy();
  expect(screen.getByLabelText<HTMLInputElement>("Facility name").value).toBe("");
  expect(within(screen.getByRole("region", { name: "Existing findings" })).getByText("Demo Facility")).toBeTruthy();
  await user.click(screen.getByRole("button", { name: "Refresh findings" }));
  await waitFor(() => expect(screen.queryByText("Loading findings...")).toBeNull());
  view.unmount();
  render(<App />);
  await screen.findByText("Demo Facility");
  expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toHaveLength(seeds.length + 1);
});

it("cancels reset without changing data, then confirms reset and clears confirmation", async () => {
  render(<App />);
  await screen.findByText("Synthetic Seed Facility");
  const user = await enterFinding();
  await user.click(screen.getByRole("button", { name: "Save finding" }));
  await screen.findByRole("status");
  const before = localStorage.getItem(STORAGE_KEY);
  const confirm = vi.spyOn(window, "confirm").mockReturnValue(false);
  await user.click(screen.getByRole("button", { name: "Reset demo data" }));
  expect(localStorage.getItem(STORAGE_KEY)).toBe(before);
  confirm.mockReturnValue(true);
  await user.click(screen.getByRole("button", { name: "Reset demo data" }));
  await waitFor(() => expect(screen.queryByRole("status")).toBeNull());
  expect(screen.queryByText("Demo Facility")).toBeNull();
  expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual(seeds);
});

it("surfaces malformed storage and recovers only after an explicit reset", async () => {
  localStorage.setItem(STORAGE_KEY, "{broken");
  render(<App />);
  expect((await screen.findByRole("alert")).textContent).toContain("not valid JSON");
  expect(localStorage.getItem(STORAGE_KEY)).toBe("{broken");
  vi.spyOn(window, "confirm").mockReturnValue(true);
  await userEvent.click(screen.getByRole("button", { name: "Reset demo data" }));
  await screen.findByText("Synthetic Seed Facility");
  expect(screen.queryByRole("alert")).toBeNull();
});

it("retains form values and list after a failed save, then allows retry", async () => {
  render(<App />);
  await screen.findByText("Synthetic Seed Facility");
  const user = await enterFinding();
  const write = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw new DOMException("Full", "QuotaExceededError");
  });
  await user.click(screen.getByRole("button", { name: "Save finding" }));
  expect((await screen.findByRole("alert")).textContent).toContain("Could not save finding");
  expect(screen.getByLabelText<HTMLInputElement>("Facility name").value).toBe("Demo Facility");
  expect(screen.queryByRole("status")).toBeNull();
  expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual(seeds);
  write.mockRestore();
  await user.click(screen.getByRole("button", { name: "Save finding" }));
  await screen.findByRole("status");
});

it("retains the saved confirmation and data after a failed reset", async () => {
  render(<App />);
  await screen.findByText("Synthetic Seed Facility");
  const user = await enterFinding();
  await user.click(screen.getByRole("button", { name: "Save finding" }));
  await screen.findByRole("status");
  const before = localStorage.getItem(STORAGE_KEY);
  vi.spyOn(window, "confirm").mockReturnValue(true);
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw new DOMException("Blocked", "SecurityError");
  });
  await user.click(screen.getByRole("button", { name: "Reset demo data" }));
  expect((await screen.findByRole("alert")).textContent).toContain("Could not reset findings");
  expect(screen.getByRole("status")).toBeTruthy();
  expect(localStorage.getItem(STORAGE_KEY)).toBe(before);
});
