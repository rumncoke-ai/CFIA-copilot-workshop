# Module 3 - Security and code-review hardening

## 1. Objective

**Timebox: 25 minutes.** Review the actual changes from
[Module 2](2-implementation.md) with GitHub Copilot, then fix **at least one
security-related issue and one distinct code-quality issue**.

Focus on input validation, error handling, data assumptions, and maintainability.
Record evidence and fixes in [requirements.md](../requirements.md); do not start
another app or turn this local lab into a production security platform.

Default targets, if still present in your implementation:

- **Security-related:** unknown POST fields are silently accepted instead of
  rejected at the API boundary.
- **Code-quality:** generic HTTP errors discard field-level validation context,
  making failures difficult for the inspector lead to correct.

These are review hypotheses until you reproduce them. Ignoring an extra
`risk_score` is not the same as trusting it; do not claim a score-override
exploit if the server already computes the score correctly.

## 2. Why this matters in real SDLC

Generated code can satisfy a happy-path demo while violating the input contract
or obscuring failures. An inspector lead should not receive a success response
for a malformed request or have to guess which field needs correction.

Threat-focused review asks what an untrusted caller can submit directly to the
API, not just what the form permits. Code-quality review asks whether validation,
scoring, and error handling remain understandable and consistent after edits.

GHCP output is probabilistic. Review suggestions need a code reference,
reproduction, and verification; a warning alone does not establish a vulnerability.
Follow [the workshop security boundaries](../SECURITY.md): synthetic data,
localhost, no secrets or real inspection records in prompts.

## 3. Tasks

### A. Select the changed files and review scope (3 minutes)

In VS Code Source Control, inspect your Module 2 diffs. Review changed files
plus only the adjacent producers/consumers needed to understand them:

| Surface | Files to inspect |
| --- | --- |
| Input boundary and storage | [models.py](../server/models.py), [app.py](../server/app.py) |
| Trusted scoring and assumptions | [risk.py](../server/risk.py) |
| Form, rendering, and request failures | [FindingForm.tsx](../client/src/FindingForm.tsx), [App.tsx](../client/src/App.tsx), [api.ts](../client/src/api.ts) |
| Existing evidence | [test_app.py](../server/test_app.py), [requirements.md](../requirements.md) |

Attach the actual changed files and relevant context in Copilot Chat. If your
starter files are untracked, use the saved Chat edit diff from Module 2 rather
than pretending Source Control has a historical baseline.

Run Prompt 1 in question-only mode. No edits yet.

**Stop and verify:** each proposed finding refers to code you can locate.
Separate confirmed issues, hypotheses, and existing local-lab limitations.

### B. Review and reproduce two findings (6 minutes)

Use this checklist with Prompts 1 and 2:

| Focus | Concrete review question |
| --- | --- |
| Input validation | Can direct POST bypass required types, trim/length rules, strict severity, or unknown-field rejection? Is validation completed before append? |
| Error handling | Are HTTP 422, network failures, and malformed API responses visibly distinguishable from success? Are values preserved after failed saves? |
| Data assumptions | Are scores server-derived? Are duplicate findings allowed? Do reload/reset and one-worker assumptions match the documented contract? |
| Maintainability | Is scoring defined once? Are frontend/backend validation rules consistent? Are errors parsed with type guards instead of `any`, unchecked casts, or broad catches? |
| Safe rendering | Are notes rendered as JSX text rather than HTML? Does valid markup-like text remain literal? |

For each selected issue, add a row under a **Module 3 review findings** heading
in [requirements.md](../requirements.md):

`ID | Category | File/function | Input or failure | Observed behavior |
Risk/impact | Proposed fix | Verification | Status`

Use **security-related** and **code-quality** for the two required categories.
Do not count two descriptions of one fix as two independent issues.

Reproduce the default security-related issue against your current backend:

```powershell
# Run from the repository root with FastAPI on port 8000.
@'
import httpx

payload = {
    "inspector_id": "INS-003",
    "facility_name": "Demo Facility",
    "inspection_type": "Routine",
    "severity": "high",
    "notes": "Synthetic review finding.",
    "risk_score": 1,
}
with httpx.Client(base_url="http://127.0.0.1:8000") as client:
    before = client.get("/findings")
    before.raise_for_status()
    response = client.post("/findings", json=payload)
    after = client.get("/findings")
    after.raise_for_status()
    print("POST status:", response.status_code)
    print("POST response:", response.json())
    print("List-count change:", len(after.json()) - len(before.json()))
'@ | .\.venv\Scripts\python.exe -
```

Under `extra="ignore"`, expect HTTP 201, server score 80, and one additional
finding. The risk is silent acceptance of unexpected fields and an ambiguous
API contract, not evidence that the caller changed the score to 1.
The agreed target is **422 and no list change**.

For the default quality issue, inspect [api.ts](../client/src/api.ts). A message
containing only HTTP 422 loses the response's field location and reason.
Use a direct invalid POST to inspect the real FastAPI `detail` shape; do not
invent it. Module 2's form may block this input locally, so a browser happy path
cannot prove server-validation error handling.

If either default is already fixed, select another confirmed issue from the
checklist, such as a failed GET misleadingly showing "No findings yet" or
inconsistent Unicode-length checks. Ask the facilitator for a bounded target
if no distinct issue is reproducible; do not introduce a bug just to fix it.

**Stop and verify:** both findings have observed evidence, separate impact,
and a measurable expected result.

### C. Apply bounded remediations (9 minutes)

Run Prompt 3's explain phase for one finding at a time. Inspect its proposed
diff, then approve only that fix and its regression test.

**Default security-related fix**

- Change the existing request-model configuration to reject unknown fields
  (`ConfigDict(extra="forbid")`) rather than silently ignoring them.
- Keep server-only scoring, strict severity, normalization, and text limits.
- Add a parameterized regression test using the existing fixture. Try extra
  `risk_score`, `follow_up_action`, and an unrelated field individually.
  Each request must return 422 and leave a pre-existing list unchanged.
- Remove the unknown-field workshop comment only after verifying the fix.

**Default code-quality fix**

- In the existing API utility, inspect HTTP 422 response JSON using `unknown`
  and type guards. Extract recognized field names and readable validation
  reasons; surface them through the existing visible error path.
- Do not display or log entire error objects: FastAPI details can include
  submitted `input`. Do not echo raw notes, stack traces, or arbitrary response
  bodies into error messages.
- Preserve a clear status-based error for non-validation failures. If an error
  body is malformed or unreadable, explicitly report that parsing problem with
  the HTTP status; never return an empty list or fake saved finding.
- Preserve the existing successful-response guards, failed-save input retention,
  and `finally` cleanup of saving/loading state.

Use local labels for known fields, such as **Facility name**, and do not add an
error-handling framework. Do not weaken server validation just to simplify the
frontend.

Inspect the changed-file diff after each fix. Keep text rendering safe and
resolve any tightly related regressions before continuing.

**Stop and verify:** explain how each diff addresses its recorded finding.
Reject suppression of errors, removed assertions, trusted client scores,
unsafe HTML rendering, or unrelated refactors.

### D. Verify behavior, not just the diff (5 minutes)

Run from a repository-root check terminal:

```powershell
.\.venv\Scripts\python.exe -m pytest .\server\test_app.py -q
npm --prefix .\client run build
```

Expect all existing and new tests to pass and TypeScript/Vite to build.
Wait for backend reload, then rerun the direct POST reproduction above:
expect **422**, an extra-field error, and **list-count change 0**.

Check the browser at `http://127.0.0.1:5173`:

1. Save a valid high-severity finding; confirm **80** and
   **Prioritize immediate review**, then refresh to verify GET.
2. Submit valid-length notes containing `<img src=x onerror=alert(1)>`.
   They must display literally, not create an image or execute a handler.
3. Temporarily stop only your backend with Ctrl+C in its own terminal.
   Attempt a valid save: input remains, no new local entry appears, an error is
   visible, and the save control becomes usable again.
4. Restart using the Module 0 Uvicorn command. Click **Refresh findings**;
   the list is empty because backend storage reset, not because data persisted.

For the API-error improvement, use browser DevTools Console on the local app
to call its actual utility, bypassing the form:

```javascript
const { createFinding } = await import("/src/api.ts");
try {
  await createFinding({
    inspector_id: "INS-004",
    facility_name: "   ",
    inspection_type: "Routine",
    severity: "high",
    notes: "Synthetic validation check."
  });
  throw new Error("Unexpected success: API accepted blank facility name.");
} catch (error) {
  console.error(error);
}
```

Inspect the result: it must identify the facility-name validation problem,
not just "HTTP 422". An unexpected-success message is a failure, not a passing
error-handling check. This console check verifies the utility; ordinary network
failure above verifies the visible UI error path. Full automated coverage comes
in Module 4.

**Stop and verify:** record actual results for both fixes. A passing build
alone is not proof of input rejection, safe rendering, or usable failure feedback.

### E. Record the risk reduction and handoff (2 minutes)

Update each finding with the exact change and verification evidence. Mark it
resolved only if its reproduction now meets the expected result.

Document remaining issues and accepted local-lab limitations separately:
no authentication, process-local storage, one worker, synthetic data, localhost
only. These limits are not permission to deploy the tracker publicly.

Update criterion status honestly and hand the evidence to
[Module 4](4-testing.md). Keep the restarted backend and frontend running.

## 4. VS Code + GHCP prompts to run

### Prompt 1 - Threat-focused review of changed files

```text
Do not edit files. Review the attached Module 2 changes and necessary adjacent
code against our requirements. Treat API callers as untrusted and the frontend
as bypassable. Focus on validation before storage, unknown fields, strict
severity, trusted risk outputs, safe rendering, and error/data exposure.
For each finding give file/function, concrete input or failure, current
behavior, impact, reproduction, and confidence. Separate confirmed issues
from hypotheses and local-lab limitations. Do not claim score override merely
because an extra score field is ignored.
```

Expected: an evidence-based findings table, including explicit uncertainty,
not a generic OWASP checklist or a production architecture rewrite.

### Prompt 2 - Code-quality and assumption review

```text
Do not edit files. Review maintainability and failure behavior of the same
changes: duplicate scoring/validation rules, Python versus JS text lengths,
unchecked response parsing, discarded validation context, state cleanup,
false empty states, and in-memory/reset assumptions. Find a distinct,
reproducible quality issue, not a second label for the selected security fix.
Give a small remediation and its observable verification.
```

Expected: `Issue | Code evidence | User/developer impact | Small fix |
Verification` rows. Flag already-correct behavior rather than inventing defects.

### Prompt 3 - Explain remediation before applying

```text
Do not edit yet. For this confirmed finding: [paste finding and reproduction],
propose the smallest fix in the existing files. State which requirement it
enforces, what behavior must remain unchanged, and the regression check.
Do not add dependencies, suppress failures, echo submitted input in errors,
or expand production scope. Wait for approval.
```

After reviewing:

```text
Apply only the approved fix and its focused regression test. Reuse existing
models, helpers, and fixtures. Preserve strict types and safe text rendering.
Summarize the changed behavior and the exact check to rerun. Do not declare
the issue resolved until its reproduction passes.
```

### Prompt 4 - Verify and summarize risk reduction

Attach the reviewed diffs, recorded findings, and actual check output.

```text
Do not edit application code. Map each selected finding to its fix and actual
verification evidence. State what changed, why it reduces risk or improves
failure handling, and what remains unverified. Distinguish prevention of
unexpected inputs from proof of a score-override exploit. Identify remaining
tests for Module 4 and do not claim production readiness.
```

Expected: `Finding ID | Change | Risk reduction | Evidence | Remaining work`
table suitable for recording in the requirements artifact.

## 5. Checkpoint

Show your partner or facilitator:

- A review of actual changed files covering validation, errors, assumptions,
  and maintainability.
- **One resolved security-related finding and one distinct resolved
  code-quality finding**, each with before/after evidence.
- Rejected unknown fields with HTTP 422 and no stored-list change, or equivalent
  verification of your agreed alternative security fix.
- Improved failure handling with specific validation context, or equivalent
  verification of your agreed alternative quality fix.
- Passing tests/build and preserved valid create/list/scoring behavior.
- Safe literal text rendering and failed-save input retention.
- Recorded remaining risks and local-only limitations.

Security review is not a guarantee that no issues remain. Only mark criteria
complete when their required evidence exists.

## 6. Retrospective checklist

- [ ] What security-related behavior did I change, and what exact input now
      behaves differently?
- [ ] Why did that change reduce risk at the API or rendering boundary?
- [ ] What distinct code-quality behavior did I change, and who benefits?
- [ ] What before/after evidence shows the fixes work?
- [ ] Can I distinguish silent extra-field acceptance from trusting a caller's
      risk score?
- [ ] Did I verify that valid findings still receive the same score/action?
- [ ] Did I avoid leaking submitted input or hiding failures in error handling?
- [ ] What remains unverified, and which Module 4 test should cover it?
- [ ] Did I challenge a Copilot claim rather than accept it blindly?

## 7. Common traps

| Trap | Concrete guardrail |
| --- | --- |
| Asking "Is this secure?" and accepting reassurance | Ask for threats, code locations, reproducible inputs, and observable impact. |
| Treating every warning as a confirmed vulnerability | Reproduce it and distinguish a contract gap from an exploit. |
| Reviewing only UI validation | Submit directly to FastAPI; the form is not a security boundary. |
| Counting one patch as both required fixes | Resolve a separate security-related and quality issue with separate evidence. |
| Broad catches that return success-shaped defaults | Surface failure explicitly; never invent saved data or turn failed GET into a trusted empty list. |
| Dumping FastAPI error JSON into the UI or logs | Extract safe field context; omit submitted `input`, traceback, and arbitrary bodies. |
| Removing a TODO without closing its gap | Rerun the reproduction and record its changed outcome first. |
| Rewriting the app during review | Approve one finding-sized diff at a time and preserve unrelated participant changes. |
| Calling the lab production-ready after two fixes | Record authentication/storage/deployment limitations and keep the app on localhost. |
