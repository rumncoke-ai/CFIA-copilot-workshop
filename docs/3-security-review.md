# Module 3 - Security and code-review hardening

## 1. Objective

**Timebox: 25 minutes.** Review the actual Module 2 changes, reproduce one
security-related input-handling issue and one distinct code-quality issue, and
apply bounded fixes. Record evidence in [requirements.md](../requirements.md).

Default hypotheses:

- Unknown create-input fields are ignored instead of rejected.
- A failed load is presented alongside an empty-state message, which can suggest
  that there are no findings when storage could not actually be read.

Verify these against your current code. An ignored extra score is a contract
gap, **not proof that score override worked**. If already fixed, select another
reproducible issue, such as inconsistent field-error feedback.

## 2. Why this matters

Browser input and stored JSON are untrusted values. TypeScript cannot validate
them at runtime. But the browser is also controlled by its user: localStorage,
JavaScript, and scores can all be edited. This workshop cannot offer trusted
enforcement, authorization, or tamper-proof inspection records.

Review reliability and safe rendering without inventing production guarantees.
Follow [security boundaries](../SECURITY.md): synthetic data, no secrets, and no
real inspection records in code or prompts.

## 3. Tasks

### A. Scope the review

Inspect Module 2 diffs in VS Code Source Control and the relevant neighbors:

| Surface | Files |
| --- | --- |
| Runtime input, storage, and reset | [findings.ts](../client/src/findings.ts) |
| Calculated output | [risk.ts](../client/src/risk.ts) |
| Form, rendering, state, and errors | [FindingForm.tsx](../client/src/FindingForm.tsx), [App.tsx](../client/src/App.tsx) |
| Evidence | [findings.test.ts](../client/src/findings.test.ts), [App.test.tsx](../client/src/App.test.tsx), [requirements.md](../requirements.md) |

Ask for review only first. Require a file/function, concrete input/failure,
impact, and verification for every finding. Separate confirmed defects,
hypotheses, and accepted demo limitations.

### B. Reproduce before fixing

**Unknown field case:** in a service regression test, build a payload variable
with all five valid inputs plus `risk_score: 1`. Passing this variable to
`createFinding` exercises runtime handling without bypassing TypeScript with
`as any`. Capture `getFindings` before/after.

The starter ignores the extra field, calculates **80** for high severity, and
appends a record. The target contract is rejection identifying the extra key
and an unchanged complete list. Repeat for `follow_up_action` and an unrelated
key. Never accept caller-supplied derived values as an alternative fix.

**Failed-load/empty-state case:** use a separate browser profile with synthetic
data. In DevTools Console:

```javascript
localStorage.setItem("cfia-workshop.findings.v1", "{broken");
location.reload();
```

The malformed JSON must already produce a visible load error and remain stored.
Check whether the UI also says **No findings yet.** That empty-state message is
misleading when loading failed. If records were previously displayed, examine
whether refresh failure leaves them looking current without any stale-data
explanation. Record what you actually observe.

Use **Reset demo data** and confirm to recover. Do not clear all origin storage.

For each selected issue add:

`ID | Category | File/function | Reproduction | Observed result | Impact |
Proposed fix | Verification | Status`

### C. Apply small remediations

1. Reject unknown create-input keys before any write, including first-use seed
   initialization. Keep valid derived fields in **stored** findings: create input
   and stored output have different shapes.
2. Show an honest failed-load state rather than a successful empty state. Offer
   refresh/reset recovery; label or hide stale records consistently.
3. Keep field-specific validation errors separate from general storage errors.
   Narrow error types safely; do not silence failures or discard form values.
4. Preserve confirmed reset, unchanged-state failures, scoring, and literal text.

Use one focused regression per issue and rerun:

```powershell
npm.cmd --prefix .\client test
npm.cmd --prefix .\client run build
```

### D. Verify safe rendering and storage assumptions

- Save notes containing `<img src=x onerror=alert(1)>`. They should display as
  literal text, not create an image or execute a handler. Do not add a blanket
  HTML blacklist; inspect JSX text rendering.
- Edit the saved JSON in DevTools to change a numeric risk score. The starter's
  shape checks can accept a finite number even if it is inconsistent with
  severity. Record this limitation accurately. Recomputing display scores could
  improve consistency, but still cannot make client code trustworthy.
- Confirm failed storage writes retain form values and do not append a UI
  finding. Baseline tests already exercise this; examine their assertions.
- Confirm reset cancel preserves data and confirmed reset touches only the app
  key. Never call `localStorage.clear()` in application code.

Do not count safe existing behavior as a newly fixed vulnerability. Do not add
authentication, encryption keys in the browser, or a backend as a lab fix.

## 4. VS Code + Copilot prompts

**Review without edits:**

```text
Review my actual Module 2 diff and attached callers/tests. Do not edit.
Focus on runtime validation, unknown create keys, literal rendering, browser
storage assumptions, and load/save/reset feedback.
Return file/function, reproduction, observed vs expected behavior, impact,
confidence, and focused verification. Separate confirmed issues from hypotheses
and accepted browser-only limitations. Do not claim trusted scoring or call an
ignored input field a successful score override.
```

**Bound a remediation:**

```text
For confirmed finding [ID], propose the smallest change in [ALLOWED_FILES].
Preserve scoring, valid stored output fields, persistence, failed-save values,
and reset. Add one regression from the reviewed expected outcome, not the
current implementation. Explain first; apply only after my approval.
```

**Check the evidence:**

```text
Compare [BEFORE/AFTER_RESULTS] against [CRITERION_IDS]. State exactly what
the tests and browser checks prove, what is still unverified, and which
client-side limitations remain. Do not invent results or production assurances.
```

## 5. Checkpoint and retrospective

- [ ] One input-handling issue and one distinct quality issue were reproduced.
- [ ] Findings cite code and evidence, not just model-generated warnings.
- [ ] Fixes have focused regressions and passing local tests/build.
- [ ] Unknown fields reject without changing storage.
- [ ] Load failures are not mislabeled as successful empty lists.
- [ ] Markup renders literally and storage limitations are documented.
- [ ] I can distinguish consistency hardening from trusted security.

**Common traps:** alarmist claims without reproduction, confusing ignored fields
with accepted overrides, treating localStorage as secure, hiding parse errors
with `[]`, and using unsafe HTML to improve formatting. Verify each claim and
keep failure states explicit.

**Next: [Module 4](4-testing.md).**
