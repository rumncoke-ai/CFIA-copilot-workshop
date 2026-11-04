# Module 4 - Testing and confidence

## 1. Objective

**Suggested duration: 35 minutes.**

Expand evidence for the repaired workflow using unit/service tests, real
form/service integration, automated browser E2E, and scoped accessibility checks.
Do not postpone the first regression until here: keep Module 2's tests.

## 2. Why it matters

Copilot can reproduce the same mistake in implementation and tests. Agree on
expected outcomes before checking what the code currently does: blank names
should be rejected without storage changes, and corrected names should save normally.
A passing build, jsdom test, or axe scan proves only its own exercised checks.

## 3. Tasks

### A. Plan the missing evidence - Interactive

1. Attach the actual tests and provide your review decisions in Chat.
2. Select **Interactive** and paste:

```text
Do not edit. Map whitespace-only facility rejection, supplied safeguards, and
confirmed review findings to current tests. Return criterion, existing evidence,
missing case, concrete input,
expected output, and test file. Preserve earlier regressions.
Distinguish unit/service, jsdom integration, real-browser E2E, and manual checks.
Do not derive expected outputs from production constants or target a test count.
```

3. Inspect the proposal. Use **Plan** if scope decisions remain; approve only
   missing cases, not a rewrite of the test suite.

| Category | Example |
| --- | --- |
| Unit/service | Facility rule and direct service rejection before writes. |
| Integration | Real App/form/service flow with jsdom storage. |
| Browser E2E | Invalid submission, correction, save, full page reload. |
| Positive/negative | Padded valid name versus whitespace-only name. |
| Boundary | Empty-after-trim versus one visible Unicode code point. |
| Regression | Original blank-name defect must not return. |

These are overlapping descriptions, not six mutually exclusive test suites.
No new maximum length is part of this bug's contract.

### B. Extend focused unit/service and UI integration tests

1. Keep the existing Vitest/jsdom setup. Use **Interactive**, or Autopilot for an
   explicitly approved bounded batch, and paste:

```text
Add only the reviewed missing whitespace-regression tests. Preserve existing tests.
Service cases: whitespace-only facility rejects with field-identifying feedback;
full serialized storage stays unchanged; absent storage stays absent on rejection;
padded valid facility is trimmed; internal spaces and Unicode are preserved.
Assert the complete normalized result/read-back and literal 80 /
Prioritize immediate review for high severity, not imported expected constants.
UI cases: use the real App, form, service, and jsdom storage. Check associated
field feedback, invalid state, retained values, no successful rejected attempt,
then correction/retry. Do not mock away the feature under test.
Await interactions, isolate state, restore spies, and run the focused tests.
Do not add other-field limits or weaken assertions to match the code.
```

2. From a second PowerShell terminal at repository root, verify:

```powershell
npm.cmd --prefix .\client test -- src\findings.test.ts src\App.test.tsx src\risk.test.ts
```

3. Retain the existing scoring, failure/retry, duplicate, seed, and reset evidence.
   Add a pure helper unit test only if the implementation actually has that helper.

### C. Exercise the real browser

1. The facilitator prepares Chromium before the session; see the
   [facilitator guide](../instructor/facilitator-guide.md#browser-test-preparation).
   Do not spend this module configuring another test runner.
2. Open [playwright.config.ts](../client/playwright.config.ts) and
   [starter.spec.ts](../client/e2e/starter.spec.ts). The supplied tests exercise
   existing behavior; they do not already solve or test the intentional bug.
3. Paste this approved test-generation prompt:

```text
Add client/e2e/facility-validation.spec.ts using the existing Playwright config.
Use fresh browser contexts, the real app/service, and accessible locators.
With other fields valid, submit three spaces for facility. Assert associated
feedback and aria-invalid, retained inputs, no save confirmation for that
attempt, and exactly unchanged serialized app storage.
Correct the name to "  Demo Facility  ", save, assert normalized display,
80 / Prioritize immediate review, and cleared form. Reload the full page and
verify the normalized record remains. Preserve the baseline reset scenario.
Do not use fixed sleeps, backend mocks, shared test state, or source-code imports
as expected browser output. Scope repeated text to the saved status/list.
Run the new scenario and report actual output. Stop before unrelated fixes.
```

4. Run the new scenario, then the full browser suite:

```powershell
npm.cmd --prefix .\client run test:e2e -- e2e/facility-validation.spec.ts
npm.cmd --prefix .\client run test:e2e
```

5. Playwright starts and stops its own Vite server on **127.0.0.1:5174**.
   The participant app on **5173** has separate browser storage. Do not expect
   manual records to appear in isolated test contexts.
6. If 5174 is occupied, stop and identify the owning process with the facilitator;
   do not kill unrelated processes or silently reuse an unknown server.

### D. Use a reusable accessibility-testing prompt

1. Inspect the unchanged [supplied prompt](../.github/prompts/accessibility.prompt.md).
   It demonstrates reusable prompt structure, but targets WCAG 2.1, generates
   broad output, and executes only Perceivable checks in its final step.
2. Read its [documented limitations](../.github/workshop-customizations.md).
   Do not run that full recipe uncritically: decorative `alt=""` can be correct,
   and a DOM URL is not a source-code line reference.
3. Select the standard agent in **Interactive**. Invoke
   `/workshop-accessibility-tests`, the separate tracker-scoped companion prompt.
   If slash discovery is unavailable, open the
   [companion file](../.github/prompts/workshop-accessibility-tests.prompt.md)
   and paste its body. Review its coverage proposal before authorizing test edits.
4. Add approved checks in the existing browser suite for initial, invalid, and
   corrected-success states. Include axe checks plus explicit error association,
   keyboard operation, and focus assertions where appropriate. Do not create
   another Playwright configuration or claim all WCAG criteria are automated.
5. Map assertions to applicable **WCAG 2.2 AA** criteria; record inapplicable and
   manual-only checks separately. A zero-violation scan is not full conformance.
6. Run the accessibility file and full suite. Generated accessibility cases must
   extend `accessibility.spec.ts` or use `*.accessibility.spec.ts` naming:

```powershell
npm.cmd --prefix .\client run test:a11y
npm.cmd --prefix .\client run test:e2e
```

7. Inspect failure details and the HTML report:

```powershell
npm.cmd --prefix .\client run test:e2e:report
```

   Stop the report server with **Ctrl+C** afterward. Traces are retained on
   failures; axe JSON is attached to the supplied baseline test report.

### E. Record confidence honestly

1. Run the final existing suite and production build:

```powershell
npm.cmd --prefix .\client test
npm.cmd --prefix .\client run build
```

2. Record exact commands and observed results in Chat or your own notes.
   Distinguish failures and unverified checks from passes.
3. Manually check keyboard correction/retry and visible focus. Perform screen-reader,
   zoom, and contrast checks only with appropriate tools; otherwise mark them
   unverified. Do not claim browser tests verified assistive-technology behavior.

## 4. Checkpoint

- Keep Module 2's regression and add missing contract evidence.
- Pass the relevant Vitest tests, real-browser journeys, scoped accessibility
  checks, and build separately.
- Show actual browser reload and reset evidence, not only component remounts.
- Identify remaining manual checks and limitations without claiming complete
  security, accessibility conformance, or trustworthy client-side scores.

## 5. Retrospective

- Which test would catch the original bug returning?
- What did the browser reveal that jsdom could not?
- Which accessibility checks still need human evaluation?

**Next: [Module 5 - Retrospective and operational reuse](5-retrospective.md).**
