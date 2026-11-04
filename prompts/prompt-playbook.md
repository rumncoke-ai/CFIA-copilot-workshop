# Prompt playbook

Use these templates in VS Code Copilot Chat. Replace placeholders, attach actual
files, and keep real records, secrets, and confidential project data out of prompts.
Copilot output is a proposal; review changes and verify results yourself.

## 1. Requirements before code

Use for an ambiguous feature or inconsistent input behavior.

```text
Do not edit code.
Story: [USER_STORY]
Scope and exclusions: [SCOPE]
Reviewed rules: [FIELD_TYPES_LIMITS_SCORING_STORAGE_AND_ERRORS]
Context: [ACTUAL_FILES_AND_OBSERVED_BEHAVIOR]

Return ID | Given | When | Then | Verification.
Specify missing/null/type handling, trim-before-code-point limits, exact outputs,
failure effects on state, persistence/reset, and edge cases.
Separate implemented behavior from desired behavior. List contradictions;
do not invent inspection policy or trusted-browser security guarantees.
```

**Tracker example:** whitespace-only facility input rejects with field feedback
and no storage change. Good criteria give exact score/action outputs and
explicit reset/cancel behavior, not just "secure" or "user-friendly."

## 2. Explain, bound, apply

Use for one reviewed criterion or reproduced defect.

```text
Do not edit yet.
Criterion/defect: [ID_AND_EXPECTED_BEHAVIOR]
Observed result: [REPRODUCTION]
Allowed files: [EXACT_FILES]
Preserve: [SCORING_STORAGE_UI_AND_ERROR_BEHAVIOR]
Verification: [COMMAND_AND_BROWSER_CHECK]

Propose the smallest complete change. Return file/function, reason, and check.
Reuse existing helpers and identify affected callers. Explain type narrowing,
validation order, Unicode counting, and failure-state risks. Wait for approval.
```

After review:

```text
Apply only the changes I approved in [FILES]. Add the reviewed regression with
independent expected values. Do not broaden scope, silence errors, weaken tests,
or add dependencies without need. Run [CHECK] and report actual results/gaps.
```

**Tracker example:** reject unknown create-input keys without changing scoring,
valid stored output shape, or seed/reset behavior.

## 3. Evidence-led review

Use on a bounded diff and the adjacent callers needed to understand it.

```text
Review [DIFF_AND_FILES]; do not edit.
Focus: runtime validation, safe rendering, storage assumptions, and error states.
For each issue return file/function, reproduction, observed vs expected result,
impact, confidence, and verification.
Separate confirmed issues, hypotheses, existing safe behavior, and accepted
browser-only limitations. Do not call ignored fields a successful score override
or claim localStorage is tamper-proof. Propose only bounded remediations.
```

**Tracker example:** reproduce the failed-load/empty-state conflict. A model's
warning is not a confirmed vulnerability without code and behavior evidence.

## 4. Tests against an independent oracle

Use reviewed criteria, not implementation details, to define expected results.

```text
Compare [CRITERIA] with [EXISTING_TESTS]. First return missing cases and exact
expected outputs. Then, after review, add only the approved tests.
Use explicit score/action expectations, isolated localStorage, and full-state
comparisons on rejection. Include trimmed 1000/1001-code-point emoji notes.
Keep real App/form/service behavior in the UI integration test. Await user
interactions and restore spies. Report actual command results and coverage gaps.
Do not label jsdom a real-browser E2E test.
```

**Tracker example:** `"\u{1F642}".repeat(1000)` is accepted after outer trimming;
1001 copies reject without changing records. Copying production limits into
expected assertions can preserve the same bug twice.

## 5. Retrospective self-review

```text
Using only [ACTUAL_DIFFS_CHECK_OUTPUT_AND_OBSERVATIONS], propose three reusable
prompt patterns and three traps with concrete mitigations.
For each pattern include the exact prompt, tracker example, verification
evidence, and one next-project application. Label unverified and anticipated
items honestly. Do not claim checks were run or experiences occurred without
evidence. Edit only the participant notes after I review the proposal.
```

## Participant notes

Complete during [Module 5](../docs/5-retrospective.md).

### Three patterns and next-project applications

| Pattern | Exact prompt used | Tracker example | Verification evidence | Next use in my project |
| --- | --- | --- | --- | --- |
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |

### Three traps and mitigations

| Trap | Observed or anticipated | Tracker example | Concrete mitigation |
| --- | --- | --- | --- |
| 1 | | | |
| 2 | | | |
| 3 | | | |

### Next action and remaining evidence

- Next-project task and selected habit:
- Context I will supply:
- Specific verification check:
- Remaining workshop limitation or unverified criterion:
