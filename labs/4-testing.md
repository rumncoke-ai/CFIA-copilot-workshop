# Module 4 - Build confidence with tests

## 1. Objective

**Suggested duration: 35 minutes.**

Agree on what the app should do, then use Copilot to build coverage at three
levels: **unit, integration, and browser**. Finish with actual results and a
clear list of remaining gaps.

**This module works standalone.** You do not need earlier modules, a previous
requirements document, review findings, or the Module 2 bug fix.

## 2. Why it matters

A useful test checks an agreed outcome, not just whatever the code currently
returns. Start with a small contract, reuse existing tests, and add missing cases.
More tests are not automatically better tests.

| Level | What it checks here |
| --- | --- |
| Unit | A small piece of logic, such as severity-to-score calculation. |
| Integration | The form, App, local service, and storage working together in jsdom. |
| Browser | A user journey in real Chromium, including a full page reload. |

The app is a React inspection findings tracker with browser localStorage.
There is no backend or API to configure. Use synthetic data only.

## 3. Tasks

### A. Agree on the contract

1. Select **Interactive** in Copilot's Agent mode picker. Paste:

```text
Act as a QA engineer. Do not edit application code or tests yet.
Read client/src and client/e2e, including the existing tests.
Create labs/04-test-plan.md from scratch: a small behavior contract with
requirement IDs and concrete inputs/expected results. Map each requirement to
existing or proposed unit tests, integration checks, and browser/manual checks.
Mark a level not applicable when appropriate; do not test everything three times.

Cover severity scoring, valid save/list, facility-name normalization,
persistence, failed-save retention/retry, and cancelled/confirmed reset.
Use literal expected score/action pairs:
low = 20 / Routine follow-up
medium = 50 / Schedule follow-up inspection
high = 80 / Prioritize immediate review
Include normal, edge, and invalid cases supported by the agreed behavior.
Separate intended behavior from current implementation and identify missing cases.
Do not invent new field limits, APIs, or validation rules.

Whitespace-only facility acceptance is an intentional starter defect.
Record it as a known gap if present; do not fix it or make this lab depend on it.
Preserve any earlier fix and tests. Stop for my review of the contract.
```

2. Review the small mapping before asking for tests. Expected results should
   make sense independently of the implementation. Keep the known whitespace
   defect separate: this lab does not repeat Module 2's regression exercise.

### B. Add unit coverage

1. Read [risk.test.ts](../client/src/risk.test.ts) and
   [findings.test.ts](../client/src/findings.test.ts). All three scoring pairs
   already have tests; local-service tests also cover storage and validation.
2. Paste:

```text
Use the reviewed labs/04-test-plan.md. Add only missing unit/local-service tests
to the existing Vitest suite; preserve existing tests.
Use independent expected values, meaningful assertions, and isolated storage.
Consider whether changing a returned scoring object affects a later calculation,
and whether low/medium findings save and read back with the exact score/action.
Include applicable edge and invalid cases from the contract without inventing
unsupported inputs for typed functions. Do not duplicate existing coverage or
import production constants to calculate expected results.
Run the relevant tests and report actual results. Do not change application code,
add packages, weaken assertions, or repair the known whitespace defect.
```

3. Verify from repository root:

```powershell
npm.cmd --prefix .\client test -- src\risk.test.ts src\findings.test.ts
```

### C. Add integration coverage

1. Read [App.test.tsx](../client/src/App.test.tsx). It already tests real
   form/service saves, retry, normalization, and reset.
2. Paste:

```text
Use labs/04-test-plan.md to add missing integration coverage in
client/src/App.test.tsx using the existing Testing Library setup.
Exercise the real App, form, local service, and jsdom storage together.
For example, cover a missing low/medium severity workflow with its literal
score/action, visible saved finding, persisted record, and cleared form.
Reuse existing failure/retry and reset coverage rather than duplicate it.
Await interactions, isolate state, restore spies, and do not mock away the
workflow being tested. Run the tests and report actual results.
Preserve application behavior, earlier fixes, and all existing assertions.
```

3. Verify:

```powershell
npm.cmd --prefix .\client test -- src\App.test.tsx
```

These are integration tests in jsdom, not proof that Chromium works.

### D. Test the browser and report evidence

1. Read [starter.spec.ts](../client/e2e/starter.spec.ts) and
   [accessibility.spec.ts](../client/e2e/accessibility.spec.ts).
   Save/reload/reset and an initial-page axe scan are already supplied.
2. Paste:

```text
Use labs/04-test-plan.md to add only missing browser coverage using the existing
Playwright configuration. Test the real app with fresh browser contexts and
accessible locators. Cover a missing valid severity journey: save, assert the
literal score/action and normalized name, reload, and verify the saved record.
Preserve the supplied cancelled/confirmed reset scenario. No fixed sleeps,
backend mocks, new runners, or whitespace-bug repair.

Keep accessibility simple: reuse the initial axe scan, add a scan after a valid
save in client/e2e/accessibility.spec.ts, and check keyboard access to the form.
Retain the existing rule tags and attach scan results as the baseline does.
Run the browser suite. Report actual commands and results.
Do not claim mobile, screen-reader testing, or WCAG conformance.
```

3. Run the final checks:

```powershell
npm.cmd --prefix .\client test
npm.cmd --prefix .\client run build
npm.cmd --prefix .\client run test:e2e
```

   Playwright starts and stops its own server on **127.0.0.1:5174**.
   Browser contexts have separate storage from your manual app.
   If that port is occupied, identify the owner; do not reuse an unknown server.
   To rerun only accessibility checks, use
   `npm.cmd --prefix .\client run test:a11y`.
4. For a short manual check, run `npm.cmd --prefix .\client run dev`, open
   [the app](http://127.0.0.1:5173), and use Tab/Shift+Tab to reach the fields and
   save button. Check visible focus and keyboard operation with synthetic data.
   Stop the server with **Ctrl+C**. Mark this check unverified if not performed.
5. Ask Copilot to update the same test plan with requirement coverage, actual
   passed/failed counts, commands run, known defects, and remaining gaps.
   Coverage percentages are optional: no coverage reporter is configured in the
   starter, so report unavailable rather than invent numbers or add tooling.
   Investigate unexpected failures without weakening assertions. If a fix is
   needed, review it separately and rerun affected checks; do not silently
   expand this exercise into application repairs.

## 4. Checkpoint

- One reviewed contract maps requirement IDs to existing and added evidence.
- Unit, integration, and real-browser checks have separately recorded results.
- Browser evidence includes a real reload, not only a component remount.
- Accessibility includes a scoped axe check and an honest keyboard-check result.
- Known defects and unperformed checks are visible. A passing axe scan is not
  full accessibility conformance, and no browser result is claimed without a run.

## 5. Retrospective

- What did the contract clarify before tests were generated?
- What did the browser check that unit and integration tests could not?
- Which remaining gap would you test next?

**Next: [Module 5 - Retrospective and operational reuse](5-retrospective.md).**
