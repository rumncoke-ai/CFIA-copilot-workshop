import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import App from "./App";
import * as findingsService from "./findings";
import { FacilityNameError, STORAGE_KEY } from "./findings";
import FindingForm from "./FindingForm";
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

it("displays and persists the normalized facility from the real service", async () => {
  render(<App />);
  await screen.findByText("Synthetic Seed Facility");
  const user = await enterFinding();
  const facility = screen.getByLabelText<HTMLInputElement>("Facility name");
  await user.clear(facility);
  await user.type(facility, "  Demo  Facility  ");
  await user.click(screen.getByRole("button", { name: "Save finding" }));
  expect((await screen.findByRole("status")).textContent).toContain("Finding saved: Demo  Facility");
  expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).at(-1).facility_name).toBe("Demo  Facility");
});

it("associates facility feedback, retains inputs and supports keyboard correction", async () => {
  const submit = vi.fn().mockResolvedValue(false);
  const changed = vi.fn();
  const view = render(<FindingForm disabled={false} saving={false}
    facilityError="" onFacilityChange={changed} onSubmit={submit} />);
  const user = await enterFinding();
  await user.click(screen.getByRole("button", { name: "Save finding" }));
  view.rerender(<FindingForm disabled={false} saving={false}
    facilityError={new FacilityNameError().message} onFacilityChange={changed} onSubmit={submit} />);
  const facility = screen.getByLabelText<HTMLInputElement>("Facility name");
  expect(facility.value).toBe("Demo Facility");
  expect(facility.getAttribute("aria-invalid")).toBe("true");
  expect(facility.getAttribute("aria-describedby")).toBe(screen.getByRole("alert").id);
  expect(screen.getByRole("alert").textContent).toBe("Enter a facility name.");
  await user.click(screen.getByLabelText("Inspector ID"));
  await user.tab();
  expect(document.activeElement).toBe(facility);
  await user.keyboard(" corrected");
  expect(changed).toHaveBeenCalled();
  view.rerender(<FindingForm disabled={false} saving={false}
    facilityError="" onFacilityChange={changed} onSubmit={submit} />);
  expect(facility.hasAttribute("aria-invalid")).toBe(false);
  expect(screen.queryByRole("alert")).toBeNull();
  submit.mockResolvedValue(true);
  await user.click(screen.getByRole("button", { name: "Save finding" }));
  expect(facility.value).toBe("");
});

it("routes a typed service field error separately and retries through the real service", async () => {
  render(<App />);
  await screen.findByText("Synthetic Seed Facility");
  const user = await enterFinding();
  const before = localStorage.getItem(STORAGE_KEY);
  vi.spyOn(findingsService, "createFinding").mockRejectedValueOnce(new FacilityNameError());
  await user.click(screen.getByRole("button", { name: "Save finding" }));
  const feedback = await screen.findByRole("alert");
  const facility = screen.getByLabelText<HTMLInputElement>("Facility name");
  expect(feedback.textContent).toBe("Enter a facility name.");
  expect(facility.getAttribute("aria-describedby")).toBe(feedback.id);
  expect(facility.getAttribute("aria-invalid")).toBe("true");
  expect(facility.value).toBe("Demo Facility");
  expect(screen.getByLabelText<HTMLInputElement>("Inspector ID").value).toBe("INS-001");
  expect(screen.getByLabelText<HTMLInputElement>("Inspection type").value).toBe("Routine");
  expect(screen.getByLabelText<HTMLSelectElement>("Severity").value).toBe("high");
  expect(screen.getByLabelText<HTMLTextAreaElement>("Notes").value).toBe("Synthetic finding: damaged storage seal.");
  expect(screen.queryByRole("status")).toBeNull();
  expect(localStorage.getItem(STORAGE_KEY)).toBe(before);
  await user.click(facility);
  await user.keyboard(" corrected");
  expect(screen.queryByRole("alert")).toBeNull();
  await user.click(screen.getByRole("button", { name: "Save finding" }));
  expect((await screen.findByRole("status")).textContent).toContain("Demo Facility corrected");
  expect(facility.value).toBe("");
  expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toHaveLength(seeds.length + 1);
});

it("does not leave an earlier success visible when a later save fails", async () => {
  render(<App />);
  await screen.findByText("Synthetic Seed Facility");
  const user = await enterFinding();
  await user.click(screen.getByRole("button", { name: "Save finding" }));
  await screen.findByRole("status");
  await enterFinding();
  const before = localStorage.getItem(STORAGE_KEY);
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw new DOMException("Full", "QuotaExceededError");
  });
  await user.click(screen.getByRole("button", { name: "Save finding" }));
  await screen.findByRole("alert");
  expect(screen.queryByRole("status")).toBeNull();
  expect(localStorage.getItem(STORAGE_KEY)).toBe(before);
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
