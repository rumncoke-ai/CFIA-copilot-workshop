import { describe, expect, it } from "vitest";

import { calculateRisk } from "./risk";

describe("synthetic risk scoring", () => {
  it.each([
    ["low", 20, "Routine follow-up"],
    ["medium", 50, "Schedule follow-up inspection"],
    ["high", 80, "Prioritize immediate review"],
  ] as const)("scores %s severity", (severity, risk_score, follow_up_action) => {
    expect(calculateRisk(severity)).toEqual({ risk_score, follow_up_action });
  });
});
