# CFIA GitHub Copilot Hands-On Workshop

Inherit one working Inspection Findings Tracker and complete one guided
maintenance story with GitHub Copilot.

> An inspector lead reports that a facility name containing only spaces can be
> saved. Understand the app, fix the bug, review the change, and prove it works.

## One app, one maintenance story

The starter is a React + TypeScript frontend. It records inspection findings,
calculates deterministic score/action pairs, lists records, and persists them
in browser localStorage through an asynchronous [local service](client/src/findings.ts).
There is no backend, database, API, or cloud dependency.

The whitespace-only bug is intentionally present. Participants correct one
facility-name check; normalization, feedback, and storage safeguards are supplied.
They do not rebuild the application or implement every possible hardening
improvement. The fix and expected behavior are explained directly in the lab.

**Use synthetic data only.** Scores are not official CFIA policy or AI predictions.
Browser records and client-side scores remain user-editable, not trustworthy
production controls. See [security boundaries](SECURITY.md).

## Workshop modules

| Module | Suggested duration | Outcome |
| --- | --- | --- |
| [0 - Prerequisites](docs/0-prereqs.md) | 15 min | Existing setup/orientation guide; unchanged in this revision. |
| [1 - Understand the inherited application](docs/1-requirements.md) | 15 min | Source-grounded data flow and architecture diagram. |
| [2 - Fix the bug from start to finish](docs/2-implementation.md) | 35 min | Interactive -> Plan -> bounded execution, with regression evidence. |
| [3 - Code, security, and accessibility review](docs/3-security-review.md) | 25 min | Review decisions backed by evidence, using supplied specialist roles. |
| [4 - Testing and confidence](docs/4-testing.md) | 35 min | Unit/service, UI integration, real-browser E2E, and scoped accessibility checks. |
| [5 - Retrospective and operational reuse](docs/5-retrospective.md) | 10 min | Handoff and reusable prompting/verification habits. |

Modules 1-5 total **120 minutes**, excluding the unchanged 15-minute prerequisite
module. Each module has Objective, Why it matters, numbered Tasks, Checkpoint,
and Retrospective sections.

## Copilot workflow

Use the **Copilot** harness/session target and **Agent mode** controls:

- **Interactive:** collaborate, inspect evidence, and execute bounded steps.
- **Plan:** research and agree on the approach before implementation.
- **Autopilot:** execute an approved bounded task within the selected permissions.

Permissions are separate from Autopilot. Interactive is not inherently read-only:
investigation prompts explicitly prohibit edits. Other harnesses can have different
controls. Module 0 is intentionally unchanged; where its older mode wording
differs, follow the current controls described here and in Module 1.

The [supplied custom agents and prompts](.github/workshop-customizations.md)
are preserved unchanged. Read their model/tool/output limitations before use.
Their accessibility baseline is WCAG 2.1 AA; separate workshop guidance targets
scoped WCAG 2.2 AA checks, not full conformance.

## Quick setup

Have VS Code with authorized Copilot access, Node.js **22.12+** (24 LTS
recommended), PowerShell 5.1+ or 7, and package-feed access ready.
From repository root:

```powershell
npm.cmd --prefix .\client ci
npm.cmd --prefix .\client test
npm.cmd --prefix .\client run build
npm.cmd --prefix .\client run dev
```

Open [http://127.0.0.1:5173](http://127.0.0.1:5173).
Keep that address/profile consistent for manual persistence checks. Reloading
or restarting Vite does not reset localStorage; confirmed **Reset demo data**
restores bundled synthetic records. Stop the app with **Ctrl+C**.

The [setup](scripts/setup-env.ps1), [tests](scripts/run-tests.ps1), and
[start](scripts/start-app.ps1) PowerShell wrappers remain available.
If execution policy blocks a script, use the direct `npm.cmd` commands;
do not weaken machine-wide policy.

### Browser testing - prepare before Module 4

After `npm ci`, install Chromium once:

```powershell
Push-Location .\client
npx.cmd playwright install chromium
Pop-Location
npm.cmd --prefix .\client run test:e2e
```

Playwright manages a separate Vite server on **127.0.0.1:5174** and isolated browser
contexts. It does not reuse the manual app's stored records. Ports 5173/5174
must be available for their respective workflows.

```powershell
npm.cmd --prefix .\client run test:a11y
npm.cmd --prefix .\client run test:e2e:report
```

The report viewer runs until **Ctrl+C**. Browser downloads may require approved
network access; see [facilitator preparation](instructor/facilitator-guide.md).
The supplied browser tests cover existing valid behavior and a baseline axe
scan. Participants add the bug-specific and additional accessibility cases.
Vitest/jsdom tests are not browser E2E; an axe pass is not WCAG conformance.

Start with the [participant overview](docs/README.md).
