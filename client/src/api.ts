export type Severity = "low" | "medium" | "high";

export interface FindingCreate {
  inspector_id: string;
  facility_name: string;
  inspection_type: string;
  severity: Severity;
  notes: string;
}

export interface Finding extends FindingCreate {
  risk_score: number;
  follow_up_action: string;
}

export function isSeverity(value: unknown): value is Severity {
  return value === "low" || value === "medium" || value === "high";
}

function isFinding(value: unknown): value is Finding {
  return (
    typeof value === "object" &&
    value !== null &&
    "inspector_id" in value && typeof value.inspector_id === "string" &&
    "facility_name" in value && typeof value.facility_name === "string" &&
    "inspection_type" in value && typeof value.inspection_type === "string" &&
    "severity" in value && isSeverity(value.severity) &&
    "notes" in value && typeof value.notes === "string" &&
    "risk_score" in value && typeof value.risk_score === "number" &&
    Number.isFinite(value.risk_score) &&
    "follow_up_action" in value && typeof value.follow_up_action === "string"
  );
}

async function request(options?: RequestInit): Promise<unknown> {
  const response = await fetch("/findings", options);
  if (!response.ok) {
    // TODO workshop hardening: translate API validation details into field errors.
    throw new Error(`API request failed (HTTP ${response.status}).`);
  }
  return response.json();
}

export async function getFindings(signal?: AbortSignal): Promise<Finding[]> {
  const data = await request({ signal });
  if (!Array.isArray(data) || !data.every(isFinding)) {
    throw new Error("API returned an invalid findings list.");
  }
  return data;
}

export async function createFinding(payload: FindingCreate): Promise<Finding> {
  const data = await request({
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!isFinding(data)) {
    throw new Error("API returned an invalid finding.");
  }
  return data;
}
