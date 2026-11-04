# Module 2 - Feature implementation

## 1. Objective

**Timebox: 35 minutes.** Implement the reviewed text-validation criteria in the
existing form and local data service. Deliver one slice: save a normalized,
valid finding and show its calculated score/action.

The starter already creates/lists findings and persists them. Do not rebuild it
or add a backend, HTTP mocking layer, database, or UI framework.

## 2. Why this matters

The inspector lead experiences one workflow, not isolated functions. A service
that accepts whitespace while the form rejects it produces inconsistent
behavior. Small, reviewed producer/consumer changes keep the contract visible.

Use **explain -> review -> apply -> verify**. Copilot's explanation is a proposal,
not evidence that the implementation is correct.

## 3. Tasks

Keep the app terminal running. Open a second PowerShell terminal at the
repository root for checks.

### A. Bound the change

Attach [requirements.md](../requirements.md), [findings.ts](../client/src/findings.ts),
[FindingForm.tsx](../client/src/FindingForm.tsx), and
[App.tsx](../client/src/App.tsx).

| Implement now | Preserve / defer |
| --- | --- |
| Required strings, trimming, post-trim code-point limits, exact severity. | Existing 20/50/80 score/action mapping and input/output field names. |
| Field-specific local feedback and matching service validation. | Seeds, persistence, confirmed reset, order, and duplicates. |
| One focused normalization regression and manual failure check. | Module 3: unknown-field rejection and error/empty-state review. Module 4: full boundary matrix. |

Do not claim the entire definition of done is complete after this slice.

### B. Improve validation in the service

Ask Copilot to propose a small validation helper used by `createFinding`.
It must check runtime values before reading or normalizing their contents:

1. Require each input field to be a string; reject missing/`null`/numeric fields.
2. Trim only the four free-text fields before checking their limits:
   **40 / 120 / 60 / 1000**, minimum **1**.
3. Use code-point counting such as `Array.from(text).length`; JavaScript
   `.length` and native `maxLength` count UTF-16 units, not code points.
4. Preserve internal whitespace, line breaks, and Unicode text.
5. Keep severity exactly `low | medium | high`, without normalization.
6. Validate before initialization/appending/writing, so rejected input does not
   change storage, even if the app key was absent.
7. Keep scoring in [risk.ts](../client/src/risk.ts), not in the form or payload.
8. Provide field-identifying validation errors that callers can handle safely.
   Avoid unchecked casts, `any`, silent returns, or generic success fallbacks.

Reuse shared validation rules for the service and form rather than duplicating
length limits in unrelated places. A small typed field-error structure is enough;
do not introduce a general validation framework.

Add a regression to [findings.test.ts](../client/src/findings.test.ts):
save a high finding with outer spaces in all text fields, then assert the
complete normalized result and full read-back list. Use literal expected
score/action values, not the production scoring table.

```powershell
npm.cmd --prefix .\client test -- src\findings.test.ts
```

Inspect the diff and actual result before accepting the change. Remove only
TODO text whose behavior is now implemented.

### C. Connect form feedback

Use the reviewed helper/error shape to show field errors near their controls.
Associate messages using `aria-describedby` and mark invalid controls with
`aria-invalid`. Keep general storage failures in the app's visible alert.

Preserve:

- Input values after any failed save.
- Disabled controls during saving and usable controls afterward.
- Form clearing only after persistence succeeds.
- Success confirmation, list updates, refresh, and confirmed reset.
- React text rendering; do not use `dangerouslySetInnerHTML`.

The form may show immediate validation feedback, but the service must still
validate callers that bypass the form. Browser checks improve consistency;
they do not prevent a user from changing their own data/code.

### D. Verify the complete slice

```powershell
npm.cmd --prefix .\client test
npm.cmd --prefix .\client run build
```

In the browser:

1. Save a high-severity finding with outer spaces. Expect normalized text,
   score **80**, exact action **Prioritize immediate review**, and a cleared form.
2. Reload the browser. The normalized finding remains for the same origin.
3. Submit whitespace-only facility text. Expect a field error, retained inputs,
   no success confirmation for that attempt, and no new finding.
4. Save corrected input. Expect normal behavior without restarting the app.

Also test the service directly in a regression test with whitespace-only text.
Native form `required` alone cannot establish service validation.

Record the criterion IDs, commands, observed outcomes, and remaining gaps in
[requirements.md](../requirements.md). A passing suite is evidence for its
cases, not proof of all untested criteria.

## 4. VS Code + Copilot prompts

**Explain the bounded slice:**

```text
Do not edit yet. Inspect the attached code and reviewed V-01 through V-05.
Propose the smallest form/service changes, shared validation/error shape,
and a normalization regression test. Preserve scoring, seeds, persistence,
duplicates, refresh, and reset. Leave unknown-field hardening for Module 3.
Return file/function, change, reason, and verification. Wait for approval.
```

**Apply after review:**

```text
Apply only the changes I approved in the named files. Validate runtime types,
trim before code-point length checks, and validate before any storage write.
Use safe field-error narrowing. Add the reviewed normalization test with
explicit expected values. Report actual checks and unresolved criteria.
```

**Repair a failure:**

```text
Here are the exact failing command and output: [PASTE].
Explain the root cause against [CRITERION_ID] before editing.
Fix only the related defect; do not weaken assertions, change the contract,
rewrite the app, or suppress the error. Rerun the same check.
```

## 5. Checkpoint and retrospective

- [ ] A normalized high finding has the exact expected score/action.
- [ ] Whitespace-only input is rejected without changing saved findings.
- [ ] The service validates direct callers as well as form input.
- [ ] Form feedback is accessible and failed saves preserve values.
- [ ] Tests/build pass, with commands and evidence recorded.
- [ ] I reviewed a bounded diff and identified criteria still needing evidence.

**Common traps:** using `.length` for Unicode, validating after appending,
stringifying invalid values, duplicating rules, and clearing the form before a
failed write. Reproduce the smallest failing case and verify unchanged storage.

**Next: [Module 3](3-security-review.md).**
