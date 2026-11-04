# Module 5 - Retrospective and operational reuse

## 1. Objective

**Suggested duration: 10 minutes.**

Turn the maintenance story into a concise handoff and reusable engineering habits.
No new application changes are required.

## 2. Why it matters

The outcome is not just a repaired training app. It is knowing when to investigate,
plan, delegate bounded execution, challenge a review, and demand evidence.

## 3. Tasks

### A. Prepare the handoff - Interactive

1. Attach your actual diff and provide your review decisions, test results, and
   browser observations from Chat or your own notes.
2. Select **Interactive** and paste:

```text
Draft a concise PR-style handoff in chat using only the supplied evidence.
Include symptom, root cause, bounded fix, preserved behavior, actual verification,
review decisions, and remaining limitations. Do not edit code, commit, push,
invent test outcomes, or claim full security/accessibility conformance.
```

3. Correct any unsupported claims. A PR-style summary does not require opening a PR.

### B. Capture reusable patterns

1. Open the [prompt playbook](../prompts/prompt-playbook.md).
2. Record three exact prompts you used, their tracker context, evidence, and one
   next-project application each.
3. Capture three traps with concrete mitigations. Examples include excessive
   Autopilot scope, accepting unsupported review findings, and treating an axe
   scan as complete accessibility evaluation.
4. Label traps **observed** or **anticipated** honestly.

### C. Share and close

1. Explain the fix and strongest evidence to a partner.
2. Name one review decision you made rather than delegated to Copilot.
3. Choose one habit for your next maintenance task.
4. Stop your manual app and any report-viewer terminal with **Ctrl+C**.
   Playwright's managed web server stops when its test run finishes.

## 4. Checkpoint

- Evidence-based handoff, three reusable prompts, and three traps/mitigations.
- One concrete next-project action and one remaining limitation.
- Clear distinction between workflow mode, specialist role, and reusable prompt.

## 5. Retrospective

- When was Interactive more useful than Autopilot?
- What did the custom agents add, and what did you still verify yourself?
- What would be required before applying this pattern to production data?
