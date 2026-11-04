# Prompt playbook - Guided maintenance

Use one prompt at a time with real source context and synthetic data.
The [module guides](../docs/README.md) contain the full step-by-step workflow.
These templates are reusable summaries, not permission to skip checkpoints.

## 1. Understand before editing - Interactive

```text
Do not edit. Trace [WORKFLOW] through the attached actual source.
Return a short explanation, source references, and a small data-flow diagram.
Separate implemented behavior, intended behavior, and unverified assumptions.
Do not invent infrastructure or policy.
```

Tracker example: form -> App save -> local service -> score/storage -> display.

## 2. Diagnose, then plan - Interactive -> Plan

```text
Do not edit yet. Reproduction: [INPUT_AND_STEPS].
Observed: [ACTUAL]. Expected: [REVIEWED_CRITERION].
Explain the root cause with source evidence. Then propose the smallest complete
change, affected callers, preserved behavior, and tests. Stop for plan approval.
```

Tracker example: spaces-only facility names pass native `required` and the
service's existing raw empty-string check. Normalization and feedback are supplied.

## 3. Establish failure, then execute - Interactive -> Autopilot

```text
Add only the approved regression for [CRITERION]; do not fix implementation.
Run [FOCUSED_COMMAND], show the expected failure, and stop.
```

After inspecting the failure and approving implementation:

```text
Apply only [APPROVED_CHANGE]. Preserve [BEHAVIOR].
Keep the regression and run [CHECKS]. Do not commit, push, expand scope,
install packages, or weaken assertions. Report actual results and stop.
```

Use selected permissions; Autopilot is not unrestricted execution.

## 4. Review evidence, not confidence

```text
Review [DIFF] against [CONTRACT] without application edits.
Return actionable issue, file/function, reproduction, expected/actual result,
impact, confidence, and verification. Separate confirmed findings, hypotheses,
safe behavior, and accepted limitations. No findings is a valid result.
```

Use dedicated local code review where available. For specialist security and
accessibility roles, read the [customization guide](../.github/workshop-customizations.md)
first; their mandatory report writes mean they are not read-only.

Reusable files:

- [Workshop security review](../.github/prompts/workshop-security-review.prompt.md).
- [Workshop accessibility testing](../.github/prompts/workshop-accessibility-tests.prompt.md).
- [Supplied accessibility recipe, unchanged](../.github/prompts/accessibility.prompt.md):
  inspect limitations before use; it is not the scoped core exercise.

## 5. Test against the contract

```text
Compare [CRITERIA] with [EXISTING_TESTS]; propose only missing cases first.
After approval, use independent expected outputs, full unchanged-storage
assertions, real integration, and isolated browser contexts. Include
[POSITIVE_NEGATIVE_REGRESSION_CASES]. Report actual commands and remaining gaps.
Do not call jsdom E2E or passing axe checks full accessibility conformance.
```

Tracker example: blank rejection -> correction -> normalized save -> full reload.

## Participant notes

Complete during [Module 5](../docs/5-retrospective.md).

| Pattern | Exact prompt used | Tracker evidence | Next-project application |
| --- | --- | --- | --- |
| 1 | | | |
| 2 | | | |
| 3 | | | |

| Trap | Observed or anticipated | Concrete mitigation | Tracker example |
| --- | --- | --- | --- |
| 1 | | | |
| 2 | | | |
| 3 | | | |

### Handoff

- Symptom and root cause:
- Bounded fix and preserved behavior:
- Actual checks and review decisions:
- Remaining limitations/manual checks:
- One next-project action:
