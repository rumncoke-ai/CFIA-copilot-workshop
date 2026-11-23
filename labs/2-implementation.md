# Module 2 - Fix the bug from start to finish

## 1. Objective

**Suggested duration: 35 minutes.**

In this module, we'll take on a bug report for the Inspection Findings Tracker
as developers responsible for maintaining the application. We'll use GitHub
Copilot to investigate the issue, understand its cause, and make a reliable fix.
We'll:

1. Reproduce the reported bug and investigate its root cause.
2. Develop and review an implementation plan.
3. Add a regression test that demonstrates the issue.
4. Implement a targeted fix with Copilot.
5. Verify that the fix works without breaking existing functionality.

We'll finish with a resolved issue and a regression test to help prevent the
same bug from returning.


> **Bug Report**
>
> **Reported by:** Inspector Lead
>
> **Issue:** The application allows a finding to be saved when the facility name
> contains only spaces.
>
> **Impact:** The finding has no usable facility name, making it difficult to
> identify which facility needs follow-up.
>
> **Expected behavior:** Facility names containing only whitespace should be
> rejected, while valid facility names should continue to work normally.

## 2. Why it matters

A real maintenance change needs a reproduction, an independent expected outcome,
a reviewed plan, and verification. Copilot helps at each step; it does not decide
inspection policy or approve its own changes.

## 3. Tasks

### A. Reproduce and understand the bug

Before making changes, we'll reproduce the inspector lead's report and use
Copilot to understand why the application accepts an invalid facility name.

#### Step 1: Reproduce the issue

1. Make sure the Inspection Findings Tracker is running in the browser.
2. Enter this synthetic finding:

   | Field | Value |
   | --- | --- |
   | Inspector ID | `INS-1042` |
   | Facility name | Three spaces (see below) |
   | Inspection type | `Routine` |
   | Severity | `High` |
   | Notes | `Testing facility-name validation` |

   **Important:** For **Facility name**, press the spacebar exactly three times.
   Do not enter the words "Three spaces."

3. Select **Save finding**.
4. Observe the result and check the saved findings list and browser storage.

**Expected behavior:** The application should reject a whitespace-only facility
name.

**Actual starter behavior:** The application trims the spaces to an empty name
but still saves the finding.

#### Step 2: Investigate using Copilot

1. Open GitHub Copilot Chat and confirm **Interactive** is selected in the
   **Agent mode** picker.
2. Attach these files to Chat (paths start at the repository root):
   - [client/src/FindingForm.tsx](../client/src/FindingForm.tsx)
   - [client/src/App.tsx](../client/src/App.tsx)
   - [client/src/findings.ts](../client/src/findings.ts)

3. Paste this prompt:

```text
Do not edit. Bug: a facility name containing three spaces saves successfully.
Trace this exact submission through the form, App, and local service.
Explain the root cause with file/function references. Distinguish native
required validation from whitespace validation and service validation.
Propose no unrelated fixes. Explain why a whitespace-only name should be rejected
and identify the safeguards already supplied.
```

#### Step 3: Review the findings

Review Copilot's explanation against the source code. Identify:

1. Where facility-name validation occurs.
2. Why the existing validation accepts whitespace-only values.
3. How the invalid value reaches storage.
4. Which existing safeguards need to stay in place.

**Important:** We'll only fix whitespace-only facility names. Normalization,
storage safeguards, failed-save retention, and accessible feedback are already
supplied. Preserve internal spaces and Unicode, other fields, scoring,
duplicates, seed data, persistence, and confirmed reset.

**Checkpoint:** We should now be able to reproduce the issue, explain its cause,
identify where the fix belongs, and describe which behaviors must stay unchanged.

### B. Propose and review the fix

Now that we've reproduced the bug and understood its cause, we'll use Copilot
to plan a targeted fix and review its impact before changing the code.

#### Step 1: Create an implementation plan

1. Select **Plan** in the **Agent mode** picker.
2. Attach these files to Chat (paths start at the repository root):
   - [client/src/FindingForm.tsx](../client/src/FindingForm.tsx)
   - [client/src/App.tsx](../client/src/App.tsx)
   - [client/src/findings.ts](../client/src/findings.ts)
   - [client/src/findings.test.ts](../client/src/findings.test.ts)
   - [client/src/App.test.tsx](../client/src/App.test.tsx)

3. Paste this prompt:

```text
Plan the smallest fix for whitespace-only facility names. Do not edit application
code yet. Reject them before any storage access, including direct service calls.
Find the existing facility empty check and explain why spaces pass it.
Reuse normalization, typed errors, accessible feedback, and storage safeguards.
Preserve all existing behavior except accepting whitespace-only names.
Do not add features, validation frameworks, or unrelated fixes.
Specify an expected failing regression and exact verification commands.
Stop for human review.
```

#### Step 2: Review the proposed plan

Before approving the plan, check:

- Does it address the reported issue?
- Does it reuse existing validation and error-handling mechanisms?
- Does it preserve existing behavior apart from accepting whitespace-only names?
- Does it include a regression test?
- Does it avoid unrelated changes and unchecked casts?

If Copilot proposes unnecessary changes, ask it to revise the plan.

#### Step 3: Approve the plan

1. Approve the plan **without starting implementation**, when that option is
   available.
2. Switch back to **Interactive** for the test-first step.

If the interface uses different labels, use the available plan-review controls
to finish review without authorizing the full implementation yet.

**Checkpoint:** We should now have a reviewed plan covering the required change,
the behavior to preserve, and the regression test. We won't implement the fix yet.

### C. Create a failing regression test

We're not fixing the code just yet. First, we'll add a test that catches the bug
and watch it fail. This shows that the test can spot the problem before we fix it.

#### What is a regression test?

A **regression** is when a bug comes back or a change breaks something that used
to work. A **regression test** helps catch that. Our test should fail now, pass
after the fix, and warn us if a future change brings this bug back.

#### Step 1: Generate the regression test

Paste this bounded prompt in Copilot Chat:

```text
Implement only the planned service regression for whitespace-only facility_name
in client/src/findings.test.ts. Do not fix implementation yet.
Use valid values for every other field. Initialize storage, capture its complete
serialized value, expect rejection identifying facility, and assert unchanged
storage. The expected behavior is rejection before any storage access, not
acceptance just because the current code allows it.
Run npm.cmd --prefix .\client test -- src\findings.test.ts from repository root.
Stop after showing the failure and explain how it demonstrates the reported bug.
```

#### Step 2: Review the test results

Inspect the generated test and actual output. Confirm that:

1. The test checks the expected behavior.
2. It fails because the application accepts the invalid input.
3. The failure isn't caused by a syntax error or missing dependency.
4. The test checks that storage remains unchanged when invalid input is rejected.

**Important:** Keep the failing test. Don't weaken it to match the starter.
The failure is expected because we haven't fixed the application yet.

**Checkpoint:** We should now have a failing regression test that demonstrates
the reported issue and gives us a measurable way to check the fix.

### D. Implement the approved fix

We've reproduced the bug, reviewed the plan, and created a failing regression
test. Now we'll use Copilot to make the correction and validate the results.

#### Step 1: Implement using Copilot

1. Review the selected **Permissions** separately. Do not select unrestricted
   permissions merely to demonstrate Autopilot.
2. Select **Autopilot** in Copilot Chat and paste:

```text
Apply only the approved whitespace-only facility check.
Keep the regression. Reuse the existing normalization, typed facility error,
field feedback, storage safeguards, and failed-save/retry flow.
Do not change other-field semantics, scoring, reset, seeds, or unrelated UI.
Do not commit, push, change branches, or add packages.
Run the focused test, full existing Vitest suite, and build. Report exact commands,
actual results, and remaining gaps. Stop at this checkpoint.
```

3. If organization policy disables Autopilot, execute the same approved task in
   **Interactive**. Record that fallback; do not claim Autopilot was demonstrated.

#### Step 2: Review Copilot's changes

1. Open Source Control in VS Code.
2. Review the modified files.
3. Confirm that the changes match the approved plan.
4. Check that no unrelated functionality was modified.

If needed, ask Copilot to explain the changes without making additional edits.

#### Step 3: Verify automated test results

Review the actual results reported by Copilot. Confirm that:

- The regression test now passes.
- The full existing Vitest suite passes.
- The application builds successfully.
- Any remaining issues or unperformed checks are clearly identified.

**Checkpoint:** We should now have a targeted fix supported by passing automated
checks. We'll verify the running application next.

### E. Verify the fix in the running application

This final task is where we'll evaluate the fix in the running app. We'll check
that invalid input is rejected and valid findings still work as expected.

#### Step 1: Verify invalid input is rejected

1. Return to **Interactive** in Copilot Chat.
2. Open the running application.
3. Enter valid synthetic values for the other fields, keep **High** severity,
   and enter only spaces for the facility name.
4. Attempt to save the finding.

Confirm that:

- The invalid facility name is rejected.
- The user receives feedback.
- Other form inputs remain available for correction.
- No invalid finding is saved.
- No false success message appears.

#### Step 2: Verify valid input still works

1. Correct the facility name to `  Demo Facility  `, with two spaces before and
   after the name.
2. Save the finding.
3. Confirm that:
   - The finding is saved successfully.
   - The facility name is normalized to `Demo Facility`.
   - The score and action remain **80 / Prioritize immediate review**.
   - The form clears only after a successful save.

#### Step 3: Verify persistence

1. Reload the browser at the same address.
2. Locate the successfully saved finding.
3. Confirm that its information remains available.

#### Step 4: Review the final changes

Ask Copilot to explain the final changes against the approved requirements
without modifying any additional files.

**Checkpoint:** We've checked the fix through a failing regression before
implementation, passing automated checks afterward, and manual verification of
invalid input, valid input, and persistence after reload.

## 4. Checkpoint

- Reproduce the original bug and explain its root cause using the source code.
- Review and approve a targeted implementation plan.
- Demonstrate a regression failing before and passing after the fix.
- Reject whitespace-only facility names through both form and direct service calls.
- Confirm storage remains unchanged when invalid input is rejected.
- Verify that valid facility names are normalized correctly.
- Confirm users can correct invalid input without losing other form values.
- Preserve scoring, persistence, duplicates, seed data, and confirmed reset.
- Review Copilot's changes and record actual test and build results.

## 5. Retrospective

Take a moment to reflect:

1. How did Copilot help us investigate and understand the reported bug?
2. Why was it useful to create a failing regression before implementing the fix?
3. What did reviewing the implementation plan help us catch or clarify?
4. Why should we verify Copilot-generated changes rather than rely only on
   passing tests?

**Next: [Module 3 - Build confidence with tests](3-testing.md).**
