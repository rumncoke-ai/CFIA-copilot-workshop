import { useEffect, useState } from "react";

import { createFinding, getFindings, resetFindings } from "./findings";
import type { Finding, FindingCreate } from "./findings";
import FindingForm from "./FindingForm";

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unexpected data error.";
}

export default function App() {
  const [findings, setFindings] = useState<Finding[]>([]);
  const [latest, setLatest] = useState<Finding | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");

    getFindings(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setFindings(data);
      })
      .catch((cause: unknown) => {
        if (!controller.signal.aborted) {
          setError(`Could not load findings: ${errorMessage(cause)}`);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [refresh]);

  async function save(payload: FindingCreate): Promise<boolean> {
    setSaving(true);
    setError("");
    try {
      const created = await createFinding(payload);
      setFindings((current) => [...current, created]);
      setLatest(created);
      return true;
    } catch (cause: unknown) {
      setError(`Could not save finding: ${errorMessage(cause)}`);
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function reset(): Promise<void> {
    if (!window.confirm("Replace all saved workshop findings with the synthetic seed data?")) return;
    setSaving(true);
    setError("");
    try {
      const data = await resetFindings();
      setFindings(data);
      setLatest(null);
    } catch (cause: unknown) {
      setError(`Could not reset findings: ${errorMessage(cause)}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main>
      <h1>CFIA Inspection Findings Tracker</h1>
      <p>Local workshop only. Use synthetic data; scores are not official CFIA policy.</p>
      <p>Findings stay in this browser on this address. Reset demo data restores the synthetic example.</p>
      <button disabled={loading || saving} onClick={reset}>Reset demo data</button>
      {error && <p role="alert" className="error">{error}</p>}
      <FindingForm disabled={loading || saving} saving={saving} onSubmit={save} />

      {latest && (
        <section aria-label="Latest saved finding" role="status" className="result">
          <h2>Finding saved: {latest.facility_name}</h2>
          <p>Risk score: <strong>{latest.risk_score}</strong></p>
          <p>Follow-up: {latest.follow_up_action}</p>
        </section>
      )}

      <section aria-labelledby="findings-heading">
        <h2 id="findings-heading">Existing findings</h2>
        <button disabled={loading || saving} onClick={() => setRefresh((value) => value + 1)}>
          Refresh findings
        </button>
        {/* TODO workshop hardening: improve these text-only loading and empty states. */}
        {loading ? <p role="status">Loading findings...</p> : (
          findings.length === 0 ? <p>No findings yet.</p> : (
            <ul className="findings">
              {findings.map((finding, index) => (
                <li key={index}>
                  <h3>{finding.facility_name}</h3>
                  <p>Inspector: {finding.inspector_id} | Type: {finding.inspection_type}</p>
                  <p>Severity: {finding.severity} | Risk score: <strong>{finding.risk_score}</strong></p>
                  <p>Follow-up: {finding.follow_up_action}</p>
                  <p className="notes">{finding.notes}</p>
                </li>
              ))}
            </ul>
          )
        )}
      </section>
    </main>
  );
}
