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

function isFindingCreate(value: unknown): value is FindingCreate {
  return (
    typeof value === "object" &&
    value !== null &&
    "inspector_id" in value && typeof value.inspector_id === "string" &&
    "facility_name" in value && typeof value.facility_name === "string" &&
    "inspection_type" in value && typeof value.inspection_type === "string" &&
    "severity" in value && isSeverity(value.severity) &&
    "notes" in value && typeof value.notes === "string"
  );
}

function isFinding(value: unknown): value is Finding {
  return (
    isFindingCreate(value) &&
    "risk_score" in value && typeof value.risk_score === "number" &&
    Number.isFinite(value.risk_score) &&
    "follow_up_action" in value && typeof value.follow_up_action === "string"
  );
}

export const STORAGE_KEY = "cfia-workshop.findings.v1";

function parseFindings(data: unknown): Finding[] {
  if (!Array.isArray(data) || !data.every(isFinding)) {
    throw new Error("Saved findings have an invalid format. Use Reset demo data to recover.");
  }
  return data;
}

function writeFindings(findings: Finding[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(findings));
  } catch (cause) {
    throw new Error("Browser storage could not save findings. Check storage permissions or available space and retry.", { cause });
  }
}

export async function getFindings(signal?: AbortSignal): Promise<Finding[]> {
  signal?.throwIfAborted();
  let saved: string | null;
  try {
    saved = localStorage.getItem(STORAGE_KEY);
  } catch (cause) {
    throw new Error("Browser storage is unavailable. Check storage permissions and retry.", { cause });
  }
  if (saved === null) {
    const findings = parseFindings(structuredClone(seedFindings));
    writeFindings(findings);
    return findings;
  }
  let data: unknown;
  try {
    data = JSON.parse(saved);
  } catch (cause) {
    throw new Error("Saved findings are not valid JSON. Use Reset demo data to recover.", { cause });
  }
  return parseFindings(data);
}

export async function createFinding(payload: FindingCreate): Promise<Finding> {
  if (!isFindingCreate(payload)) {
    throw new Error("A finding requires five text fields and a low, medium, or high severity.");
  }
  // TODO workshop hardening: trim/limit text, reject unknown fields, and return field errors.
  const { inspector_id, facility_name, inspection_type, severity, notes } = payload;
  const finding: Finding = {
    inspector_id, facility_name, inspection_type, severity, notes,
    ...calculateRisk(severity),
  };
  const findings = await getFindings();
  writeFindings([...findings, finding]);
  return finding;
}

export async function resetFindings(): Promise<Finding[]> {
  const findings = parseFindings(structuredClone(seedFindings));
  writeFindings(findings);
  return findings;
}
import seedFindings from "./seed-findings.json";
import { calculateRisk } from "./risk";
