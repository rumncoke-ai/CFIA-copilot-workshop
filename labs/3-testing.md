# Module 3 - Build confidence with tests

## 1. Objective

**Suggested duration: 35 minutes.**

In this module, we'll help prepare the Inspection Findings Tracker for its next
release as developers responsible for validating the application. We'll review
the existing tests, identify gaps in coverage, and use GitHub Copilot to
strengthen the testing process. We'll:

1. Review existing tests and identify missing coverage.
2. Generate meaningful unit tests for the application's business logic.
3. Demonstrate why passing tests don't always guarantee correct behavior.
4. Extend integration tests to check complete application workflows.
5. Validate application behavior through browser and accessibility testing.
6. Review actual test results and identify remaining gaps.

We'll finish with an understanding of how different types of tests work together
and why AI-generated tests still need human verification.

**This module works standalone.** We won't need to complete earlier modules,
create a previous requirements document, produce review findings, or implement
the Module 2 bug fix.

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

### Testing environment

**Preferred path:** We'll complete all activities, including Playwright browser
testing and axe accessibility checks.

**Restricted environment:** If Playwright or browser automation is unavailable,
we'll complete the unit and integration exercises, then follow the
[restricted-environment alternative](#restricted-environment-alternative).

Our goal is to understand testing and verification, not to bypass organizational
security restrictions.

## 3. Tasks

### A. Review existing tests and define expected behavior

Before writing new tests, we'll review what's already covered and use Copilot
to create a small testing plan based on the application's expected behavior.

#### Step 1: Review existing tests

Open these files in VS Code:

- [risk.test.ts](../client/src/risk.test.ts)
- [findings.test.ts](../client/src/findings.test.ts)
- [App.test.tsx](../client/src/App.test.tsx)
- [starter.spec.ts](../client/e2e/starter.spec.ts)

Take a moment to identify:

1. Which application behaviors are already tested?
2. What types of tests exist?
3. Are there important behaviors that aren't covered?

We won't need to understand every assertion yet.

#### Step 2: Create a testing plan with Copilot

1. Open GitHub Copilot Chat.
2. Select **Interactive** in the **Agent mode** picker.
3. Paste this prompt:

```text
Act as a QA engineer. Do not edit application code or tests yet.
Review the existing tests in client/src and client/e2e.

Create labs/03-test-plan.md containing a concise testing plan that:

1. Identifies the application's expected behaviors.
2. Maps each behavior to existing unit, integration, or browser tests.
3. Identifies meaningful gaps in coverage.
4. Includes concrete inputs and expected results.

Cover severity scoring, saving and displaying findings, facility-name
normalization, persistence after reload, failed-save retention and retry,
and cancelled and confirmed reset.

Use these expected scoring rules:
low = 20 / Routine follow-up
medium = 50 / Schedule follow-up inspection
high = 80 / Prioritize immediate review

Use requirement IDs and distinguish expected behavior from the current
implementation. Include normal, edge, and invalid cases supported by the
existing requirements. Do not invent validation rules, APIs, or field limits.

If the whitespace-only facility-name issue exists, record it as a known gap.
Do not fix it or make this exercise depend on it. Preserve earlier fixes
and tests.

Keep the plan short and easy to review. Do not test every requirement at every
level. Stop for my review before implementing anything.
```

#### Step 3: Review the testing plan

Review the generated `labs/03-test-plan.md`. Confirm that:

- Expected results match the application's business rules.
- Existing tests aren't unnecessarily duplicated.
- Missing coverage is clearly identified.
- Each proposed test has a meaningful purpose.

**Checkpoint:** We should now have a reviewed plan identifying existing coverage
and at least two meaningful areas worth investigating.

### B. Strengthen unit test coverage

With the plan reviewed, we'll use Copilot to add meaningful tests for the core
business logic and local service without duplicating existing coverage.

#### Step 1: Generate missing tests

Review [risk.test.ts](../client/src/risk.test.ts) and
[findings.test.ts](../client/src/findings.test.ts). All three scoring pairs
already have tests; local-service tests also cover storage and validation.

Paste this prompt:

```text
Use the reviewed labs/03-test-plan.md. Add only missing unit or local-service
tests to the existing Vitest suite. Preserve all existing tests.

Focus on meaningful gaps, including:
- Whether changing a returned scoring object affects later calculations.
- Whether low and medium findings save and load with the correct score/action.
- Applicable edge and invalid cases identified in the plan.

Use independent expected values and meaningful assertions. Do not duplicate
existing coverage or calculate expected results using production constants.
Do not invent unsupported inputs for typed functions.
Keep storage isolated between tests.

Do not change application code, add dependencies, weaken assertions, or repair
the known whitespace issue. Run the relevant tests and report actual results.
```

#### Step 2: Review the generated tests

Before accepting the changes, inspect the assertions:

1. What behavior is each test checking?
2. What result does it expect?
3. Would it fail if the application returned an incorrect result?

#### Step 3: Run the tests

From the repository root:

```powershell
npm.cmd --prefix .\client test -- src\risk.test.ts src\findings.test.ts
```

Review the actual results.

**Checkpoint:** We should now be able to explain why each new test matters and
what behavior its assertions verify.

### C. Evaluate tests with Copilot

Copilot has helped us add tests. Before accepting them, we'll review what they
prove and whether incorrect behavior could still pass. Then we'll use a
controlled experiment to compare weak and meaningful assertions. This is a
general testing principle, not a limitation unique to AI-generated tests.

#### Step 1: Review the tests we added

Paste this prompt:

```text
Review the tests added in Task B. Do not edit anything yet.

For each new test:
1. Identify the requirement it verifies.
2. Explain what its assertions actually prove.
3. Identify incorrect behavior that could still pass, if any.
4. Assess whether that behavior is within this test's intended scope.

Check whether expected values are independent of production logic and whether
assertions verify meaningful outcomes rather than merely the existence of data.

Do not invent weaknesses or recommend duplicate coverage.
If the tests are adequate for their intended purpose, say so.
Suggest at most one useful improvement and stop for my review.
```

Review Copilot's reasoning. Does the proposed improvement address a genuine gap,
or is the behavior already covered elsewhere?

#### Step 2: Compare weak and strong assertions

A test can pass while checking very little. For example:

```typescript
expect(result).toBeDefined();
```

This confirms that a result isn't `undefined`. It doesn't establish that the
score or recommended action is correct.

Paste this prompt:

```text
Create a temporary assertion-quality experiment in
client/src/risk-evaluation.test.ts using the existing calculateRisk function
and Vitest conventions. If this file already exists, stop rather than
overwrite it.

Add exactly two named tests:
- "weak assertion": checks only that calculateRisk("high") is defined.
- "contract assertion": checks that the result equals:
  { risk_score: 80, follow_up_action: "Prioritize immediate review" }.

This intentionally duplicates existing scoring coverage for demonstration;
it is not a permanent addition to the test suite.

Do not modify application logic or existing tests. Explain what each test proves.
Run only this temporary file and report the actual results.
```

From the repository root, the targeted command is:

```powershell
npm.cmd --prefix .\client test -- src\risk-evaluation.test.ts
```

Both tests should pass against the correct implementation. Confirm the actual
results before continuing.

#### Step 3: Check whether the assertions detect incorrect behavior

We'll temporarily introduce an incorrect score to see which assertion catches
it. This change is only for the experiment and must be restored afterward.

Paste this prompt:

```text
For this controlled experiment only, temporarily change the high-severity
risk score in client/src/risk.ts from 80 to 70.

Preserve all other application behavior and unrelated changes.
Do not modify or weaken any test assertions.

Run only client/src/risk-evaluation.test.ts.
Report which test passes, which fails, and why.
Explain what these results establish and what they do not establish.
Stop after reporting the results.
```

**Expected observation:**

| Test | Expected result |
| --- | --- |
| Weak assertion | Pass: the function still returns a defined result. |
| Contract assertion | Fail: the returned score violates the expected value of 80. |

The existing scoring tests would also detect this defect. The experiment
demonstrates assertion quality, not a newly discovered application defect or
proof that Copilot generally generates weak tests.

#### Step 4: Restore and clean up

Paste this prompt:

```text
Restore only the temporary high-severity scoring change from this experiment:
the correct score is 80. Preserve unrelated work.

Rerun the temporary experiment and report whether both tests pass.
Then remove only client/src/risk-evaluation.test.ts, which was created for
this exercise. Preserve all existing tests and meaningful tests added in Task B.

Run the unit/local-service tests:
npm.cmd --prefix .\client test -- src\risk.test.ts src\findings.test.ts

Confirm that no temporary application changes or experiment files remain.
Report actual results. Do not weaken assertions or repair unrelated issues.
```

**Checkpoint:** We should now be able to critique assertions, distinguish real
gaps from behavior tested elsewhere, and explain why passing tests prove only
what they check. Confirm that the scoring change is restored and the temporary
experiment file is removed before continuing.

### D. Extend integration test coverage

Unit tests check individual functions. Now we'll use Copilot to test a complete
finding workflow and see how the application's components work together.

#### Step 1: Review the existing integration tests

Open [App.test.tsx](../client/src/App.test.tsx). It already tests form submission,
service interaction, storage, retry behavior, normalization, and reset.

#### Step 2: Generate missing integration coverage

Paste this prompt:

```text
Review labs/03-test-plan.md and the integration tests in client/src/App.test.tsx.
Add only missing coverage using the existing Testing Library setup.

Focus on a complete low- or medium-severity workflow not already covered.
Verify:
1. The user can submit the finding.
2. The correct risk score and recommended action appear.
3. The finding appears in the saved findings list.
4. The record is persisted in localStorage.
5. The form clears after a successful save.

Use literal expected score/action values. Reuse existing failure/retry and
reset coverage rather than duplicating it.

Await interactions, isolate state, restore spies, and preserve the real App,
form, and local-service workflow. Do not mock away the workflow being tested.
Do not modify application behavior, earlier fixes, or existing assertions.
Run the relevant tests and report actual results.
```

#### Step 3: Run the integration tests

From the repository root:

```powershell
npm.cmd --prefix .\client test -- src\App.test.tsx
```

Review the actual results.

**Checkpoint:** We should now understand how integration tests verify multiple
parts of the application working together. These tests use jsdom; they don't
prove the application works in a real browser.

### E. Validate the application in a browser

After checking the unit and integration results, we'll use Copilot to extend
real-browser coverage and perform a basic accessibility check. If browser
automation is unavailable, use the
[restricted-environment alternative](#restricted-environment-alternative).

#### Step 1: Review the existing browser tests

Open:

- [starter.spec.ts](../client/e2e/starter.spec.ts)
- [accessibility.spec.ts](../client/e2e/accessibility.spec.ts)

These tests already cover saving findings, reload/reset behavior, and an
initial accessibility scan.

#### Step 2: Extend browser coverage

Paste this prompt:

```text
Use labs/03-test-plan.md to identify missing browser coverage.
Extend the existing Playwright tests without duplicating current coverage.

Add one meaningful valid-severity workflow that:
1. Submits an inspection finding.
2. Verifies the literal expected risk score and follow-up action.
3. Confirms facility-name normalization.
4. Reloads the page.
5. Verifies that the saved finding persists.

Use fresh browser contexts and accessible locators.
Preserve existing cancelled/confirmed reset tests.
Do not use fixed sleeps, backend mocks, or additional testing frameworks.
Do not modify application behavior or repair the known whitespace issue.

For accessibility:
- Reuse the existing axe setup.
- Add a scan after a successful save in client/e2e/accessibility.spec.ts.
- Check basic keyboard access to the form.

Preserve existing accessibility rule tags and attach scan results as the
current tests do. Run the browser suite and report actual results.
Do not claim mobile, screen-reader testing, or full WCAG conformance.
```

#### Step 3: Run the tests

From the repository root:

```powershell
npm.cmd --prefix .\client test
npm.cmd --prefix .\client run build
npm.cmd --prefix .\client run test:e2e
```

Playwright starts and stops its own server on **127.0.0.1:5174**. Browser contexts
use separate storage from the manually running app. If that port is occupied,
identify the owner rather than connect to an unknown server.

To run only the accessibility checks:

```powershell
npm.cmd --prefix .\client run test:a11y
```

Investigate unexpected failures without weakening assertions. If a fix is
needed, review it separately and rerun affected checks; don't silently expand
this exercise into application repairs.

#### Step 4: Perform a quick manual check

Reuse the existing workshop app and browser session if they're already running.
Otherwise, start the app from the repository root in a separate terminal:

```powershell
npm.cmd --prefix .\client run dev
```

Open [the app](http://127.0.0.1:5173). Using synthetic data, navigate the form
with **Tab** and **Shift+Tab**. Confirm that:

- Form controls can be reached using the keyboard.
- Focus is visible.
- Buttons can be operated.
- Feedback is understandable.

If we started a separate development server for this check, stop it with
**Ctrl+C** when finished.

**Checkpoint:** We should now have separate evidence from unit, integration,
browser, automated accessibility, and manual keyboard checks. Only mark checks
as passed if they were actually performed.

### F. Review results and share findings

We'll finish by using Copilot to summarize what was verified and what remains
uncertain, rather than simply reporting that the tests passed.

#### Step 1: Update the testing plan

Paste this prompt:

```text
Review the testing work completed in this module.
Update labs/03-test-plan.md with:

1. Requirements covered by existing and newly added tests.
2. Actual test results and commands executed.
3. Passed, failed, and unexecuted checks.
4. Known defects and limitations.
5. Remaining testing gaps.
6. The next testing priority.

Distinguish unit, integration, browser, accessibility, and manual verification.
Identify the expected failure from the temporary assertion-quality experiment
separately from final test results, and record its restoration and cleanup.
Use actual execution results. Do not invent test counts, coverage percentages,
or successful outcomes. If coverage tooling is unavailable, report coverage
percentages as unavailable rather than add tooling.

Keep the summary concise and suitable for sharing with a development team.
```

#### Step 2: Review the results

Confirm that the report accurately reflects the checks performed. Pay particular
attention to tests that weren't executed.

**Checkpoint:** We should now have a testing report explaining what was
validated, how it was validated, and what still needs attention.

### Restricted-environment alternative

If Playwright, Chromium downloads, or browser automation are prohibited or
unavailable, we'll complete Tasks A-D and use this alternative for Task E.
Record the policy restriction or exact error. Don't bypass organizational
policies, change security settings, or install prohibited dependencies.

MCP isn't required for the test runners here. If Copilot can't execute terminal
commands, run approved commands in the terminal and provide the actual results
to Chat.

#### Step 1: Run available automated checks

From the repository root:

```powershell
npm.cmd --prefix .\client test
npm.cmd --prefix .\client run build
```

Record the actual results. Keep all existing browser test files and mark
automated browser and axe checks **not run - restricted environment**.
Don't report them as passing because unit or integration tests pass.

#### Step 2: Perform manual browser verification

Use an approved browser, such as Microsoft Edge. Reuse the running workshop app
if available. Otherwise, start it from the repository root in a separate terminal:

```powershell
npm.cmd --prefix .\client run dev
```

Open [the app](http://127.0.0.1:5173). Use synthetic data and the same address
and browser profile for these checks:

| Manual case | Expected result |
| --- | --- |
| Save `  Demo Facility  ` with `INS-001`, `Routine`, `High`, and synthetic notes | Name normalized to `Demo Facility`; **80 / Prioritize immediate review**; finding saved; form cleared on success. |
| Save a low or medium finding | **20 / Routine follow-up** or **50 / Schedule follow-up inspection**. |
| Reload the browser at the same address | Saved findings remain available after a real page reload. |
| Cancel reset | Existing findings remain unchanged. |
| Confirm reset, after recording earlier evidence | Findings return to the bundled seed data. |
| Submit an empty required facility name | Native validation prevents submission. |
| Navigate using Tab/Shift+Tab | Controls are reachable, focus is visible, and actions can be completed. |

If Module 2 is complete, also check that whitespace-only names are rejected,
feedback is provided, other inputs are retained, and a valid correction saves.
Otherwise, record the known issue without fixing it in this module.

Stop any development server started just for these checks with **Ctrl+C** when
finished.

#### Step 3: Record manual results

In the same `labs/03-test-plan.md`, record these details for each manual check:

- Requirement ID.
- Method: manual.
- Test steps and inputs.
- Expected result.
- Actual result.
- Pass, fail, or not run.
- Browser and version.
- Remaining limitations.

Keep storage-failure/retry evidence from integration tests separate. Native
empty-field validation doesn't establish service-error handling.

#### Step 4: Document limitations

Manual browser testing isn't automated E2E. It doesn't provide:

- Automated Playwright execution.
- Isolated browser contexts.
- Automated axe scans.
- Playwright traces.
- Repeatable automated regression coverage.

Screen-reader, mobile, and full WCAG checks also remain unverified unless
separately performed. If local browser access is unavailable, record those
checks as not run and ask the facilitator for assistance; the runtime checkpoint
is then incomplete, not a claimed pass.

Complete Task F using the evidence actually collected. Identify the restricted
path and keep automated browser/axe checks explicitly unverified.

## 4. Checkpoint

Before finishing, make sure we can:

- [ ] Explain the difference between unit, integration, and browser testing.
- [ ] Review existing tests and identify meaningful coverage gaps.
- [ ] Create a testing plan based on expected application behavior.
- [ ] Generate meaningful tests using Copilot.
- [ ] Explain why a passing test may not prove correct behavior.
- [ ] Demonstrate a weak test passing while a stronger test detects a defect.
- [ ] Restore the application and remove the temporary experiment file.
- [ ] Verify an application workflow using integration tests.
- [ ] Validate browser behavior, including a real page reload, where permitted.
- [ ] Record accessibility and keyboard-check results honestly.
- [ ] Distinguish executed tests from unverified checks.
- [ ] Summarize testing results and remaining gaps.

**Restricted path:** Record unit/integration and manual results separately.
Clearly identify automated browser and axe checks as unverified. A passing
axe scan isn't full accessibility conformance on either path.

## 5. Retrospective

Take a moment to reflect:

1. What did the testing plan help us identify before generating new tests?
2. Why did the weak test pass when the application returned an incorrect score?
3. What can browser testing verify that unit and integration tests cannot?
4. Why should we review Copilot-generated tests rather than trust passing results?
5. What would we prioritize testing next?

**Next: [Module 4 - Code, security, and accessibility review](4-security-review.md).**
