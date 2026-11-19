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
production controls.

## Workshop modules

| Module | Suggested duration | Outcome |
| --- | --- | --- |
| [0 - Prerequisites](labs/0-prereqs.md) | 15 min | Verify prerequisites, run the app, and prepare browser tests. |
| [1 - Understand the inherited application](labs/1-requirements.md) | 15 min | Source-grounded data flow and architecture diagram. |
| [2 - Fix the bug from start to finish](labs/2-implementation.md) | 35 min | Investigate -> plan -> bounded implementation, with regression evidence. |
| [3 - Code, security, and accessibility review](labs/3-security-review.md) | 25 min | Review decisions backed by evidence, using supplied specialist roles. |
| [4 - Build confidence with tests](labs/4-testing.md) | 35 min | Standalone contract-first unit, integration, and browser testing, with a short accessibility check. |
| [5 - Retrospective and operational reuse](labs/5-retrospective.md) | 10 min | Handoff and reusable prompting/verification habits. |

Modules 1-5 total **120 minutes**, excluding the 15-minute prerequisite
module. Each module has Objective, Why it matters, numbered Tasks, Checkpoint,
and Retrospective sections.

## Copilot workflow

Use the **Copilot** harness/session target and **Agent mode** controls:

- **Interactive:** collaborate, inspect evidence, and execute bounded steps.
- **Plan:** research and agree on the approach before implementation.
- **Autopilot:** execute an approved bounded task within the selected permissions.

Permissions are separate from Autopilot. Interactive is not inherently read-only:
investigation prompts explicitly prohibit edits. Other harnesses can have different
controls. Module 0 verifies these controls before the guided exercises.

For accessibility, the supplied helper is based on WCAG 2.1 AA. This workshop
also checks selected WCAG 2.2 AA items; neither is a full conformance review.

## Quick setup

Have VS Code with authorized Copilot access, Node.js **22.12+** (24 LTS
recommended), PowerShell 5.1+ or 7, and package-feed access ready.
From repository root:

```powershell
Set-Location .\client
npm.cmd ci
npm.cmd test
npm.cmd run build
npm.cmd run dev
```

Open [http://127.0.0.1:5173](http://127.0.0.1:5173).
Keep that address/profile consistent for manual persistence checks. Reloading
or restarting Vite does not reset localStorage; confirmed **Reset demo data**
restores bundled synthetic records. Stop the app with **Ctrl+C**.

The [setup](scripts/setup-env.ps1), [tests](scripts/run-tests.ps1), and
[start](scripts/start-app.ps1) PowerShell wrappers remain available.
If execution policy blocks a script, use the direct commands above. If
PowerShell blocks `npm.ps1` or `npx.ps1`, use the `.cmd` commands shown here;
if organizational policy still blocks them, ask the facilitator. Do not weaken policy.

### Browser testing - preferred path, prepare before Module 4

After dependency installation, open a second terminal at repository root.
Only if permitted, install Chromium once and run the browser checks:

```powershell
Set-Location .\client
npx.cmd playwright install chromium
npm.cmd run test:e2e
```

Playwright manages a separate Vite server on **127.0.0.1:5174** and isolated browser
contexts. It does not reuse the manual app's stored records. Ports 5173/5174
must be available for their respective workflows.

```powershell
npm.cmd run test:a11y
npm.cmd run test:e2e:report
```

The report viewer runs until **Ctrl+C**. Browser downloads may require approved
network access; see [facilitator preparation](instructor/facilitator-guide.md).
If downloads or automation are prohibited or unavailable, use Module 4's
[restricted-environment alternative](labs/4-testing.md#restricted-environment-alternative).
Unit/integration tests plus documented manual browser checks let you continue,
but do not replace automated E2E or axe evidence. MCP servers and custom agents
are optional; Module 3 supplies chat-only review prompts. Never bypass policy.
The supplied browser tests cover existing valid behavior and a baseline axe
scan. Module 4 works without earlier modules: participants create a small test
contract and add missing coverage, with accessibility inside the browser exercise.
The intentional whitespace defect is a known gap, not a prerequisite repair.
Vitest/jsdom tests are not browser E2E; an axe pass is not WCAG conformance.

This README is the participant overview. Start with
[Module 0 - Prerequisites](labs/0-prereqs.md).
