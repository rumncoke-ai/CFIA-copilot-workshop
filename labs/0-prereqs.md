# Module 0 - Setup and application orientation

**Timebox: 15 minutes.** Get the Inspection Findings Tracker running, then use
one Copilot prompt to understand what the application does. Do not change
the code yet.

## 1. Install before the workshop

| Requirement | Check |
| --- | --- |
| [VS Code](https://code.visualstudio.com/) with GitHub Copilot Chat access | Update VS Code and the GitHub Copilot extension, sign in with your authorized GitHub account, and confirm Chat is available under your organization's policy. |
| [Node.js 22.12 or newer](https://nodejs.org/); Node.js 24 LTS recommended | `node --version` and `npm.cmd --version`; npm is included with Node.js. Restart the VS Code terminal after installation. |
| Windows PowerShell 5.1+ or PowerShell 7 | Open a PowerShell terminal in VS Code. |
| [Git](https://git-scm.com/install/) if cloning the repository | `git --version` |
| A current browser, such as Edge or Chrome | Confirm JavaScript and localStorage are allowed for the local app; use the same browser profile throughout. |
| Chromium for Playwright (Module 3) | Install the test browser after npm dependencies, using the commands below. Your everyday browser does not replace this download. |

You need approved network access for GitHub, npm packages, Copilot, and
Playwright browser downloads for the full browser-testing path. If downloads
are restricted, use the alternative below; no MCP server or external service
is needed by the app. Copilot itself still needs authorized service access.
Confirm that ports **5173** (manual app) and
**5174** (browser tests) are available. No Azure
subscription, Azure DevOps project, or Codespaces is required.

Clone the workshop repository, or download and extract its ZIP if Git is not
available:

```powershell
git clone https://github.com/rumncoke-ai/CFIA-copilot-workshop.git
Set-Location .\CFIA-copilot-workshop
```

In VS Code, use **File > Open Folder** to open the repository folder containing
`client`, `labs`, and `scripts`, not just the `client` folder. Confirm Copilot's Copilot harness/session target and Interactive, Plan, and Autopilot controls are available.
Missing Autopilot, MCP, custom agents, or dedicated review controls does not
block the exercises. Module 4 supplies equivalent review prompts.

## 2. Install dependencies and run the app

Open **Terminal > New Terminal** using PowerShell. Run these commands from
the repository root to install dependencies, check the baseline, and start the app:

```powershell
Set-Location .\client
npm.cmd ci
npm.cmd test
npm.cmd run build
npm.cmd run dev
```

Leave that single app terminal running. Open:

- **Application:** [http://127.0.0.1:5173](http://127.0.0.1:5173)

If installation or startup fails, share the terminal error with your
facilitator. Port **5173** must be available. If PowerShell blocks `npm.ps1`
or `npx.ps1`, use the `.cmd` commands shown above. If those are also blocked,
ask your facilitator; do not weaken execution policy.
The [setup/start/test scripts](../scripts) are optional wrappers around these
commands. Tests are preconfigured; Module 3 adds coverage, not tooling.

### Prepare browser tests before Module 3

Leave the app terminal running and open a **second terminal at the repository
root**. After dependency installation has completed, and only if permitted, run:

```powershell
Set-Location .\client
npx.cmd playwright install chromium
npm.cmd run test:e2e
npm.cmd run test:a11y
```

Playwright starts and stops its own app server on **127.0.0.1:5174** and uses
isolated browser data, not your manual app's records. Resolve download or test
failures with your facilitator; do not bypass organizational policies or retry
prohibited downloads. If unavailable, record the restriction/error and follow
Module 3's [restricted-environment alternative](3-testing.md#restricted-environment-alternative):
keep unit/integration tests, use an approved browser manually, and record
expected-versus-actual results. Manual checks are not automated browser tests;
E2E and axe coverage remain unverified. No new packages are needed.
The supplied baseline tests should pass even though the
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
Explore this repository and give me a brief, beginner\-friendly overview.

Do not edit any files or install anything.

Explain:

1. What is the Inspection Findings Tracker, and what is its purpose?
2. Who are the intended users, and what can they do with the application?
3. What technologies and frameworks does the application use?
4. How is the repository organized, and where are the main application files?
5. How do I run the application locally?

Keep your response concise, use simple language, and reference relevant files.

Focus on understanding the repository at a high level. Do not analyze the application's detailed business logic, trace its technical data flow, or investigate potential issues.
```

If Copilot needs more context, attach the [client/src](../client/src)
files using Chat's context picker. Compare its explanation
with the finding you just saved.

You are ready when the baseline tests and build pass, the app runs, you can
save and view a finding, and Copilot has explained the application. For the
preferred full testing path, also confirm browser preparation succeeds.
Otherwise record the restricted path and its coverage gaps with the facilitator.

**Next: [Module 1 - Requirements and acceptance criteria](1-requirements.md).**
Keep the app running. When finished with the workshop, press **Ctrl+C**
in its terminal.
