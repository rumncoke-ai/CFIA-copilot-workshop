# Module 0 - Setup and application orientation

**Timebox: 15 minutes.** Get the Inspection Findings Tracker running, then use
one Copilot prompt to understand what the application does. Do not change
the code yet.

## 1. Install before the workshop

| Requirement | Check |
| --- | --- |
| [VS Code](https://code.visualstudio.com/) with GitHub Copilot Chat access | Update VS Code and the GitHub Copilot extension, sign in with your authorized GitHub account, and confirm Chat is available under your organization's policy. |
| [Node.js 22.12 or newer](https://nodejs.org/); Node.js 24 LTS recommended | `node --version` and `npm --version`; npm is included with Node.js. Restart the VS Code terminal after installation. |
| Windows PowerShell 5.1+ or PowerShell 7 | Open a PowerShell terminal in VS Code. |
| [Git](https://git-scm.com/downloads) if cloning the repository | `git --version` |
| A current browser, such as Edge or Chrome | Confirm JavaScript and localStorage are allowed for the local app; use the same browser profile throughout. |
| Chromium for Playwright (Module 4) | Install the test browser after npm dependencies, using the commands below. Your everyday browser does not replace this download. |

You need approved network access for GitHub, npm packages, Copilot, and
Playwright browser downloads. Confirm that ports **5173** (manual app) and
**5174** (browser tests) are available. No Azure
subscription, Azure DevOps project, or Codespaces is required.

Clone the workshop repository, or download and extract its ZIP if Git is not
available:

```powershell
git clone https://github.com/rumncoke-ai/CFIA-copilot-workshop.git
cd CFIA-copilot-workshop
```

In VS Code, use **File > Open Folder** to open the repository folder containing
`client`, `labs`, and `scripts`, not just the `client` folder. If Workspace Trust
is requested, trust it only after reviewing the source and following your
organization's policy. Confirm Copilot's **Copilot** harness/session target and
**Interactive, Plan, and Autopilot** controls are available. Module 3 also uses
the supplied specialist agents; check their picker availability with your
facilitator before the workshop.

## 2. Install dependencies and run the app

Open **Terminal > New Terminal** using PowerShell. Run these commands from
the repository root to install dependencies, check the baseline, and start the app:

```powershell
cd client
npm ci
npm test
npm run build
npm run dev
```

Leave that single app terminal running. Open:

- **Application:** [http://127.0.0.1:5173](http://127.0.0.1:5173)

If installation or startup fails, share the terminal error with your
facilitator. Port **5173** must be available. If PowerShell blocks `npm.ps1`
or `npx.ps1`, select **Command Prompt** from the VS Code terminal profile
dropdown, open a new terminal at the repository root, and run the same commands.
Do not weaken machine-wide execution policy.
The [setup/start/test scripts](../scripts) are optional wrappers around these
commands. Tests are preconfigured; Module 4 adds coverage, not tooling.

### Prepare browser tests before Module 4

Leave the app terminal running and open a **second terminal at the repository
root**. After `npm ci` has completed, run:

```powershell
cd client
npx playwright install chromium
npm run test:e2e
npm run test:a11y
```

Playwright starts and stops its own app server on **127.0.0.1:5174** and uses
isolated browser data, not your manual app's records. Resolve download or test
failures with your facilitator before Module 4; do not bypass organizational
network policies. The supplied baseline tests should pass even though the
whitespace-only facility-name defect is intentionally left for Module 2.

### Try the application

The initial list contains **Synthetic Seed Facility**, loaded from
[seed-findings.json](../client/src/seed-findings.json) on first use.
Enter this synthetic finding and select **Save finding**:

| Field | Value |
| --- | --- |
| Inspector ID | `INS-001` |
| Facility name | `Demo Facility` |
| Inspection type | `Routine` |
| Severity | `High` |
| Notes | `Synthetic finding: damaged storage seal.` |

You should see risk score **80**, follow-up **Prioritize immediate review**,
and the finding under **Existing findings**. Refresh the browser to confirm
it is still listed.

Use synthetic data only. Scores are training examples, not official CFIA
policy. Findings stay in this browser's localStorage after browser reloads and
dev-server restarts. Use the same address: `localhost` and `127.0.0.1` have
separate storage. Another profile or private window also has separate data.

Select **Reset demo data**, then cancel: your saved record should remain.
Select it again and confirm: only the bundled example should remain.
Reset does not clear unrelated localStorage keys. Invalid saved JSON produces a
visible error; reset is the explicit recovery path, not a silent fallback.

## 3. Ask Copilot to explain the application

Open **Copilot Chat** in VS Code, select the **Copilot** harness/session target,
and select **Interactive** in the **Agent mode** picker. Keep the workshop
repository open so Copilot can use it as context, then paste:

```text
Explore this repository and explain the current Inspection Findings Tracker
in plain language. Do not edit files or install anything.

1. What does the application do, and how would an inspector use it?
2. What technologies does this single React app use, and where are its main files?
3. Trace a finding from the form through the local TypeScript data service to
   its risk score and follow-up recommendation. Explain how the list is loaded.
4. What are the current scoring rules, where is data stored, and what happens
   on browser reload, dev-server restart, and confirmed demo reset?

Keep the explanation short and reference the actual files and functions.
```

If Copilot needs more context, attach the [client/src](../client/src)
files using Chat's context picker. Compare its explanation
with the finding you just saved.

You are ready when the baseline tests and build pass, the app runs, you can
save and view a finding, and Copilot has explained the application. For the
full workshop, also confirm the browser-test preparation succeeds.

**Next: [Module 1 - Requirements and acceptance criteria](1-requirements.md).**
Keep the app running. When finished with the workshop, press **Ctrl+C**
in its terminal.
