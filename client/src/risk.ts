import type { Finding, Severity } from "./findings";

// Synthetic training rules, not official CFIA inspection policy.
const riskRules = {
  low: { risk_score: 20, follow_up_action: "Routine follow-up" },
  medium: { risk_score: 50, follow_up_action: "Schedule follow-up inspection" },
  high: { risk_score: 80, follow_up_action: "Prioritize immediate review" },
} satisfies Record<Severity, Pick<Finding, "risk_score" | "follow_up_action">>;

export function calculateRisk(severity: Severity) {
  return { ...riskRules[severity] };
}
