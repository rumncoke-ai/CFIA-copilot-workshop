# Module 4 - Testing and confidence checks

## 1. Objective

**Timebox: 20 minutes.** Turn the reviewed
[acceptance criteria](../requirements.md) and
[Module 3 findings](3-security-review.md) into local regression tests.

Cover three layers:

- Risk scoring logic: exact score and follow-up for each severity.
- API behavior: validation, response contract, and no storage change on rejection.
- One automated UI happy path: load, enter, save, confirm, and list a finding.

Add **at least one new edge-case test**, beyond tests added in Modules 2/3.
Do not generate tests solely by copying what the implementation currently does.

## 2. Why this matters in real SDLC

A test needs an independent oracle: the reviewed expected behavior. If Copilot
derives both implementation and expected values from the same code, it can
preserve the same mistake twice.

For the inspection team, "high returns 80 and Prioritize immediate review" and
"an invalid request does not add a finding" are meaningful assertions.
"The response contains something" is not enough.

Passing tests prove the cases they exercise. Sufficient confidence also depends
on coverage of relevant risks, meaningful assertions, integration evidence,
and honest treatment of untested behavior.

## 3. Tasks

### A. Map criteria to test evidence (2 minutes)

Open [requirements.md](../requirements.md) before the implementation.
Run Prompt 1 and review this minimum test map:

| Criteria | Test layer and oracle |
| --- | --- |
| F-03 / V-04 | Parameterized risk unit test: `low` -> `(20, "Routine follow-up")`, `medium` -> `(50, "Schedule follow-up inspection")`, `high` -> `(80, "Prioritize immediate review")`. |
| F-01 / F-02 | API tests: full normalized POST 201 object, GET 200 array, creation order, empty list, and allowed duplicate submissions. Preserve earlier normalization coverage. |
| F-05 / V-01 through V-05 | API tests: invalid field types/values return 422 and leave the stored list unchanged; valid boundaries return 201. |
| Unknown-field rule | Preserve Module 3 rejection tests for extra score, action, and unrelated fields. |
| F-04 | UI test: initial GET, form submission, exact POST payload, returned score/action, new list entry, and form reset. |
| New edge case | Notes with 1000 Unicode code points accepted, 1001 rejected; verify outer trimming and preserved internal text. |

Record additional NF-01/NF-02/NF-03 evidence from Module 3 separately.
One mocked UI test cannot establish safe handling of every input, real network
failures, or backend restart behavior.

**Stop and verify:** each planned test names criterion IDs, concrete input,
and expected output from the requirements, not from a production constant.

### B. Generate and refine backend tests (7 minutes)

Run Prompt 2 with the criteria, [risk.py](../server/risk.py),
[app.py](../server/app.py), [models.py](../server/models.py), and
[test_app.py](../server/test_app.py).

Keep the tests in the existing [test_app.py](../server/test_app.py) for this lab.
Reuse its client fixture so API state is cleared before and after each test.
TestClient uses the real FastAPI app in process; no running Uvicorn is required.

1. Add a parameterized unit test of `calculate_risk`. Write expected tuples
   explicitly; do not read expected values from `RISK_RULES`.
2. Preserve earlier happy-path, normalization, and unknown-field tests.
   Add creation-order and duplicate-submission assertions if absent.
3. Parameterize API rejection cases: omitted, `null`, numeric, empty, and
   whitespace-only text; invalid severities `High`, `critical`, and `" high "`;
   each text field one code point over its maximum.
4. For rejection tests, seed one valid finding, capture GET, submit the invalid
   request, and assert both HTTP 422 and the **full unchanged GET list**.
   Assert the error identifies the offending field, without depending on an
   entire framework-version-specific error message.
5. Test valid maximum lengths for all four free-text fields with other fields
   valid. Compare normalized values in both POST and GET.

**Required new edge case:** use Python `"\U0001F642" * 1000` for notes in an
otherwise valid payload. Wrap it in outer spaces; the API must accept it and
return exactly the 1000-code-point text after trimming. With 1001 copies, it
must reject the request and preserve the prior list.

This catches byte/code-unit counting and validation-before-trimming mistakes
that ordinary ASCII examples miss. Keep internal whitespace preservation as
another explicit assertion or case.

Run from a repository-root PowerShell check terminal:

```powershell
.\.venv\Scripts\python.exe -m pytest .\server\test_app.py -q
```

Expected: all original and new cases pass. The exact count depends on your
parameterization; do not use the old "2 passed" as this module's target.

**Stop and verify:** inspect assertions before accepting generated tests.
They must compare exact outputs and unchanged state, not merely assert that
requests return a response.

### C. Add one automated UI happy path (6 minutes)

The starter currently has build/typecheck commands, but **no UI test runner**.
Use Vitest, jsdom, and React Testing Library for a fast local component flow.
This is a browser-like DOM test, not a real-browser end-to-end test.

From the repository root:

```powershell
npm --prefix .\client install --save-dev vitest jsdom `
    @testing-library/react @testing-library/user-event
```

This intentionally adds test dependencies. Retain the updated package manifest
and lockfile; subsequent setup can use `npm ci`.

Run Prompt 3. Ask Copilot to make only these changes:

- In [client/package.json](../client/package.json), add `"test": "vitest run"`.
  Keep dev, typecheck, and build scripts intact.
- In [vite.config.ts](../client/vite.config.ts), use `defineConfig` from
  `vitest/config` and add `test: { environment: "jsdom" }`.
  Preserve the existing host, port, and API proxy.
- Create a colocated `client/src/App.test.tsx` importing `describe`, `it`,
  `expect`, `vi`, and `afterEach` explicitly from Vitest.
  No global test APIs, snapshot-only checks, or extra matcher packages are needed.

The single happy-path test should:

1. Render the real [App](../client/src/App.tsx) and its form, keeping the real
   [API utility](../client/src/api.ts).
2. Stub only `fetch` with `vi.stubGlobal`. Initial GET returns `[]`; POST returns
   the explicit Module 1 high-severity expected object; subsequent GET returns
   that object in an array. Use real `Response` objects with JSON content.
3. Fill Inspector ID, Facility name, Inspection type, Severity, and Notes
   through labels using `userEvent.setup()`. Await all interactions.
4. Select **Save finding** and assert exactly one POST, its parsed JSON body,
   and its content-type header. The body contains only the five input fields.
5. Assert the saved confirmation and list show **80** and
   **Prioritize immediate review**, and the form clears.
6. Select **Refresh findings** and verify another GET and the existing entry.
   This is the App's refresh control, not a full browser reload.

Use `findByRole` or `waitFor` for asynchronous changes; no fixed sleeps.
Scope assertions to the saved status and findings region to avoid ambiguous
matches when the score appears twice. Use ordinary Vitest assertions on text,
input values, and counts; do not use `toBeInTheDocument` without its matcher setup.

Clean up with React Testing Library `cleanup()` and `vi.unstubAllGlobals()` in
`afterEach`. Keep stubbed findings inside the test so tests cannot share state.
Do not mock `calculate_risk` or duplicate its algorithm in the fetch stub:
return a fixed contract example.

Run from the repository root:

```powershell
npm --prefix .\client test
npm --prefix .\client run build
```

Expected: the UI test passes and the TypeScript/Vite build still succeeds.
The UI test does not need either dev server running.

**Stop and verify:** the test traverses form -> real API utility -> stubbed
HTTP response -> displayed finding, not a mocked component that skips the flow.
Label its mocked-network boundary explicitly.

### D. Interpret failures and check real integration (3 minutes)

If a check fails, use Prompt 4 with the exact output:

| Failure | What to do before changing code |
| --- | --- |
| Import, runner, or environment error | Check the working directory, virtual environment, npm manifest, and jsdom configuration. This is not yet behavioral test evidence. |
| Wrong score/action | Compare with the Module 1 explicit oracle. Repair production scoring if wrong; do not derive expectations from the implementation. |
| Invalid input accepted or list changed | Inspect model validation and append ordering. Keep the 422/no-change assertion. |
| UI cannot find a control or async result | Check labels, selector scope, awaited user events, and stub responses before changing app behavior. |
| UI test passes but real requests fail | The fetch stub did not exercise the live proxy/API. Check both servers and the real network response. |
| Warning with passing tests | Read its source and impact. Record relevant warnings; do not suppress them or call them failures without evidence. |

After a targeted fix, rerun the same focused command. Do not remove assertions,
skip failing cases, or alter criteria merely to get green output.

With both local servers running, open `http://127.0.0.1:5173`, save one synthetic
high-severity finding, verify score/action, then reload the browser and confirm
GET retrieves it. This live smoke check complements the mocked UI test.

**Stop and verify:** separate setup failures, product failures, flawed tests,
and warnings. Record real integration evidence separately from mocked tests.

### E. Record confidence and remaining gaps (2 minutes)

Add a **Module 4 test evidence** section to
[requirements.md](../requirements.md):

`Criterion IDs | Test/check | Expected behavior | Actual result |
Boundary exercised | Remaining gap`

Include the new edge case, commands, passing results, and live smoke result.
Check every in-scope criterion against the accumulated Module 2/3/4 evidence.
If a criterion lacks evidence, keep it unverified and record a concrete follow-up.
Do not declare the full definition of done satisfied just because all current
tests pass.

Complete the retrospective and proceed to [Module 5](5-retrospective.md).

## 4. VS Code + GHCP prompts to run

### Prompt 1 - Derive tests from criteria

Attach the reviewed requirements and Module 3 findings first.

```text
Do not edit files. Create a test matrix from our acceptance criteria, not
from implementation details. Cover exact risk tuples, create/list behavior,
API validation and unchanged storage, one UI happy path, and a new Unicode
length-boundary edge case. Assign criterion IDs, inputs, explicit oracles,
test layers, and known coverage gaps. Do not invent new requirements.
```

Expected: `Criterion IDs | Case | Input | Expected result | Layer | Gap` table.

### Prompt 2 - Generate bounded backend tests

Attach the approved matrix, backend files, and existing tests.

```text
Add only the reviewed tests to server/test_app.py. Reuse the isolated client
fixture and preserve existing tests. Parameterize explicit risk expectations,
validation inputs, length boundaries, and unchanged-list assertions.
Add the required 1000/1001 Unicode-code-point notes case with outer trimming.
Do not import production constants as expected results, weaken criteria,
or modify implementation silently. Explain each test's criterion coverage.
```

Expected: a test-only diff with exact behavioral assertions and a coverage map.
If a test fails, investigate before approving any implementation change.

### Prompt 3 - Add the UI runner and happy-path test

Attach this module page, client manifest/configuration, App, form, and API utility.

```text
Configure only the approved Vitest/jsdom runner and one App.test.tsx happy-path
test described in Module 4. Preserve Vite's proxy and existing npm scripts.
Keep real App/form/API code; stub fetch with fixed contract JSON Responses.
Assert the POST body, exact displayed score/action, form reset, list entry,
and GET refresh. Await user events and clean up global stubs after each test.
Use explicit Vitest imports and standard assertions; no snapshots or sleeps
as the only verification. Explain the mocked-network boundary.
```

Expected: a small runner/config/test diff and runnable npm commands.

### Prompt 4 - Diagnose a failed check

```text
Do not edit yet. This command failed: [command].
Actual output: [paste output].
Relevant criterion and expected result: [paste criterion].
Distinguish setup error, product defect, and incorrect test assumption.
Identify supporting evidence, propose the smallest fix, and give the command
to rerun. Do not skip tests, remove assertions, or change the oracle to match
current implementation. Wait for approval before editing.
```

Expected: evidence-backed diagnosis and a bounded repair, not a broad rewrite.

### Prompt 5 - Assess evidence, not just green results

Attach the criteria, tests, actual command output, and live smoke observations.

```text
Do not edit application code. Map actual test/check evidence to our criteria.
Explain what the risk, in-process API, mocked-network UI, and live smoke checks
prove separately. Identify remaining risks and missing assertions.
Do not equate passing tests, test count, or build success with sufficient
confidence or the full definition of done.
```

Expected: criterion evidence table plus concrete unverified cases.

## 5. Checkpoint

Show your partner or facilitator:

- Criteria-linked tests with independent expected values.
- Passing risk tests for all three exact score/action pairs.
- Passing API tests for valid input, rejection, and unchanged storage.
- **At least one new edge-case test**, including its acceptance/rejection oracle.
- One passing automated UI create/list happy path with an explicit network stub.
- Passing TypeScript/build and a successful live create/list smoke check.
- A saved evidence map identifying what remains untested.

The checkpoint is not a test-count target. Do not remove coverage markers
unless the gap they describe has actually been addressed.

## 6. Retrospective checklist

- [ ] I can show an expected result derived from a criterion, not implementation.
- [ ] I can explain why exact score and action assertions matter.
- [ ] I can explain what my new edge case catches that the happy path misses.
- [ ] I can distinguish a failing environment setup from a failing behavior.
- [ ] I can explain why the UI fetch stub does not prove live API integration.
- [ ] I can distinguish **passing tests** (the executed assertions passed)
      from **sufficient confidence** (relevant risks have meaningful evidence).
- [ ] I can name at least one untested behavior or limitation and its next check.
- [ ] I reviewed generated tests for weak assertions and circular expectations.
- [ ] I can justify which criteria are complete and which remain unverified.

## 7. Common traps

| Trap | Concrete guardrail |
| --- | --- |
| "Write tests for this code" without acceptance criteria | Attach the reviewed contract first and require criterion IDs and explicit oracles. |
| Expected values imported from the scoring table | Hardcode the agreed 20/50/80 tuples in parameterized tests. |
| Checking only HTTP 422 | Also compare the complete stored list before and after rejection. |
| Many tests with weak assertions | Inspect response values, POST payload, state changes, and boundaries; count is not confidence. |
| ASCII-only length tests | Add Unicode code-point boundaries and verify normalization order. |
| Mocking the whole UI or API utility | Render actual components and use the real utility; stub only HTTP and label that boundary. |
| Calling a jsdom test end-to-end | Describe it as a component flow and run a separate live browser smoke check. |
| Skipping failing tests to finish on time | Record the blocker and repair the smallest cause; do not claim the checkpoint passed. |
| Assuming green tests mean no remaining risk | Map evidence to criteria and document untested failures, inputs, and production limitations. |
