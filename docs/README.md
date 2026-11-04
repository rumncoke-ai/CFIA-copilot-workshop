# CFIA Inspection Findings Tracker Lab

## Your mission

You are part of a CFIA delivery team inheriting an inspection findings app that
works, but is weak in validation, triage consistency, risk scoring reliability,
and testing. An inspector lead needs to trust that equivalent findings receive
equivalent treatment and that invalid inputs do not produce misleading results.

Over this two-hour lab, you will improve one app rather than switch between
unrelated demos. You will define what correct triage means, implement it across
a React + TypeScript frontend and Python + FastAPI backend, review the changes,
and build confidence in the outputs through repeatable local tests.

Use synthetic inspection findings only. The scoring rules you define are
training rules, not official CFIA policy or operational inspection advice.

## One user story

> As an inspector lead, I can log findings and receive a risk score and follow-up
> recommendation so that I can prioritize follow-up consistently.

The feature slice is a create/list flow: enter a finding, submit it to the API,
and see the saved finding with its calculated score and recommendation.
You will define the exact fields, scoring rules, and validation in Module 1.
Those decisions become the contract for implementation, review, and tests.

## Your workflow

Work locally in VS Code with GitHub Copilot (GHCP), integrated terminals, and
your browser. The core lab does not require GitHub.com, Codespaces, an Azure
subscription, or an Azure DevOps project. Have VS Code, Copilot access, Node.js,
and Python ready before the session; Module 0 is for setup confirmation and
the baseline run, not account provisioning.

**GHCP outputs are probabilistic and require review.** A plausible answer or
successful compilation does not prove correctness or security. Give Copilot
specific acceptance criteria and relevant files, inspect its proposed changes,
and verify behavior before accepting the result. You remain responsible for
the code and the triage rules.

## Module sequence and timeboxes

Follow the modules in order and keep your changes: each checkpoint is the
starting point for the next module. Timeboxes include checkpoint verification
and a short retrospective.

| Module | Timebox | Build on prior work | Concrete checkpoint |
| --- | --- | --- | --- |
| [0 - Environment setup and baseline run](0-prereqs.md) | 15 min (00:00-00:15) | Start with the inherited tracker; locate the frontend, API, and tests. | Run the baseline locally, open the UI, and confirm Copilot is available in VS Code. |
| [1 - Requirements and acceptance criteria](1-requirements.md) | 15 min (00:15-00:30) | Use the baseline behavior and the user story to identify the missing triage contract. | Update `requirements.md` with finding fields, validation, deterministic scoring rules, follow-up rules, and example inputs with expected outputs. |
| [2 - Feature implementation](2-implementation.md) | 35 min (00:30-01:05) | Implement the Module 1 contract across the existing frontend and backend. | Create and list a finding; verify its risk score and follow-up recommendation against an agreed example. |
| [3 - Security and code-review hardening](3-security-review.md) | 25 min (01:05-01:30) | Review the actual Module 2 changes, not a separate sample app. | Harden server-side validation, safe UI rendering, and error handling; demonstrate that invalid input is rejected without adding a finding. |
| [4 - Testing and confidence checks](4-testing.md) | 20 min (01:30-01:50) | Turn Module 1 examples and Module 3 review findings into regression tests for the hardened feature. | Run passing local tests for risk logic, API success/error behavior, and one UI create/list flow. |
| [5 - Retrospective and operational reuse](5-retrospective.md) | 10 min (01:50-02:00) | Use the prompts, corrections, and test evidence collected in Modules 1-4. | Record three reusable prompt patterns, three traps with mitigations, and next-project applications in the prompt playbook. |
| [Optional 6 - Azure DevOps CI/CD handoff](optional-6-azure-devops-cicd.md) | 20-25 additional min | Translate the same local Module 4 quality checks into automation; do not add another feature. | Configure pipeline install, test, and build stages and follow the documented successful-run path. |

**Core total: 120 minutes.** Optional Module 6 is outside that timebox and has
separate Azure DevOps repository and agent prerequisites. You can complete the
core lab without it.

## What counts as done

Before moving to the next module:

- Explain why the change helps the inspector lead.
- Run or show the module's checkpoint; do not rely on Copilot saying it works.
- Complete the module's retrospective checklist.
- Discuss at least one Copilot trap and how you caught or avoided it.

By the end, you should have a working feature slice, reviewed validation and
error handling, passing local checks, and prompt patterns you can reuse on
your own projects.

## Repository readiness

This narrative describes the intended lab. The frontend and backend starters
can be run using the [root README commands](../README.md#backend-starter).
The participant module guides and setup/start/test scripts are available.
The three-stage root pipeline is available; optional Module 6 explains its
install/test/build gates, run prerequisites, and Azure Repos PR-policy requirement.
