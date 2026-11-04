# Module 0 - Environment setup and baseline run

## 1. Objective

**Timebox: 15 minutes.** Set up and run the inherited Inspection Findings
Tracker locally. Locate the frontend, API, scoring rules, and tests, then
confirm GitHub Copilot (GHCP) Chat responds in VS Code.

Do not improve the code yet. Your output is a verified baseline for
[Module 1](1-requirements.md).

## 2. Why this matters in real SDLC

Before changing a service, a delivery team needs a reproducible environment
and evidence of its current behavior. Otherwise, setup failures can be mistaken
for code defects, and generated changes can hide existing problems.

For this inspection team, the baseline is concrete: a high-severity synthetic
finding currently scores **80** and recommends **Prioritize immediate review**.
These are training rules, not official CFIA policy.

## 3. Tasks

### A. Confirm prerequisites and open the workspace (3 minutes)

Have these ready before the session:

- VS Code with GitHub Copilot Chat available and an authorized account signed in.
  Account provisioning is pre-work, not part of this timebox.
- Python **3.11 or newer**.
- Node.js **22.12 or newer**; Node.js 24 LTS is recommended.
- The workshop repository downloaded or provided locally.
- Network access to install Python/npm packages and use Copilot.

In VS Code, select **File > Open Folder** and open the repository root,
the folder containing [the root README](../README.md), [client](../client),
and [server](../server). No GitHub.com, Codespaces, Azure subscription, or
Azure DevOps project is required.

Open **Terminal > New Terminal** using PowerShell. Confirm:

```powershell
Get-Location
python --version
node --version
npm --version
```

The terminal must start at the repository root. If a tool is missing or below
the required version, ask the facilitator for the pre-work recovery path rather
than debugging an installation for the rest of the module.

### B. Install dependencies and start FastAPI (4 minutes)

In terminal 1, from the repository root:

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r .\server\requirements.txt
.\.venv\Scripts\python.exe -m pytest .\server\test_app.py -q
.\.venv\Scripts\python.exe -m uvicorn server.app:app --reload --host 127.0.0.1 --port 8000
```

Expect **2 passed** from pytest and a Uvicorn startup message for port 8000.
Leave this terminal running. Using the virtual environment's executable
directly avoids PowerShell activation-policy issues.

Open `http://127.0.0.1:8000/docs` in your browser. Confirm both `GET /findings`
and `POST /findings` appear. You do not need to submit through Swagger yet.

### C. Start React and verify the create/list baseline (4 minutes)

Open terminal 2 in VS Code. From the repository root:

```powershell
Set-Location .\client
npm ci
npm run dev
```

Leave it running and open `http://127.0.0.1:5173`.
Vite forwards `/findings` requests to FastAPI on port 8000; do not add CORS
middleware or change API URLs for this baseline.

Enter:

| Field | Synthetic value |
| --- | --- |
| Inspector ID | `INS-001` |
| Facility name | `Demo Facility` |
| Inspection type | `Routine` |
| Severity | `High` |
| Notes | `Synthetic finding: damaged storage seal.` |

Select **Save finding**. Verify:

1. A saved-finding confirmation shows risk score **80** and follow-up
   **Prioritize immediate review**.
2. The finding appears under **Existing findings**.
3. The form clears after the successful save.
4. Refreshing the browser still displays the finding, demonstrating the GET flow.

Storage is in memory: restarting or reloading the backend clears findings.
Browser refresh alone does not restart the backend. Use only synthetic data.

### D. Locate the code and confirm Copilot Chat (4 minutes)

Use the VS Code Explorer to open these files:

| File | What to locate |
| --- | --- |
| [client/src/App.tsx](../client/src/App.tsx) | Initial GET, save handler, score display, and list |
| [client/src/FindingForm.tsx](../client/src/FindingForm.tsx) | Finding inputs and submit behavior |
| [client/src/api.ts](../client/src/api.ts) | POST/GET calls and request/response types |
| [client/vite.config.ts](../client/vite.config.ts) | Local proxy to FastAPI |
| [server/app.py](../server/app.py) | POST/GET routes and in-memory list |
| [server/models.py](../server/models.py) | Required fields and severity values |
| [server/risk.py](../server/risk.py) | Severity-to-score training rules |
| [server/test_app.py](../server/test_app.py) | Two baseline tests |

Open Chat from the VS Code UI or run **Chat: Open Chat** from the Command Palette.
Use a question-only mode such as **Ask**, if available; do not authorize edits.
Attach the relevant files using Chat's context picker, then run the prompts below.

## 4. VS Code + GHCP prompts to run

**Prompt 1 - Map the running feature.** Attach
[App.tsx](../client/src/App.tsx), [FindingForm.tsx](../client/src/FindingForm.tsx),
[api.ts](../client/src/api.ts), [app.py](../server/app.py), and
[risk.py](../server/risk.py).

```text
Do not edit files or install anything. Trace one finding from Save finding
in the React form through POST /findings to the displayed risk score and
follow-up action. Then explain how GET /findings populates the list after
a browser refresh. Name the actual files and functions at each step.
Use the attached code, not an assumed architecture.
```

**Prompt 2 - Verify the baseline contract.** Attach
[models.py](../server/models.py), [risk.py](../server/risk.py), and
[test_app.py](../server/test_app.py).

```text
Do not modify code. For the high-severity synthetic finding I just submitted,
identify the expected risk_score and exact follow_up_action from risk.py.
Explain what the two existing tests prove and name one behavior they do not
cover. Distinguish test evidence from assumptions.
```

Check the answers against the open files and the result you observed.
Copilot responding confirms Chat access; an accurate response still requires
your review. If context is missing, attach the file explicitly and retry.

## 5. Checkpoint

Before moving to Module 1, show your facilitator or partner:

- Both local servers running on ports **8000** and **5173**.
- Backend tests reporting **2 passed**.
- A saved synthetic finding showing **80** and **Prioritize immediate review**,
  still listed after a browser refresh.
- The frontend save/API files and backend route/scoring files in Explorer.
- A Copilot Chat response grounded in the files you attached.

Keep both servers running for the next module. At the end of the workshop,
stop each server with **Ctrl+C** in its own terminal.

## 6. Retrospective checklist

- [ ] I can reproduce setup using repository commands, not generated guesses.
- [ ] I can explain why baseline behavior must be observed before edits.
- [ ] I can locate the form, API utility, route, scoring rule, and tests.
- [ ] I know browser refresh preserves data but backend restart clears it.
- [ ] I verified a Copilot answer against both source code and visible behavior.
- [ ] I discussed at least one trap below with a partner or facilitator.

## 7. Common traps

| Trap | Concrete recovery or guardrail |
| --- | --- |
| Assuming the scripts install or test everything automatically | [scripts](../scripts) supports setup/start/test shortcuts, but frontend tests are skipped until Module 4 configures them. Use the explicit commands above to learn each step. |
| Starting Uvicorn from inside the server folder | Run it from the repository root so `server.app:app` and `server.models` resolve correctly. |
| Using a different Python for install and tests | Use `.\.venv\Scripts\python.exe` for pip, pytest, and Uvicorn. Do not install dependencies globally. |
| PowerShell blocks `npm.ps1` | Use `npm.cmd ci` and `npm.cmd run dev`; do not weaken machine-wide execution policy. |
| UI loads but requests fail | Confirm FastAPI is running on 8000. After starting it, click **Refresh findings** and retry the save. Do not accept a speculative CORS rewrite. |
| A required port is occupied | Ask the facilitator to identify the owner. Do not kill unrelated processes or change one port without updating its proxy/client connection. |
| Copilot invents files, commands, or scoring rules | Attach actual files, demand file/function references, and compare the answer with the observed score. |
| Treating two green tests as proof of correctness | They cover an empty list and one high-severity create/list flow, not comprehensive validation or security. |
| Accepting Copilot's offer to improve the starter now | Keep Module 0 read-only. Preserve the intentional gaps for the implementation and hardening modules. |
