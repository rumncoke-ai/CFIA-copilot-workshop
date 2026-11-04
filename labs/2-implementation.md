# Module 2 - Fix the bug from start to finish

## 1. Objective

**Suggested duration: 35 minutes.**

In this module, we'll explore a reported bug and use Copilot to understand why
it happens. We'll plan a fix, add a test that catches the problem, and then make
the change. Finally, we'll try the updated app and run the tests to check that
the fix works. You'll finish with a working fix and a test to help catch the
same bug if it returns.

> An inspector lead reports that a facility name containing only spaces can be
> saved. It produces a finding without a usable facility name.

## 2. Why it matters

A real maintenance change needs a reproduction, an independent expected outcome,
a reviewed plan, and verification. Copilot helps at each step; it does not decide
inspection policy or approve its own changes.

## 3. Tasks

### A. Reproduce and understand

1. Confirm **Interactive** in the Copilot Agent mode picker.
2. In the browser, enter synthetic values for all fields, but enter three spaces
   for **Facility name**. Select **High**, then **Save finding**.
3. Observe the saved result/list and browser storage. The starter trims the
   spaces to an empty name but still saves it; do not claim it rejected the input.
4. Attach these files to Chat (paths start at the repository root):
   - [client/src/FindingForm.tsx](../client/src/FindingForm.tsx)
   - [client/src/App.tsx](../client/src/App.tsx)
   - [client/src/findings.ts](../client/src/findings.ts)

   Then paste:

```text
Do not edit. Bug: a facility name containing three spaces saves successfully.
Trace this exact submission through the form, App, and local service.
Explain the root cause with file/function references. Distinguish native
required validation from whitespace validation and service validation.
Propose no unrelated fixes. Explain why a whitespace-only name should be rejected
and identify the safeguards already supplied.
```

5. Review the expected behavior above. The only fix is rejecting whitespace-only
   facility names. Normalization, storage safeguards, failed-save retention, and
   accessible feedback are already supplied. Preserve internal spaces and Unicode,
   other fields, scoring, duplicates, seed data, persistence, and confirmed reset.

### B. Propose the fix

1. Select **Plan** in the Agent mode picker.
2. Attach these files to Chat (paths start at the repository root):
   - [client/src/FindingForm.tsx](../client/src/FindingForm.tsx)
   - [client/src/App.tsx](../client/src/App.tsx)
   - [client/src/findings.ts](../client/src/findings.ts)
   - [client/src/findings.test.ts](../client/src/findings.test.ts)
   - [client/src/App.test.tsx](../client/src/App.test.tsx)

   Then paste:

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

3. Inspect the proposed plan. Reject unrelated changes and unchecked casts.
4. Approve the plan **without starting implementation**, when that action is
   offered. Switch to **Interactive** for the test-first step. If labels differ,
   use the available plan-review controls to finish review without authorizing
   the full implementation yet.

### C. Establish the regression

We're not fixing the code just yet. First, we'll add a test that catches the bug
and watch it fail. This shows that the test can spot the problem before we fix it.

A **regression** is when a bug comes back or a change breaks something that used
to work. A **regression test** helps catch that. Our test should fail now, pass
after the fix, and warn us if a future change brings this bug back.

1. Paste this bounded prompt:

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

2. Inspect the test and actual output. The failure must show acceptance where
   rejection was expected, not a syntax error or missing dependency.
3. Keep the failing test. Do not weaken it to match the starter.

### D. Execute the approved correction

1. Review the selected **Permissions** separately. Do not select unrestricted
   permissions merely to demonstrate Autopilot.
2. Select **Autopilot** and paste:

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
   Interactive. Record that fallback; do not claim Autopilot was demonstrated.

### E. Inspect and demonstrate

1. Return to **Interactive** and inspect Source Control changes.
2. Ask Copilot to explain the diff against the criteria without further edits.
3. Reject a whitespace-only facility. Check field feedback, retained inputs,
   no new finding, and no success reported for that attempt.
4. Correct it to `  Demo Facility  ` and save. Expect `Demo Facility`,
   **80 / Prioritize immediate review**, and a cleared form after success.
5. Reload and verify persistence. Keep the actual test results and browser
   observations in Chat or your own notes.

## 4. Checkpoint

- Demonstrate a relevant regression failing before and passing after the fix.
- Reject blank facility names through both form and direct service calls.
- Show normalized valid output, unchanged storage on rejection, and usable retry.
- Preserve existing scoring, persistence, duplicates, and confirmed reset.
- Inspect the bounded diff and record actual tests/build results.

## 5. Retrospective

- What did Plan clarify that the bug report did not?
- Where did you explicitly stop Autopilot?
- What did the regression prove, and what still needs broader testing?

**Next: [Module 3 - Code, security, and accessibility review](3-security-review.md).**
