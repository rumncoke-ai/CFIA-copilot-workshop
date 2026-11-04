# CFIA Inspection Findings Tracker Lab

## Your mission

Inherit one working React + TypeScript app and improve it with GitHub Copilot.
An inspector lead needs consistent triage, usable feedback, and confidence in
the results. Use one continuous story:

> As an inspector lead, I can log findings and receive a risk score and follow-up
> recommendation so that I can prioritize follow-up consistently.

The app uses synthetic JSON seeds and localStorage through an asynchronous
[local data service](../client/src/findings.ts). No backend or API is required.
Browser data persists for the same origin/profile until reset or cleared.
Use synthetic data only; scoring is not official CFIA policy.

## Your workflow

Work in local VS Code with Copilot Chat, PowerShell, and a browser. Have VS Code,
authorized Copilot access, and Node.js ready before the session.
No Azure subscription, Azure DevOps project, GitHub.com workflow, or Codespaces
is required.

**Copilot proposes; you review; checks provide evidence.** Start with criteria,
ask for bounded changes, inspect the actual diff, and verify exact outcomes.
A fluent answer or successful build does not prove correctness or security.

## Module sequence

| Module | Timebox | Concrete checkpoint |
| --- | --- | --- |
| [0 - Setup and orientation](0-prereqs.md) | 15 min | Run one app, save/reset a finding, and verify Copilot's source-grounded explanation. |
| [1 - Requirements](1-requirements.md) | 15 min | Record field, scoring, validation, storage, and error criteria with exact examples. |
| [2 - Implementation](2-implementation.md) | 35 min | Normalize/validate data in the local service and provide matching form feedback. |
| [3 - Security and review](3-security-review.md) | 25 min | Reproduce and address one input-handling issue and one distinct code-quality issue. |
| [4 - Testing](4-testing.md) | 20 min | Extend scoring, service, and UI tests; add a new boundary regression. |
| [5 - Retrospective](5-retrospective.md) | 10 min | Capture three reusable prompt patterns and three traps with mitigations. |

The core session is two hours. Keep changes between modules; each checkpoint is
the starting point for the next. There is no optional CI/deployment module.

## What counts as done

- Explain how the change helps the inspector lead.
- Demonstrate the module checkpoint using actual results.
- Complete its retrospective checklist and discuss one Copilot trap.
- Keep criteria, implementation, and test evidence distinct.

By the end, demonstrate normalized create/list behavior, exact score/action
outputs, rejection without storage changes, safe text rendering, visible storage
failures, persistence/reset, and passing tests/build.

Client-side checks improve this demo's reliability, not trust or access control.
Do not claim tamper-proof scores or production security.

## Repository readiness

The runnable starter, preconfigured frontend tests, PowerShell wrappers, and
participant guides are supplied. See [quick setup](../README.md#quick-setup).
The app deliberately leaves text limits, unknown-field rejection, rich feedback,
and comprehensive validation coverage for participants. Facilitators must
prepare their own verified recovery checkpoints; these are not supplied solutions.
