# Inspection Findings Tracker requirements

## Scenario

An inspection delivery team inherits a basic tracker and improves its triage
workflow using GitHub Copilot with human review.

## Workshop constraints

- One continuous storyline and one app.
- Two-hour core session using local VS Code workflows.
- One React + TypeScript app; no backend runtime or API.
- Bundled synthetic JSON seed data and browser localStorage persistence.
- An asynchronous local data service, pure scoring function, and confirmed demo reset.
- Prioritize feature implementation and security/code-review hardening.
- Preconfigured frontend tests; participants extend them against reviewed criteria.

## Feature slice

Create and list inspection findings with a risk score and follow-up
recommendation. Participants will define fields, scoring rules, validation,
and testable acceptance criteria in Module 1 before implementation.

The starter intentionally lacks text normalization/limits, strict unknown-field
rejection, and rich field feedback. Baseline persistence and error handling are
implemented; do not describe the exercise gaps as completed protections.

## Boundaries

Use synthetic data only. Browser storage and client-side scores are editable
and cannot provide trusted validation or access control. Data is per browser
profile/origin, survives reloads and dev-server restarts, and resets to the
bundled example only on confirmed demo reset or reinitialization after site-data
removal. No shared records, authentication, deployment, or CI module is included.

## Acceptance criteria

To be completed during [Module 1](docs/1-requirements.md).
