import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createFinding, FacilityNameError, getFindings, resetFindings, STORAGE_KEY } from "./findings";
import type { FindingCreate } from "./findings";
import seeds from "./seed-findings.json";

const payload: FindingCreate = {
  inspector_id: "INS-001",
  facility_name: "Demo Facility",
  inspection_type: "Routine",
  severity: "high",
  notes: "Synthetic finding: damaged storage seal.",
};
const expected = {
  ...payload,
  risk_score: 80,
  follow_up_action: "Prioritize immediate review",
};

beforeEach(() => localStorage.clear());
afterEach(() => vi.restoreAllMocks());

describe("local findings baseline", () => {
  it.each([
    ["  Demo Facility  ", "Demo Facility"],
    ["  Demo  Facility  ", "Demo  Facility"],
    ["  \u{1F642}  ", "\u{1F642}"],
  ])("normalizes facility %j without changing other fields", async (facility_name, normalized) => {
    const input = {
      ...payload, facility_name, inspector_id: " INS-001 ",
      inspection_type: " Routine ", notes: " Notes ",
    };
    const result = {
      ...input, facility_name: normalized,
      risk_score: 80, follow_up_action: "Prioritize immediate review",
    };
    expect(await createFinding(input)).toEqual(result);
    expect(await getFindings()).toEqual([...seeds, result]);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual([...seeds, result]);
  });

  it.each([false, true])("rejects an empty facility before storage access (initialized: %s)", async (initialized) => {
    if (initialized) await getFindings();
    const before = localStorage.getItem(STORAGE_KEY);
    const read = vi.spyOn(Storage.prototype, "getItem");
    const write = vi.spyOn(Storage.prototype, "setItem");
    await expect(createFinding({ ...payload, facility_name: "" })).rejects.toBeInstanceOf(FacilityNameError);
    expect(read).not.toHaveBeenCalled();
    expect(write).not.toHaveBeenCalled();
    expect(localStorage.getItem(STORAGE_KEY)).toBe(before);
  });

  it.each([null, undefined, 42])("preserves runtime rejection of a non-string facility: %s", async (facility_name) => {
    // @ts-expect-error Exercise invalid runtime input from an untyped caller.
    await expect(createFinding({ ...payload, facility_name })).rejects.toThrow("A finding requires");
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("initializes absent storage from seeds and persists them", async () => {
    expect(await getFindings()).toEqual(seeds);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual(seeds);
  });

  it("preserves an explicitly empty list", async () => {
    localStorage.setItem(STORAGE_KEY, "[]");
    expect(await getFindings()).toEqual([]);
  });

  it("creates and reads back a high finding in order, allowing duplicates", async () => {
    expect(await createFinding(payload)).toEqual(expected);
    await createFinding(payload);
    expect(await getFindings()).toEqual([...seeds, expected, expected]);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual([...seeds, expected, expected]);
  });

  it("reads persisted data after the module is reloaded", async () => {
    await createFinding(payload);
    vi.resetModules();
    const reloaded = await import("./findings");
    expect(await reloaded.getFindings()).toEqual([...seeds, expected]);
  });

  it("resets only workshop data and returns independent seed objects", async () => {
    localStorage.setItem("unrelated", "keep");
    await createFinding(payload);
    const reset = await resetFindings();
    expect(reset).toEqual(seeds);
    reset[0].facility_name = "Changed returned object";
    expect(await getFindings()).toEqual(seeds);
    expect(localStorage.getItem("unrelated")).toBe("keep");
  });

  it.each(["{broken", "{}", "[null]", '[{"severity":"critical"}]'])(
    "rejects corrupt saved data without replacing it: %s", async (saved) => {
      localStorage.setItem(STORAGE_KEY, saved);
      await expect(getFindings()).rejects.toThrow(/Reset demo data/);
      await expect(createFinding(payload)).rejects.toThrow(/Reset demo data/);
      expect(localStorage.getItem(STORAGE_KEY)).toBe(saved);
      expect(await resetFindings()).toEqual(seeds);
    },
  );

  it("reports unavailable storage", async () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new DOMException("Blocked", "SecurityError");
    });
    await expect(getFindings()).rejects.toThrow("Browser storage is unavailable");
  });

  it("does not report successful initialization, creation or reset when writing fails", async () => {
    const write = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Full", "QuotaExceededError");
    });
    await expect(getFindings()).rejects.toThrow("could not save");
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    write.mockRestore();
    await createFinding(payload);
    const before = localStorage.getItem(STORAGE_KEY);
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Full", "QuotaExceededError");
    });
    await expect(createFinding(payload)).rejects.toThrow("could not save");
    await expect(resetFindings()).rejects.toThrow("could not save");
    expect(localStorage.getItem(STORAGE_KEY)).toBe(before);
  });

  it("honors an aborted read without initializing storage", async () => {
    const controller = new AbortController();
    controller.abort();
    await expect(getFindings(controller.signal)).rejects.toMatchObject({ name: "AbortError" });
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });
});
