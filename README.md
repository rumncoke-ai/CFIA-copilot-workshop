# CFIA GitHub Copilot Hands-On Workshop

Use GitHub Copilot to improve an existing Inspection Findings Tracker, from
requirements to implementation, review, and testing in one continuous scenario.

## One app, one storyline

> As an inspector lead, I want to log inspection findings and receive a
> consistent risk score and follow-up recommendation so that I can prioritize
> which findings need attention.

The starter is a **single React + TypeScript app**. It lets you:

- Record an inspector ID, facility name, inspection type, severity, and notes.
- Save a finding with its calculated risk score and follow-up recommendation.
- View saved findings, including a bundled synthetic example.
- Keep findings across browser reloads using localStorage.
- Restore the synthetic example with **Reset demo data** (confirmation required).

There is **no backend, Python runtime, database, or API setup**. A small
[TypeScript data service](client/src/findings.ts) reads bundled
[JSON seed data](client/src/seed-findings.json) and saves to browser storage.
Scoring is a pure [TypeScript function](client/src/risk.ts), not an AI prediction.

The app runs, but it has intentional gaps for participants to improve:

- Text is not trimmed or length-limited; whitespace-only inputs can be saved.
- Unexpected input fields are ignored rather than rejected.
- Form feedback and loading/empty/error states need clearer explanations.
- Baseline tests exist, but do not cover the complete validation contract.

**Use synthetic inspection data only.** Scores are training examples, not
official CFIA policy or operational inspection advice. Browser data and code
can be edited by the user; this is not a trusted or production system.
Storage is specific to the browser profile and origin. Reloading or restarting
Vite keeps data; clearing site storage or confirming reset restores the example
on the next load or immediately, respectively.

## Workshop labs

Complete the modules in order; each builds on the same app.

| Module | Lab | What you will do |
| --- | --- | --- |
| 0 | [Setup and application orientation](docs/0-prereqs.md) | Run the starter and ask Copilot to explain it. |
| 1 | [Requirements and acceptance criteria](docs/1-requirements.md) | Define validation, scoring, persistence, and expected outcomes. |
| 2 | [Feature implementation](docs/2-implementation.md) | Improve the form and local data service using the agreed criteria. |
| 3 | [Security and code-review hardening](docs/3-security-review.md) | Review input handling, rendering, browser storage, and feedback. |
| 4 | [Testing and confidence checks](docs/4-testing.md) | Extend scoring, service, and UI tests with regression cases. |
| 5 | [Retrospective and operational reuse](docs/5-retrospective.md) | Capture reusable Copilot patterns and verification habits. |

## Quick setup

Have **VS Code with authorized GitHub Copilot Chat access**, **Node.js 22.12+**
(Node.js 24 LTS recommended), and **Windows PowerShell 5.1+ or PowerShell 7**
ready. Package-feed access and `npm.cmd` on PATH are required.
No Azure subscription, Azure DevOps project, GitHub.com workflow, or Codespaces
is required.

From the repository root in PowerShell:

```powershell
npm.cmd --prefix .\client ci
npm.cmd --prefix .\client test
npm.cmd --prefix .\client run build
npm.cmd --prefix .\client run dev
```

Open [http://127.0.0.1:5173](http://127.0.0.1:5173).
Keep this single app terminal open; stop it with **Ctrl+C**. Port 5173 must be
available. Use the same address each time to keep the same browser data.

Alternatively, run [setup](scripts/setup-env.ps1),
[tests](scripts/run-tests.ps1), and [start](scripts/start-app.ps1) from the root:

```powershell
.\scripts\setup-env.ps1
.\scripts\run-tests.ps1
.\scripts\start-app.ps1
```

The scripts use the same npm commands; build remains a separate check.
Tests run once with Vitest/jsdom and React Testing Library. A passing build is
not a substitute for tests, and jsdom is not a real-browser E2E test.
If script execution is restricted, use the direct npm commands; do not weaken
machine-wide execution policy. See [Module 0](docs/0-prereqs.md) for orientation.
