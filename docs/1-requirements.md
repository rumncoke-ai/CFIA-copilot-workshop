# Module 1 - Requirements and acceptance criteria

## 1. Objective

**Timebox: 15 minutes.** Turn the inspector-lead story into a reviewable contract
in [requirements.md](../requirements.md). Do not implement code in this module.

> As an inspector lead, I can log findings and receive a risk score and follow-up
> recommendation so that I can prioritize follow-up consistently.

Copilot-generated criteria are proposals, not policy. Use the fixed synthetic
rules below rather than designing a new scoring algorithm.

## 2. Why this matters

"Improve triage" does not define blank inputs, failed saves, or storage resets.
An independent contract gives both the engineer and Copilot concrete expected
outputs. Do not derive requirements only from what the starter happens to do.

## 3. Tasks

### A. Separate current and desired behavior

Inspect [findings.ts](../client/src/findings.ts),
[risk.ts](../client/src/risk.ts), [FindingForm.tsx](../client/src/FindingForm.tsx),
and [App.tsx](../client/src/App.tsx).

Already implemented: create/list, severity-only scoring, JSON initialization,
localStorage persistence, basic stored-shape checks, explicit storage failures,
and confirmed reset.

Still missing: text trimming/limits, strict unknown-input-field rejection,
field-specific feedback, and comprehensive validation tests. Mark desired
behavior as **planned**, not implemented.

### B. Record the fixed training contract

**Functional criteria**

| ID | Acceptance criterion | Evidence |
| --- | --- | --- |
| F-01 | A valid `createFinding` resolves to the complete normalized input plus calculated score/action; exactly one finding is persisted before success. | Compare the full result and subsequent `getFindings` list. |
| F-02 | `getFindings` resolves to an array in creation order. Duplicate valid submissions remain separate entries; an explicitly saved `[]` stays empty. | Create twice and compare the full list, including seed records. |
| F-03 | Derive score/action only from exact validated severity using the table below. Do not accept input score/action fields. | Test all severities and attempted extra derived fields. |
| F-04 | Successful UI saves show score/action, add the finding, and clear the form. Failed saves retain inputs, show an error, and add no entry. | Exercise success, storage failure, and retry. |
| F-05 | Invalid create input rejects with field-identifying feedback before any storage change, including when bypassing the form. | Call the service directly and compare complete storage before/after. |
| F-06 | Missing storage initializes from bundled seeds. Reload/restart preserves existing data. Confirmed reset restores seeds and clears latest-save confirmation; cancel changes nothing. | Verify browser reload, restart, both reset choices, and an unrelated storage key. |

| Severity | Risk score | Exact follow-up action |
| --- | --- | --- |
| `low` | 20 | `Routine follow-up` |
| `medium` | 50 | `Schedule follow-up inspection` |
| `high` | 80 | `Prioritize immediate review` |

Notes, facility name, and inspection type do not affect scoring. These are
deterministic training examples, not AI predictions or official policy.

**Validation criteria**

All five input fields are required strings. Reject missing, `null`, and
non-string values; never coerce numbers into strings.

| ID | Field | Exact rule |
| --- | --- | --- |
| V-01 | `inspector_id` | Trim outer whitespace; 1-40 Unicode code points afterward. |
| V-02 | `facility_name` | Trim outer whitespace; 1-120 code points afterward. |
| V-03 | `inspection_type` | Free text; trim outer whitespace; 1-60 code points afterward. |
| V-04 | `severity` | Only exact lowercase `low`, `medium`, `high`; do not trim or lowercase severity. |
| V-05 | `notes` | Trim outer whitespace; 1-1000 code points afterward. Preserve internal whitespace and line breaks. |

Count Unicode code points, not bytes or UTF-16 code units. Whitespace-only text
becomes empty and is rejected. Accept valid Unicode and markup-like text; safe
rendering is the protection, not an ASCII-only rule or HTML blacklist.

Reject unknown create-input keys, including `risk_score` and `follow_up_action`.
Put runtime checks in the local service as well as friendly form feedback.
TypeScript annotations alone do not validate JavaScript callers or stored JSON.
The service is a consistency boundary, **not a trusted security boundary**:
users can change both browser storage and application code.

**Non-functional criteria**

| ID | Acceptance criterion | Evidence |
| --- | --- | --- |
| NF-01 | Finding text renders literally, not as HTML. | Notes containing `<img src=x onerror=alert(1)>` display text without an image or handler execution. |
| NF-02 | Validation identifies fields; storage/load failures are visible and distinct from success. Save becomes usable after failure; no stale success is reported for that operation. | Invalid input, blocked writes, retry, and load-error checks. |
| NF-03 | Corrupt/invalid saved data is not silently discarded. Reset is explicit; blocked reset leaves saved data and UI unchanged. Only the app key is touched. | Malformed JSON, shape mismatch, reset failure, and unrelated-key checks. |
| NF-04 | Local tests and build pass. Tests cover scoring, service acceptance/rejection/persistence, and a real App/form/service flow in jsdom. | Record actual commands/results; separate real-browser checks from component evidence. |

Out of scope: shared records, trusted scoring, authentication, deployment,
editing/deleting individual findings, new dashboards, and official inspection
policy. Browser persistence is in scope; production durable storage is not.

### C. Write exact examples and edge cases

Valid input:

```json
{
  "inspector_id": "INS-001",
  "facility_name": "Demo Facility",
  "inspection_type": "Routine",
  "severity": "high",
  "notes": "Synthetic finding: damaged storage seal."
}
```

Expected resolved object: those same five fields plus
`"risk_score": 80` and `"follow_up_action": "Prioritize immediate review"`.
Expected read-back list: the previous records followed by exactly this object.

| Input/failure | Expected result |
| --- | --- |
| `"  Demo Facility  "` | Resolved/stored name `"Demo Facility"`. |
| Empty/whitespace-only text | Rejection identifying the field; stored list unchanged. |
| Missing, `null`, or numeric required field | Rejection; no coercion; stored list unchanged. |
| Each text field at maximum / maximum + 1 | Accept / reject after trimming. |
| `High`, `critical`, `" high "` | Reject severity. |
| Extra score, action, or unrelated key | Reject unknown field; no append. |
| Notes with 1000 / 1001 emoji code points | Accept / reject without UTF-16 counting mistakes. |
| Valid markup-like notes | Accept within limits and display as literal text. |
| Browser storage write failure | Visible failure, inputs retained, no new list entry. |
| Corrupt saved JSON | Visible load failure; no automatic overwrite; explicit reset recovers. |

### D. Define done

For each criterion record implementation status, verification method, and actual
evidence. Documentation completion is not feature completion. Note remaining
risks, especially the absence of trusted storage or access control.

## 4. VS Code + Copilot prompts

**Explain first (Ask mode):**

```text
Do not edit files. Inspect findings.ts, risk.ts, App.tsx, and FindingForm.tsx.
Trace save, read-back, seed initialization, and reset. Separate implemented
behavior from workshop TODOs. Cite actual functions; do not assume an HTTP API.
```

**Define criteria:**

```text
Do not implement code. Use this module's fixed field limits, scoring table,
and browser-storage rules. Propose F/V/NF criteria as
ID | Given | When | Then | Verification.
Include exact outputs, code-point boundaries, failed-save state, reset/cancel,
and unknown fields. Distinguish local consistency from a security boundary.
List contradictions instead of inventing policy.
```

**Save the reviewed artifact:**

```text
Update only requirements.md with the criteria I reviewed, a complete example
result, edge-case matrix, scope, and definition of done. Mark unimplemented
criteria as planned. Do not change application code or claim checks were run.
```

## 5. Checkpoint and retrospective

- [ ] Criteria are saved with stable IDs and exact score/action pairs.
- [ ] Types, trimming order, code-point limits, and unchanged-state failures are explicit.
- [ ] Reload/reset behavior matches browser-local persistence.
- [ ] Current behavior and desired protections are clearly distinguished.
- [ ] I verified a Copilot claim against source rather than accepting fluent prose.
- [ ] I can explain why browser validation cannot make scores authoritative.

**Common traps:** vague "secure" criteria, invented CFIA policy, treating TS types
as runtime checks, and defining done as a green build. Recover with concrete
inputs, exact expected outputs, and an independent verification method.

**Next: [Module 2](2-implementation.md).**
