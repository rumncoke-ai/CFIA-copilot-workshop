import { useState } from "react";
import type { FormEvent } from "react";

import { isSeverity } from "./findings";
import type { FindingCreate } from "./findings";

interface Props {
  disabled: boolean;
  saving: boolean;
  facilityError: string;
  onFacilityChange: () => void;
  onSubmit: (finding: FindingCreate) => Promise<boolean>;
}

const initialFinding: FindingCreate = {
  inspector_id: "",
  facility_name: "",
  inspection_type: "",
  severity: "low",
  notes: "",
};

export default function FindingForm({ disabled, saving, facilityError, onFacilityChange, onSubmit }: Props) {
  const [finding, setFinding] = useState<FindingCreate>(initialFinding);

  function update<K extends keyof FindingCreate>(field: K, value: FindingCreate[K]) {
    setFinding((current) => ({ ...current, [field]: value }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (disabled) return;
    if (await onSubmit(finding)) {
      setFinding(initialFinding);
    }
  }

  return (
    <form onSubmit={submit}>
      <h2>Log a finding</h2>
      <fieldset disabled={disabled}>
        <legend>Finding details</legend>
        <label>
          Inspector ID
          <input required value={finding.inspector_id}
            onChange={(event) => update("inspector_id", event.target.value)} />
        </label>
        <label>
          Facility name
          <input required value={finding.facility_name}
            aria-invalid={facilityError ? true : undefined}
            aria-describedby={facilityError ? "facility-error" : undefined}
            onChange={(event) => {
              update("facility_name", event.target.value);
              onFacilityChange();
            }} />
        </label>
        {facilityError && <p id="facility-error" role="alert" className="error">{facilityError}</p>}
        <label>
          Inspection type
          <input required value={finding.inspection_type}
            onChange={(event) => update("inspection_type", event.target.value)} />
        </label>
        <label>
          Severity
          <select value={finding.severity} onChange={(event) => {
            const value = event.target.value;
            if (isSeverity(value)) update("severity", value);
          }}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
        <label>
          Notes
          <textarea required rows={3} value={finding.notes}
            onChange={(event) => update("notes", event.target.value)} />
        </label>
        <button type="submit">{saving ? "Saving..." : "Save finding"}</button>
      </fieldset>
    </form>
  );
}
