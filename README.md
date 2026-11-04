# CFIA GitHub Copilot Hands-On Workshop

Use GitHub Copilot to improve an existing Inspection Findings
Tracker, from defining requirements to implementing, reviewing, and testing
changes in one continuous hands-on scenario.

## The Application and the Story You Will Improve

> As an inspector lead, I want to log inspection findings and receive a
> consistent risk score and follow-up recommendation so that I can prioritize
> which findings need attention.

The starter application has a **React + TypeScript frontend** and a
**Python + FastAPI backend**. It lets you:

- Record an inspector ID, facility name, inspection type, severity, and notes.
- Save a finding and see its calculated risk score and follow-up recommendation.
- View previously saved findings in a list.

The app runs, but it has intentional gaps for you to investigate and improve:

- Weak text validation can allow blank, whitespace-only, or overly long inputs;
  the API also silently ignores unexpected fields.
- Risk scores use provisional severity-only rules that need agreed acceptance
  criteria and regression checks.
- Basic error messages and loading/empty states need clearer feedback.
- Backend tests cover only happy paths, and frontend tests have not yet been added.

Across the labs, you will define the expected behavior, implement improvements
across the UI and API, review validation and security, and add repeatable tests.
You will finish by capturing reusable Copilot prompting patterns. Treat Copilot's
suggestions as proposals: review the code and verify the results yourself.

**Use synthetic inspection data only.** Scores and recommendations are training
examples, not official CFIA policy or operational inspection advice. This is a
local, unauthenticated training app, not a production service; findings are stored
in memory and reset when the backend restarts or reloads.

## Workshop Labs

Complete the core modules in order; each builds on your changes to the same app.

| Module | Lab | What you will do |
| --- | --- | --- |
| 0 | [Environment setup and baseline run](docs/0-prereqs.md) | Run the starter and confirm Copilot is available. |
| 1 | [Requirements and acceptance criteria](docs/1-requirements.md) | Define finding fields, validation, scoring, and expected outcomes. |
| 2 | [Feature implementation](docs/2-implementation.md) | Implement the agreed create/list workflow across the UI and API. |
| 3 | [Security and code-review hardening](docs/3-security-review.md) | Review changes and strengthen validation, rendering, and error handling. |
| 4 | [Testing and confidence checks](docs/4-testing.md) | Add regression tests for scoring, API behavior, and the UI flow. |
| 5 | [Retrospective and operational reuse](docs/5-retrospective.md) | Capture effective prompts, common traps, and lessons for your next project. |
| Optional 6 | [Azure DevOps CI/CD handoff](docs/optional-6-azure-devops-cicd.md) | Automate the same install, test, and build checks in a pipeline. |

<a id="backend-starter"></a>

## Quick Setup

Have **VS Code with authorized GitHub Copilot Chat access**, **Python 3.11+**,
**Node.js 22.12+**, and **Windows PowerShell 5.1+ or PowerShell 7** ready.
Package-feed access and `npm.cmd` on PATH are required.
The core labs run locally; no Azure subscription, Azure DevOps project,
GitHub.com workflow, or Codespaces is required.

Open the repository root in VS Code. In a PowerShell terminal, run:

```powershell
.\scripts\setup-env.ps1
.\scripts\run-tests.ps1
npm --prefix .\client run build
.\scripts\start-app.ps1
```

Setup creates or reuses `.venv` and installs backend and frontend dependencies.
Frontend tests are explicitly skipped until Module 4 adds a test command;
the build checks TypeScript and produces the frontend bundle, but does not
replace UI tests.

Open the app at [http://127.0.0.1:5173](http://127.0.0.1:5173) and the API
explorer at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).
Keep the startup terminal open and stop both servers with **Ctrl+C**.
Ports 8000 and 5173 must be available.

For manual setup, baseline checks, or script-policy restrictions, follow
[Module 0](docs/0-prereqs.md). Use your organization's approved process if
execution policy blocks scripts; do not weaken machine-wide policy.
