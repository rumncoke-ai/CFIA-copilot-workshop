# Optional Module 6 - Azure DevOps CI/CD handoff

## 1. Objective

**Optional timebox: 20-25 additional minutes** after the two-hour core lab.
Understand and run a minimal Azure Pipeline that repeats Module 4's local
checks in the order **install -> test -> build**.

Edit YAML and queue/inspect the run from VS Code's local terminal.
No GitHub.com, Codespaces, deployment, service connection, or Azure resource
provisioning is required. Azure DevOps access and agent capacity are separate
pre-work requirements; a remote CI run is not an offline local test.

This module implements **CI**, not production CD. Release automation remains
out of scope.

## 2. Why this matters in real SDLC

Local checks protect your current workspace. CI repeats them against the
committed code on a clean agent so another developer does not need your machine
to reproduce the result.

| Local check | CI gate | Meaning of failure |
| --- | --- | --- |
| Install backend requirements and `npm ci` | Install | The clean agent cannot restore the declared dependencies. |
| Backend pytest | Test: backend | Scoring or API assertions failed, or the test environment is broken. |
| Vitest UI test | Test: frontend | The component flow failed in jsdom; this is not a real-browser E2E gate. |
| TypeScript and Vite build | Build | The frontend cannot type-check or produce a bundle. |

Later gates must not run after a failed earlier gate. A green pipeline proves
these checks passed for one commit, not that the tracker is production-ready.

## 3. Tasks

### A. Confirm pre-work and local gates (4 minutes)

The facilitator must provide before this module:

- An Azure DevOps organization/project and an Azure Repos Git repository.
- A participant-specific branch and an authorized Git remote named `workshop`
  pointing to that repository. Keep any existing remotes; do not replace them.
- A pre-created YAML pipeline referencing the root
  [azure-pipelines.yml](../azure-pipelines.yml), its numeric pipeline ID,
  and permission to queue builds on the participant branch.
- Microsoft-hosted Windows agent capacity, including any required parallel-job
  grant, and availability of Python 3.14 and Node.js 24 on the selected agent.
- Azure CLI 2.30+ with the `azure-devops` extension installed and authenticated
  through the organization's approved method.

Do not create accounts, configure agents, or paste access tokens during the lab.
No Azure subscription is needed for this install/test/build pipeline.

Module 4 must be complete: the frontend `test` script, test dependencies,
lockfile, and UI test must exist. The unmodified starter has no frontend test
script. Do not remove that gate to make the pipeline green.

In a repository-root PowerShell terminal:

```powershell
az version
az extension show --name azure-devops --query version --output tsv
git remote get-url workshop
git branch --show-current
.\.venv\Scripts\python.exe -m pytest .\server\test_app.py -q
npm --prefix .\client test
npm --prefix .\client run build
```

Confirm the remote is the facilitator-provided Azure Repos location and the
branch is yours. Do not paste remote URLs containing credentials into Chat.
If access or capacity is missing, use a facilitator demonstration and record
your own CI execution as **not performed**; do not claim a successful run.

### B. Read the three-stage pipeline (5 minutes)

Open the existing root [azure-pipelines.yml](../azure-pipelines.yml).
Do not replace it with a second copy. Trace this flow:

| Stage | Tasks | Gate |
| --- | --- | --- |
| Setup | Select Python 3.14 and Node.js 24; run the setup script. | Both dependency installs succeed. |
| Test | Select runtimes and restore on the new agent; run the test script. | Backend and configured frontend suites pass. |
| Build | Select Node.js, restore frontend dependencies, and run the build. | TypeScript and Vite build succeed. |

Each stage has one job and a fresh hosted agent. Installed dependencies are
not shared between stages, so Test restores both stacks and Build restores
the frontend. This deliberate repetition avoids caches/artifact engineering
in the workshop.

The test script explicitly skips client tests if `scripts.test` is absent.
That supports the starter, but Module 4 completion is still required for this
module's UI-test evidence. Read the summary; a green run with a skipped suite
is not proof of frontend behavior.

Stage dependencies and `condition: succeeded()` prevent later stages from
running after failure. Scripts throw on errors and native build/install steps
propagate exit codes. Do not add `continueOnError`.

Setup creates a stage-local `.venv`; tests use TestClient and jsdom with mocked
HTTP. Do not start Uvicorn or Vite servers in CI. This pipeline neither deploys
nor publishes the build bundle.

Pushes to `main` trigger CI. YAML `pr` triggers validate pull requests targeting
`main` for GitHub/Bitbucket Cloud connections. For the workshop's Azure Repos
Git path, the facilitator must configure a **main-branch build-validation
policy** referencing this pipeline; YAML alone does not enable Azure Repos PR
validation. Participants can still queue their branch manually from VS Code.

Use Prompt 1 below to explain the YAML, then inspect it yourself.

### C. Publish the reviewed commit and queue a run (7 minutes)

In VS Code Source Control, review and commit the YAML together with the
application/test changes and dependency manifests/lockfile from earlier modules.
Stage only intended workshop files; exclude virtual environments, node_modules,
build outputs, logs, and secrets.

Push your approved participant branch to the supplied remote:

```powershell
git push workshop HEAD
if ($LASTEXITCODE -ne 0) { throw "Workshop push failed." }
$branch = git branch --show-current
$commit = git rev-parse HEAD
```

Set these values from the facilitator's handoff, then queue the existing pipeline.
Replace the example values before running:

```powershell
$org = "https://dev.azure.com/YOUR-ORG"
$project = "YOUR-PROJECT"
$pipelineId = 123

$runJson = az pipelines run --id $pipelineId --branch "$branch" `
    --org "$org" --project "$project" --output json
if ($LASTEXITCODE -ne 0) { throw "Pipeline queue request failed." }
$run = $runJson | ConvertFrom-Json
$runId = $run.id
"Queued run $runId for branch $branch"
```

A queued run is not a successful run. After the agent has had time to execute,
check status from the same terminal:

```powershell
az pipelines runs show --id $runId --org "$org" --project "$project" `
    --query "{id:id,status:status,result:result,commit:sourceVersion}" --output table
```

Expected final state: **completed / succeeded** and the same source commit as
`$commit`. If a newer commit was pushed while queuing, confirm which commit ran
and queue again if needed.

### D. Inspect gate results and interpret a failure (5 minutes)

Inspect the named steps without leaving VS Code:

```powershell
$timelineJson = az devops invoke --org "$org" --area build --resource timeline `
    --route-parameters "project=$project" "buildId=$runId" `
    --api-version 7.1 --output json
if ($LASTEXITCODE -ne 0) { throw "Could not retrieve pipeline timeline." }
$timeline = $timelineJson | ConvertFrom-Json
$timeline.records | Where-Object { $_.type -eq "Task" } |
    Select-Object name,state,result
```

If a gate failed, find its log ID:

```powershell
$failed = $timeline.records |
    Where-Object { $_.type -eq "Task" -and $_.result -eq "failed" }
$failed | Select-Object name,@{Name="logId";Expression={$_.log.id}}
```

Choose the relevant log ID and download its text to a temporary file:

```powershell
$logId = 7 # Replace with the failed task's actual log ID.
$logPath = Join-Path $env:TEMP "cfia-run-$runId-log-$logId.txt"
az devops invoke --org "$org" --area build --resource logs `
    --route-parameters "project=$project" "buildId=$runId" "logId=$logId" `
    --api-version 7.1 --accept-media-type text/plain --out-file "$logPath"
if ($LASTEXITCODE -ne 0) { throw "Could not download task log." }
code "$logPath"
```

Use Prompt 2 with only non-sensitive failing output.

- **Install failure:** check runtime versions, manifest/lockfile consistency,
  and package-feed access. Private feeds need facilitator configuration, not
  hardcoded credentials.
- **Test failure:** reproduce the same command locally and investigate the
  actual assertion. Preserve criteria and regression tests.
- **Build failure:** run the local build and repair the relevant TypeScript
  or bundle error.
- **Waiting for an agent:** this is a capacity/access issue, not a code failure.
  Ask the facilitator; do not redesign the pipeline.

After a fix, review, commit, push, and queue again. Verify later gates were
skipped after the original failure. If the first run succeeds, discuss a
facilitator-provided failed-run example instead of introducing a defect.

### E. Record the handoff (2 minutes)

In [requirements.md](../requirements.md), add:

`Run ID | Branch | Source commit | Install result | Test results |
Build result | Remaining limitations`

Record only observed results. If agent queues exceed the timebox, record
**queued/in progress**, hand the run ID to the facilitator, and verify completion
later. A demonstrated run is not your own successful run.

Stop any local app servers when finished.

## 4. VS Code + GHCP prompts to run

**Prompt 1 - Explain the gate mapping**

Attach the YAML and [client/package.json](../client/package.json).

```text
Do not edit files. Explain how this pipeline maps our local install, backend
test, frontend test, and build commands to CI gates. Identify runtime versions,
working directory, failure propagation, and why app servers are unnecessary.
State what a successful run does not prove. Do not add deployment or new tooling.
```

Expected: `Step | Local equivalent | Success evidence | Failure effect` table.

**Prompt 2 - Diagnose a failed gate**

```text
Do not edit yet. This gate failed: [name].
Non-sensitive log excerpt: [output].
Separate dependency/setup, test behavior, build, and agent-capacity failures.
Give the equivalent local command and smallest justified repair.
Do not bypass gates, remove assertions, or insert credentials into YAML.
```

Expected: evidence-backed diagnosis and local reproduction command.

**Prompt 3 - Summarize CI evidence**

```text
Do not edit code. Using the actual run status, source commit, and step results,
summarize what our pipeline verified and which risks remain.
Distinguish queued, completed/failed, and completed/succeeded.
Do not claim deployment or production readiness.
```

Expected: concise handoff with run ID, verified commit, gates, and limitations.

## 5. Checkpoint

- The root YAML defines the reviewed install/test/build flow.
- You can explain which local command each gate runs.
- The intended commit is present in the Azure Repos participant branch.
- Your remote run is **completed / succeeded**, with all named gates passing.
- You can locate step results and explain how one failure blocks later gates.

If remote execution was unavailable, mark this checkpoint incomplete and record
the facilitator demonstration separately.

## 6. Retrospective checklist

- [ ] I can map each CI gate to a local check I already ran.
- [ ] I verified the run's source commit, not just its green status.
- [ ] I can distinguish a queued run from a successful completed run.
- [ ] I can diagnose test failures separately from agent/feed failures.
- [ ] I know this pipeline is CI only and does not deploy the tracker.
- [ ] I can name a risk not covered by these tests/build gates.
- [ ] I kept secrets, real data, and gate bypasses out of the YAML.

## 7. Common traps

| Trap | Concrete guardrail |
| --- | --- |
| Green run skips frontend tests | Finish Module 4 and commit the test script, manifests, lockfile, and tests before queuing. A skip is not frontend verification. |
| Testing uncommitted local files and assuming CI sees them | Push the reviewed commit and compare the run's source version with local HEAD. |
| Starting long-lived app servers during CI | Use in-process API tests and jsdom; no dev servers are needed for these gates. |
| Adding `continueOnError` to finish quickly | Keep gate failures blocking; fix and rerun instead. |
| Treating a capacity queue as a broken application | Have the facilitator confirm agent availability; record pending status honestly. |
| Pasting tokens or complete logs into Copilot | Use approved authentication and review/redact excerpts before sharing. |
| Expanding into release engineering | Stop at install/test/build; deployment, artifacts, approvals, and branch policies are follow-up topics. |

Command references: [Azure Pipelines CLI](https://learn.microsoft.com/en-us/cli/azure/pipelines?view=azure-cli-latest)
and [Azure DevOps invoke](https://learn.microsoft.com/en-us/cli/azure/devops?view=azure-cli-latest#az-devops-invoke).
