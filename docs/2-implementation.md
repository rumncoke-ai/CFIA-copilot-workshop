# Module 2 - Feature implementation

## 1. Objective

**Timebox: 35 minutes.** Deliver one end-to-end slice from
[Module 1 requirements](../requirements.md): **log a normalized, valid finding
and display its server-calculated risk score and follow-up recommendation**.

The starter already has POST, GET, scoring, and a form. Do not rebuild them.
Extend the slice with matching backend validation and frontend feedback so
participants can enter usable findings without guessing what was rejected.

Use small Copilot iterations: **explain the change, review the proposal, apply
one bounded diff, then verify behavior**.

## 2. Why this matters in real SDLC

A feature is not complete because one layer compiles. An inspector lead enters
data in the UI, the API validates and stores it, and the UI displays the
returned score. A whitespace-only facility name accepted by one layer but
rejected by another breaks that workflow.

Small reviewed changes keep the triage contract visible and make regressions
easier to locate. You remain responsible for generated code; fluent explanations
and plausible implementations are not proof.

## 3. Tasks

Keep the two servers from Module 0 running. Use a third VS Code PowerShell
terminal for checks, starting at the repository root. Use the explicit commands
below; [scripts](../scripts) also provides setup/start/test shortcuts.
If using the supervised start script, leave its terminal open and run checks
in another terminal.

### A. Agree on the smallest change (3 minutes)

Open [requirements.md](../requirements.md) and run Prompt 1 below.
Use this implementation boundary:

| This module implements or preserves | Later work |
| --- | --- |
| Strict required-string checks, text trimming and post-trim length limits from V-01/V-02/V-03/V-05; preserve exact severity V-04. | Module 3 reviews bypass inputs, unknown-field rejection, safe rendering, and error-response hardening. |
| Existing server-only scoring and POST 201 / GET 200 contracts (F-01/F-02/F-03). | Module 3 explicitly verifies trusted-output override attempts are rejected. |
| Frontend checks matching text rules; field-specific local feedback; existing save/list/confirmation behavior (F-04). | Module 3 improves server-validation error mapping and load-error/empty-state clarity. |
| One focused regression test and manual slice checks. | Module 4 expands boundary, API, and UI automation to satisfy NF-04. |

Use Module 1's exact limits: inspector ID **40**, facility name **120**,
inspection type **60**, notes **1000** code points, each with a minimum of
**1 after trimming**. Keep the three existing score/action pairs unchanged.

**Stop and verify**

- Point to the actual producer and consumer files in the proposed plan.
- Reject new databases, authentication, scoring algorithms, or UI frameworks.
- Confirm the plan distinguishes existing behavior from work to implement.
- Identify which requirements remain unverified; do not call the entire
  Module 1 definition of done satisfied.

### B. Implement the backend part (10 minutes)

Attach [models.py](../server/models.py), [risk.py](../server/risk.py),
[app.py](../server/app.py), [test_app.py](../server/test_app.py), and the
requirements artifact. Run Prompt 2's explain phase, review it, then run its
apply phase.

Guide the change toward the existing Pydantic model:

1. Require strings without coercing numbers into strings.
2. Trim leading/trailing whitespace on the four free-text fields before
   checking minimum/maximum lengths. Preserve internal whitespace and Unicode.
3. Keep severity an exact `low | medium | high` value; do not trim or lowercase it.
4. Keep scoring in [risk.py](../server/risk.py), not the request or frontend.
5. Add one focused test to [test_app.py](../server/test_app.py): submit a valid
   high-severity payload with outer whitespace in its text fields; assert
   HTTP 201, exact normalized response, score/action, and GET list contents.
   Reuse the existing client fixture and preserve its cleanup.

Pydantic validates length in code points. If Copilot uses a before-validator,
it must trim only actual strings and leave other types for explicit rejection.
Do not accept a validator that stringifies arbitrary input.

Review the bounded diff in VS Code Source Control. If the provided workspace
has not yet tracked starter files, Source Control may show whole files as new;
use Chat's edit diff and compare against the pre-edit file instead of claiming
every visible line was changed in this iteration.

Run from the repository root:

```powershell
.\.venv\Scripts\python.exe -m pytest .\server\test_app.py -q
```

Expected: the two original tests plus your new normalization test pass
(normally **3 passed**). If a check fails, use the repair prompt; do not move on.
Wait for Uvicorn's reload to finish after backend edits. Reload clears the
in-memory list.

**Stop and verify**

- Inspect the model: trimming precedes length checks; non-strings are not coerced.
- Compare the normalization test's full expected response with Module 1.
- Confirm original tests still pass and the scoring table did not change.
- Remove the text-validation workshop marker only if its gap is actually
  resolved; leave unknown-field and coverage markers for subsequent modules.

### C. Implement the frontend part (12 minutes)

Attach [FindingForm.tsx](../client/src/FindingForm.tsx),
[App.tsx](../client/src/App.tsx), [api.ts](../client/src/api.ts), and
the requirements artifact. Run Prompt 3's explain phase before its apply phase.

Keep the existing components and API utility. Add:

1. A submit-time check that trims the four text fields and checks the same
   post-trim limits as the server.
2. Visible field-specific feedback, such as **Facility name must contain
   1-120 characters after trimming**. Associate each message with its input
   using `aria-describedby` and mark invalid inputs with `aria-invalid`.
3. No POST when local validation fails. Preserve input so the participant
   can correct it. Clear obsolete feedback when the corrected form validates.
4. A normalized payload containing only the five input fields. Never send or
   calculate `risk_score` or `follow_up_action` in the form.
5. Existing successful-save reset, returned finding appended to the list,
   score/action confirmation, loading guard, and duplicate-submit protection.
   Keep failed-save input retention and visible API errors.

JavaScript string `.length` counts UTF-16 code units, unlike Python's code-point
count. Use `Array.from(value).length` for these checks. Native `maxLength` uses
code units and measures untrimmed input, so it cannot be the acceptance oracle
for this contract. Do not truncate data silently.

Keep JSX text rendering; do not use `dangerouslySetInnerHTML`. Leave server
HTTP 422 field-detail parsing in [api.ts](../client/src/api.ts) for Module 3.
Do not duplicate the risk rule table in frontend code.

Run from the repository root in the check terminal:

```powershell
npm --prefix .\client run build
```

Expected: TypeScript succeeds and Vite builds the bundle. No frontend test
suite exists yet; a successful build does not prove the UI flow.

**Stop and verify**

- In the browser, enter spaces for Facility name and otherwise valid data.
  Save: a field message appears, values remain, and no finding is added.
- Correct the name to `  Demo Facility  ` and select High. Save: the
  displayed/stored name is `Demo Facility`, score is **80**, and follow-up is
  **Prioritize immediate review**.
- Confirm the form resets only after success; refresh the browser and verify
  the saved finding remains listed.
- Confirm the shallow-validation TODO is resolved, not merely deleted.

### D. Verify the slice through the API and browser (7 minutes)

Run these PowerShell commands in the repository-root check terminal with
FastAPI running. They use the actual HTTP API, not a mocked scoring helper:

```powershell
$base = "http://127.0.0.1:8000"
$payload = @{
    inspector_id = "  INS-002  "
    facility_name = "  Demo Facility  "
    inspection_type = "  Routine  "
    severity = "medium"
    notes = "  Synthetic finding: follow-up needed.  "
}
$before = @(Invoke-RestMethod -Uri "$base/findings")
$created = Invoke-RestMethod -Uri "$base/findings" -Method Post `
    -ContentType "application/json" -Body ($payload | ConvertTo-Json)
if ($created.inspector_id -ne "INS-002" -or
    $created.facility_name -ne "Demo Facility" -or
    $created.inspection_type -ne "Routine" -or
    $created.notes -ne "Synthetic finding: follow-up needed." -or
    $created.severity -ne "medium" -or
    $created.risk_score -ne 50 -or
    $created.follow_up_action -ne "Schedule follow-up inspection") {
    throw "Normalized create response does not match the contract."
}
$after = @(Invoke-RestMethod -Uri "$base/findings")
if ($after.Count -ne ($before.Count + 1)) {
    throw "Create did not add exactly one finding."
}
$created | Format-List
```

Now bypass the UI with a whitespace-only facility name:

```powershell
$payload.facility_name = "   "
$status = 0
try {
    $null = Invoke-WebRequest -Uri "$base/findings" -Method Post `
        -ContentType "application/json" -Body ($payload | ConvertTo-Json)
} catch {
    if ($null -eq $_.Exception.Response) { throw }
    $status = [int]$_.Exception.Response.StatusCode
}
if ($status -ne 422) { throw "Expected HTTP 422; observed $status." }
$afterInvalid = @(Invoke-RestMethod -Uri "$base/findings")
if ($afterInvalid.Count -ne $after.Count) {
    throw "Rejected request changed stored findings."
}
"Verified: invalid input returned 422 and did not add a finding."
```

In the UI, click **Refresh findings** to retrieve the API-created entry. Verify
the medium score/action, then create a low-severity entry and confirm **20**
and **Routine follow-up**. Together with step C, all three severity outputs
have now been observed.

**Stop and verify**

- A direct request cannot bypass the new text validation.
- The UI lists a finding created outside the UI, proving the GET path.
- All three exact score/action pairs are visible or recorded.
- A backend reload did not invalidate your before/after comparison. If it did,
  rerun the checks without editing backend files between requests.

### E. Record the handoff (3 minutes)

In [requirements.md](../requirements.md), record the criteria implemented in
this module and the commands/manual evidence you actually observed. Keep
unknown-field rejection, server-error mapping, exhaustive edge cases, and
automated UI testing marked incomplete or unverified as appropriate.

Use Prompt 5 for a bounded summary, then complete the retrospective.
Keep both servers running for [Module 3](3-security-review.md).

**Stop and verify**

- The handoff identifies remaining work instead of declaring everything done.
- Each claimed success has a real command result or specific browser observation.
- Application changes are limited to the feature slice and its focused test.

## 4. VS Code + GHCP prompts to run

Use question-only Chat for explanation. Allow edits only after approving the
file scope and expected behavior. Repeat this loop for each sub-step, not once
for the entire app.

### Prompt 1 - Plan the bounded slice

Attach the requirements artifact, this module page, and the implementation files.

```text
Do not edit files. Compare Module 1 requirements with the current create/list
starter. Plan only the Module 2 slice: strict text types, normalization and
length checks in the backend, matching frontend validation and feedback,
and one normalization regression test. Preserve scoring, routes, and UI flow.
List existing behavior, changes by file, verification steps, and deferred
Module 3/4 work. Do not rebuild the app or add dependencies.
```

Expected: a short `File | Change | Criterion IDs | Verification` table, not code
for a replacement application.

### Prompt 2 - Backend: explain, then apply

```text
Do not edit yet. Explain the smallest changes to server/models.py and
server/test_app.py for strict required strings, trimming before length checks,
and the Module 1 text limits. Preserve exact severity and risk rules.
Describe the normalization test's full expected response and list assertions.
Leave unknown-field rejection for Module 3. Identify risks in validator ordering.
```

After reviewing the explanation:

```text
Apply only the approved backend model and normalization-test changes.
Reuse the fixture and preserve existing API/scoring behavior.
Do not edit frontend files or add dependencies. Summarize the diff and
give the focused pytest command; do not claim success without running it.
```

### Prompt 3 - Frontend: explain, then apply

```text
Do not edit yet. Explain a small change to FindingForm.tsx that enforces the
reviewed Module 1 text rules using code-point lengths, associates field errors
with inputs, and submits only normalized input fields. Preserve App.tsx's
server-returned scoring/list flow and failed-save input retention.
Leave API validation-detail mapping for Module 3. Name any other file that
must change and justify it before proposing that edit.
```

After reviewing the explanation:

```text
Apply only the approved frontend changes. Keep strict types, safe JSX text
rendering, and the existing API utility; do not duplicate risk logic.
Do not silently truncate text or use native maxLength as the validation oracle.
Summarize the diff and list the build command and manual browser checks.
```

### Prompt 4 - Repair a failed check

Attach only the relevant changed files and the actual failing output.

```text
Do not edit yet. Here is the exact failing check and output: [paste output].
Expected behavior: [paste criterion and expected result].
Identify the smallest likely cause in the attached code and explain a
targeted fix. Do not weaken the criterion, remove assertions, suppress type
errors, or reinstall packages unless the failure proves a missing dependency.
Wait for approval before applying the fix.
```

Expected: evidence-backed cause, bounded fix, and the same command or browser
check to rerun. If the cause is uncertain, Copilot should say what evidence is
missing rather than invent it.

### Prompt 5 - Summarize the handoff

Attach the requirements artifact, changed files, and your verification results.

```text
Do not edit application code. Summarize Module 2 by criterion ID:
implemented changes, actual verification evidence, and deferred or unverified
work for Modules 3/4. Distinguish a passing build from behavior proven in tests
or the browser. Do not declare the full feature definition of done satisfied.
```

Expected: `Criterion ID | Change | Evidence | Remaining work` table you can
review and record in the requirements artifact.

## 5. Checkpoint

Show your partner or facilitator:

- A reviewed backend model diff and frontend validation/feedback diff.
- Passing original tests plus the normalization regression test.
- A passing client TypeScript/production build.
- A normalized create/list flow with exact low/medium/high score/action results.
- A direct invalid POST returning 422 without adding a finding.
- Field-specific local feedback, successful-save reset, and GET results after
  browser refresh.
- Updated requirements status and an honest Module 3/4 handoff.

This checkpoint proves the selected slice, not production readiness or complete
security. Server error details and other review findings remain for Module 3.

## 6. Retrospective checklist

- [ ] I can trace my change from input through API validation to displayed output.
- [ ] I reviewed an explanation before approving each bounded edit.
- [ ] I inspected the actual code instead of accepting Copilot's summary blindly.
- [ ] I verified behavior after every major sub-step, not only at the end.
- [ ] I can explain why risk scoring belongs on the server.
- [ ] I can explain the code-point versus UTF-16 length mismatch.
- [ ] I preserved previously working behavior and can show regression evidence.
- [ ] I can identify incomplete criteria and explain why the full definition of
      done has not been met yet.
- [ ] I discussed one giant-prompt or blind-acceptance trap with a partner.

## 7. Common traps

| Trap | Concrete guardrail |
| --- | --- |
| One-shot giant prompt: "Implement and secure the whole tracker" | Split backend, frontend, and verification into separately reviewed diffs. Limit files and criteria in every prompt. |
| Blind acceptance because generated code looks polished | Inspect the diff, compare it with the criterion, and run the exact check before proceeding. |
| Rebuilding a flow that already exists | Preserve the starter's routes, scoring helper, API utility, and components; implement only identified gaps. |
| Trimming after enforcing length or silently coercing types | Validate the normalized string and reject non-strings; test the exact returned text. |
| `.length` or native `maxLength` treated as code-point validation | Use code-point counting and post-trim checks; preserve valid Unicode input. |
| Calculating score in React to make the demo work | Display the API-returned score/action; do not send trusted output fields in POST. |
| Mistaking an in-memory reset for a broken GET flow | Backend edits/restarts clear data. Finish reload before creating findings or comparing list counts. |
| A green build used as UI test evidence | Also run the browser create/list and rejection checks; add automated UI coverage in Module 4. |
| Fixing failures by changing criteria or deleting assertions | Repair the implementation against the reviewed contract, then rerun the same check. |
| Declaring all hardening complete | Record remaining unknown-field, error-mapping, and coverage work explicitly for the next modules. |
