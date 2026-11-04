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

Use dedicated local code review where available. For security or accessibility
review, choose the specialist from Chat's agent selector. If you can't find it,
choose **Agent** mode and use the review instructions in Module 3. Review
any proposed report file before allowing it to be written.

## 5. Test against the contract

```text
Act as a QA engineer. Read the current source and existing tests.
Create a small test contract with requirement IDs, concrete expected outcomes,
and a mapping to unit, integration, and browser/manual checks. Identify gaps.
Stop for review before changing tests. No earlier module outputs are required.
After review, add only missing cases using the existing runners.
Use independent expected values, real integration, and isolated browser contexts.
Include normal, edge, and invalid cases where the contract supports them.
Preserve existing tests; do not weaken assertions to make failures disappear.
Report actual passed/failed counts, commands, coverage where available, and gaps.
Do not claim browser/mobile/manual checks unless performed, call jsdom E2E,
or call passing axe checks full accessibility conformance.
```

Tracker example: literal severity scores -> form/service save -> browser reload,
with a short axe/keyboard check. See the standalone
[Module 4](../labs/4-testing.md); record the intentional whitespace defect as a
known gap rather than repeating Module 2.

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
