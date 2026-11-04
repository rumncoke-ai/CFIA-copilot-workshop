# Inspection Findings Tracker - Guided maintenance lab

## Your mission

> An inspector lead reports that findings can be saved with a facility name
> containing only spaces. Investigate, fix, review, and verify that workflow.

One working React + TypeScript app, one bounded change, and one continuous story.
Use synthetic records only. Scoring is deterministic training logic, not official
policy. Browser records can be changed by a user.

## Your workflow

Use the **Copilot** harness in local VS Code. Its Agent mode controls are
**Interactive, Plan, and Autopilot**. A specialist agent is a reusable role, not
another workflow mode. Autopilot does not mean unrestricted permissions.

**Copilot proposes; you review; checks provide evidence.**

Every guide uses Objective, Why it matters, numbered Tasks, Checkpoint, and
Retrospective. Paste one prompt at a time and inspect the result before continuing.

| Module | Suggested duration | Observable checkpoint |
| --- | --- | --- |
| [0 - Prerequisites](0-prereqs.md) | 15 min | Existing setup and orientation; unchanged. |
| [1 - Understand the application](1-requirements.md) | 15 min | Explain real data flow and verify an architecture diagram. |
| [2 - Fix the bug](2-implementation.md) | 35 min | Reproduce -> plan -> failing test -> bounded fix -> passing test. |
| [3 - Review](3-security-review.md) | 25 min | Decide accept/modify/reject/investigate using code, security, and accessibility evidence. |
| [4 - Test](4-testing.md) | 35 min | Create a small contract, then establish unit, integration, and browser evidence. Standalone; includes a short accessibility check. |
| [5 - Retrospective](5-retrospective.md) | 10 min | Evidence-based handoff and reusable habits. |

Modules 1-5 total **120 minutes**; prerequisites are separate. Module 0 retains
older mode wording by request: use the current workflow controls above.
Prepare browser tooling before Module 4 when attending the full workshop.
Standalone participants can use Module 4's setup instructions.

## Boundaries and completion

The lab focuses on rejecting whitespace-only facility names.
Normalization, feedback, and storage safeguards are already supplied.
Preserve scoring, other-field semantics, valid duplicates, storage, retry, and
confirmed reset. New features, comprehensive text limits, unknown-key rejection,
unrelated load-state fixes, backend work, deployment, and CI are out of scope.

The starter is intentionally not fixed. Its baseline tests pass; participants
add bug-specific regressions in Module 2. Continue with the same changes between
modules, or take Module 4 independently: it creates a fresh test contract and
records the whitespace defect as a known gap without requiring its repair.
No supplied completed application solution or automated rescue patch is implied.

By the end, demonstrate:

- Blank facility rejected; valid facility normalized; accessible field feedback.
- Unchanged storage on rejection, retained inputs, and successful correction.
- Preserved score/action outputs and browser reload/reset behavior.
- Review decisions and actual tests/build results, with remaining gaps.

The accessibility helper uses WCAG 2.1 guidance. The workshop adds selected
WCAG 2.2 checks without claiming full conformance.

See [quick setup](../README.md#quick-setup) and
[facilitator preparation](../instructor/facilitator-guide.md).
