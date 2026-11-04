# Facilitator guide

## Session contract

Audience: strong intermediate engineers, mostly new to GitHub Copilot (GHCP).
Core duration: **120 minutes**. Optional CI module: **20-25 additional minutes**.

Follow the [participant narrative](../docs/README.md): one inherited Inspection
Findings Tracker, one inspector-lead story, and one continuous improvement.
Use synthetic data only. Scores are training rules, not official CFIA policy.
Keep all core work in local VS Code; do not introduce GitHub.com or Codespaces
as a rescue dependency.

Repeat this refrain: **"Copilot proposes; you review; checks provide evidence."**
Do not describe generated output as deterministic or treat a green build as
proof of secure behavior.

| Module | Timebox | Session clock | Facilitator transition |
| --- | --- | --- | --- |
| 0 | 15 min | 00:00-00:15 | Baseline observed; no code changes yet. |
| 1 | 15 min | 00:15-00:30 | Agree on rules before implementation. |
| 2 | 35 min | 00:30-01:05 | One bounded cross-stack slice, not a rewrite. |
| 3 | 25 min | 01:05-01:30 | Review the actual slice and reproduce findings. |
| 4 | 20 min | 01:30-01:50 | Tests use criteria as independent oracles. |
| 5 | 10 min | 01:50-02:00 | Convert evidence into three reusable habits. |
| Optional 6 | 20-25 min | After 02:00 | Repeat local gates remotely; no deployment. |

Timeboxes include demonstrations, checkpoints, and short debriefs. There is no
extra buffer hidden outside the two hours.

## Before participants arrive

- Verify VS Code, Copilot access, Python 3.11+, and Node.js 22.12+; recommend
  Node.js 24 LTS. Account approval and tool installation are pre-work.
- Give participants a local repository copy and verify package-feed/Copilot
  access on the actual workshop network.
- Run the [root setup commands](../README.md) and check ports 8000/5173,
  baseline pytest, frontend build, and one browser create/list flow.
- Rehearse Modules 1-4 in a **separate local working copy**. Prepare reviewed
  small rescue diffs for normalization, form feedback, unknown-field rejection,
  error parsing, and UI-test setup. Do not harden the distributed starter.
- Prepare a local working checkpoint after each coding module, including its
  criteria and test evidence. These recovery copies are **not currently
  supplied in this repository**; create and validate them before teaching.
- Rehearse the Vitest/jsdom installation and test on the classroom machines.
  Module 4 adds dependencies and a runner; the starter has no frontend test script.
- If needed, have IT prepare approved local package caches or an offline feed.
  Do not assume a virtual environment copied between machines will work.
- Keep one instructor machine running for paired/demo fallback. Prepare saved
  non-sensitive prompt responses and check output for a Copilot/network outage;
  label them as recorded examples, not live results.
- For optional Module 6, complete its
  [Azure DevOps pre-work](../docs/optional-6-azure-devops-cicd.md): participant
  branches/remotes, existing pipeline IDs, CLI authentication, agent permissions,
  parallel capacity, and runtime availability. Rehearse a successful run and
  save a failed-gate example.

**Readiness caveat:** the runnable starter and participant guides exist, but
setup/start/test scripts and the three-stage root pipeline are available.
Use explicit commands to teach individual steps, or keep the start script's
supervising terminal open and use another terminal for checks.
Do not announce reference solutions, recovery snapshots, or fully rehearsed
module outcomes until you have prepared and verified them.

## Room pacing for mixed speeds

Use three visible states, not a competition:

- **Green:** checkpoint demonstrated; proceed to a listed extension or help a partner.
- **Amber:** working on the current step with a specific failing check.
- **Red:** unable to run or access required tooling.

Ask for status at each module midpoint and two minutes before its end.
Participants report **step + command + observed result**, not "Copilot is broken."
Keep responses free of real records, tokens, or confidential project data.

For a blocker:

1. Spend up to **90 seconds** checking directory, runtime, exact error, and context.
2. Offer one small correction and rerun the same check.
3. If still blocked after roughly **three minutes**, pair with a green participant
   or use a reviewed rescue diff. Have the learner explain and verify it.
4. By **five minutes**, move to the fallback lane; preserve the original workspace.
   Never overwrite participant changes or call unexecuted work complete.

Pair a driver and navigator; switch roles each module. The navigator reviews
criteria and assertions while the driver operates VS Code. Green participants
must ask before editing another learner's code.

Protect Module 5. If time slips, reduce optional elaboration and use its
five-minute fast path, not a skipped retrospective. Missing core evidence remains
incomplete; rescue is not permission to lower the acceptance criteria.

## Module 0 - Environment setup and baseline

**Timebox:** 15 minutes. [Participant steps](../docs/0-prereqs.md).

**Talk track:** "You inherited an app that already works. Before improving it,
prove the starting behavior and find the code. Ask Copilot to explain, not edit."

**What success looks like:** both servers run; baseline tests report two passes;
a high finding shows 80 / Prioritize immediate review and survives browser
refresh; the participant locates form/API/route/scoring files and gets a
code-grounded Copilot Chat response.

**Likely blockers:** wrong terminal directory or Python, missing dependencies,
PowerShell npm policy, occupied ports, or unsigned-in Copilot.

**Rescue interventions:**

- Use the virtual environment's executable directly; use `npm.cmd` if npm.ps1
  is blocked. Do not weaken machine-wide execution policy.
- Confirm Uvicorn starts at the repository root and Vite proxies to port 8000.
- Identify port ownership with the learner; do not terminate unrelated processes.
- Pair learners with provisioning problems rather than spend the lab installing tools.

**Debrief questions:** "Where is the score computed? What does browser refresh
prove? What resets the list? Which claim in Chat did you check against source?"

**Module-specific GHCP traps:** invented setup commands, speculative CORS fixes,
unrequested starter rewrites, and treating two tests as comprehensive coverage.
Require file/function evidence and keep code unchanged.

## Module 1 - Requirements and acceptance criteria

**Timebox:** 15 minutes. [Participant steps](../docs/1-requirements.md).

**Talk track:** "Our oracle is a reviewed contract, not whatever code Copilot
generates. Make 'consistent triage' observable before we implement it."

**What success looks like:** saved [requirements.md](../requirements.md) with
F/V/NF IDs, exact scores/actions, text/type/extra-field rules, boundary cases,
verification methods, scope, and definition of done. Desired behavior is not
misrepresented as implemented.

**Likely blockers:** over-designing scoring, vague non-functional criteria,
debating production policy, or confusing document completion with feature completion.

**Rescue interventions:**

- Point to the fixed synthetic 20/50/80 table and 40/120/60/1000 text limits.
- Model one Given/When/Then: a whitespace-only facility returns 422 and leaves
  storage unchanged.
- Ask the learner to name the input and verification for any "secure/reliable"
  criterion. Keep authentication/persistence outside scope.
- Use the module's provided contract as a drafting aid, but require the
  participant to explain and save it.

**Debrief questions:** "What is the definition of done? Which criterion needs
server enforcement? What behavior is observed versus not yet implemented?"

**Module-specific GHCP traps:** invented CFIA policy, omitted type/whitespace
boundaries, unchecked assumptions, and accepting vague criteria because they sound professional.

## Module 2 - End-to-end implementation

**Timebox:** 35 minutes. [Participant steps](../docs/2-implementation.md).

**Talk track:** "Keep the working create/list flow. Change one bounded slice:
normalize valid input and provide matching feedback. Explain, approve, apply,
then stop and verify after each layer."

**What success looks like:** backend strict text validation/normalization,
matching frontend feedback and normalized payload, one new normalization test,
passing build/tests, exact severity outputs, and direct invalid POST rejection.
Requirements record remaining review/testing work.

**Likely blockers:** Pydantic validator ordering/coercion, JS code-unit counting,
frontend reset on failure, stale data after reload, or a huge proposed diff.

**Rescue interventions:**

- Inspect trimming before length checks and strict rejection of non-strings.
- Point out `Array.from(text).length` versus `.length`; do not silently truncate.
- Verify the existing boolean save contract: reset only on success.
- Wait for backend reload, then recreate data before checking GET.
- Supply one prepared layer-sized rescue diff if needed; require review and
  the same tests/browser checks. Do not replace the whole app.

**Debrief questions:** "Which rule crosses both layers? What did your diff leave
unchanged? Why is the score server-derived? Which check caught a wrong assumption?"

**Module-specific GHCP traps:** one-shot whole-app prompts, blind diff acceptance,
duplicated scoring, weakened assertions, and calling all criteria done after a build.

## Module 3 - Security and code-quality review

**Timebox:** 25 minutes. [Participant steps](../docs/3-security-review.md).

**Talk track:** "Review the changed code as a draft. An API caller can bypass the
form. A review finding needs a reproducer and measurable impact, not just a warning."

**What success looks like:** one resolved security-related issue and one
distinct quality issue, with before/after evidence and preserved valid behavior.
Default targets are unknown-field rejection and useful, safe validation-error context.

**Likely blockers:** treating ignored score input as a demonstrated override,
counting one patch twice, inspecting only UI validation, broad error catches,
or echoing entire error objects containing submitted input.

**Rescue interventions:**

- Run the extra-score reproduction. If the server returns 80, explain that
  the gap is unexpected-field acceptance, not proven score manipulation.
- Guide `extra="forbid"` and a 422/full-unchanged-list regression assertion.
- Inspect the actual FastAPI error shape; extract known field context with
  type guards, not raw input or traceback.
- If a default issue is already resolved, select a confirmed small alternative,
  such as misleading empty state after a failed GET. Never introduce a defect.
- Keep safe JSX text rendering and the local-only scope.

**Debrief questions:** "What changed? Why does it reduce risk? What input now
behaves differently? Which distinct quality fix helps the inspector lead?"

**Module-specific GHCP traps:** generic OWASP output, unverified exploit claims,
HTML blacklists replacing safe rendering, silent success-shaped fallbacks,
and a broad refactor disguised as remediation.

## Module 4 - Tests and confidence

**Timebox:** 20 minutes. [Participant steps](../docs/4-testing.md).

**Talk track:** "Generate from the contract. Tests that copy the same wrong rule
from production code do not provide an independent oracle."

**What success looks like:** explicit risk tuple tests, real in-process API
validation/state assertions, at least one new Unicode-boundary edge case,
one automated App flow with fetch stubbed, passing build, live smoke evidence,
and a map of remaining gaps.

**Likely blockers:** first-time Vitest/jsdom setup, unsupported assertions,
ambiguous score text, unawaited user events, shared global state, or test expectations
derived from `RISK_RULES`.

**Rescue interventions:**

- Use the prepared runner/config diff; retain the Vite proxy and lockfile.
- Import Vitest APIs explicitly and use standard assertions; do not assume
  extra DOM matchers were installed.
- Scope UI assertions to the saved status/list; await events and async results.
- Reuse fixture cleanup and clear global fetch stubs after each test.
- Show the 1000/1001-code-point oracle and unchanged-list assertion.
- Diagnose setup versus behavior failures; preserve failing criteria.
  If the runner cannot execute, record that checkpoint as incomplete.

**Debrief questions:** "What does your new edge test catch? What does the mock
exclude? How are passing tests different from sufficient confidence?"

**Module-specific GHCP traps:** snapshot-only tests, circular expected values,
HTTP-status-only rejection checks, skipped failures, arbitrary sleeps, and
calling jsdom a real end-to-end environment.

## Module 5 - Retrospective and reuse

**Timebox:** 10 minutes; five-minute fast path if needed.
[Participant steps](../docs/5-retrospective.md).

**Talk track:** "Take three habits home: criteria before code, explain/bound/apply,
and tests against an independent oracle. Tie each to something you actually verified."

**What success looks like:** [playbook](../prompts/prompt-playbook.md) records
three prompt patterns, three traps with mitigations, three next-project
applications, and one chosen next action.

**Likely blockers:** generic lessons, invented success stories, no next-project
task, or fatigue leading to a skipped debrief.

**Rescue interventions:**

- Ask for one exact prompt, criterion, command, and result to seed the entries.
- Use the three supplied patterns and traps as templates, not claimed experiences.
- Have each partner finish: "On my next task, I will supply X and verify with Y."
- Use the five-minute path while preserving all three patterns/traps.

**Debrief questions:** "Which habit will you try next? Which trap did you
observe or anticipate? What remains unverified in this app?"

**Module-specific GHCP traps:** vague "better prompts" advice, fabricated evidence,
and retrospective output that promises automatic correctness.

## Optional Module 6 - Azure DevOps CI handoff

**Timebox:** 20-25 additional minutes.
[Participant steps](../docs/optional-6-azure-devops-cicd.md).

**Talk track:** "CI repeats the checks on the committed code, not your current
unsaved workspace. We are learning install/test/build gates, not building a release platform."

**What success looks like:** reviewed YAML, approved commit pushed to the supplied
Azure Repos branch, remote completed/succeeded run for that commit, named gate
results, and an explanation of failure propagation.

**Likely blockers:** skipped frontend test suite, wrong branch,
CLI permissions, unavailable hosted-agent capacity, private package feeds,
or confusing queued with successful.

**Rescue interventions:**

- Confirm Module 4 files/manifests/lockfile are committed and the run source
  commit matches the intended HEAD.
- Use the pre-provisioned pipeline ID and authorized `workshop` remote.
  Do not replace participant remotes or insert credentials.
- Show the named failed-gate log and equivalent local command.
- For access/capacity problems, switch to the prepared instructor run and label
  learner execution not performed or pending.
- Explain why each stage restores dependencies on a fresh agent. For Azure Repos
  PR validation, configure the main-branch build policy before the workshop.
  No deployment or extra service connections are needed for the Azure Repos flow.

**Debrief questions:** "Which commit ran? Which local command maps to each
gate? Why were later steps skipped? What does this green run not prove?"

**Module-specific GHCP traps:** `continueOnError`, omitted UI gates, unnecessary
dev servers, hardcoded credentials, and deployment scope creep.

## Fast-finish extensions

Offer only after the learner demonstrates the current checkpoint. Keep them
small and connected to the same criteria; do not make them prerequisites for peers.

| Module | Extension |
| --- | --- |
| 0 | Trace the proxy/API request in browser network tools; explain why no CORS change is needed. |
| 1 | Write a concrete missing/null/numeric case for each field and its exact storage effect. |
| 2 | Verify a Unicode name at its code-point boundary and unchanged internal line breaks in notes. |
| 3 | Review stale-list/empty-state behavior after a failed GET and propose a bounded fix with a reproducer. |
| 4 | Add a UI failed-save test proving visible error, preserved values, no phantom entry, and re-enabled submit. |
| 5 | Adapt one prompt to an abstract next-project task and have a partner critique its verification plan. |
| Optional 6 | Explain how a stale lockfile fails `npm ci`, using a recorded example rather than breaking the shared branch. |

Do not offer authentication, databases, new scoring algorithms, or deployment
as fast-finish tasks; these fragment the storyline and increase support burden.

## Environment fallback ladder

| Failure | Practical fallback | Evidence status |
| --- | --- | --- |
| Copilot unavailable, code/tooling works | Use recorded prompt output and manual edits in the same VS Code files; review and run checks normally. | Code evidence can be live; Copilot interaction is not demonstrated. |
| One participant cannot run locally | Pair on a working local machine with driver/navigator roles; preserve the blocked workspace for later repair. | Record which checks the pair actually executed. |
| npm/package network unavailable | Use an IT-prepared approved cache/feed on the same machine; otherwise pair with a prepared machine. | Do not claim installation/test success until run. |
| Frontend unavailable but Python works | Complete criteria, API tests, and threat review while pairing for UI work. | Frontend/build/UI checkpoint remains incomplete unless actually executed. |
| Both runtimes unavailable | Do requirements and source-review exercises in VS Code using the instructor's local demo/recorded diffs. | Review/requirements only; no learner runtime success claim. |
| Module 4 runner blocked | Apply a reviewed prepared runner diff and retry once; then use paired execution or label demonstration-only. | Manual smoke does not substitute for the automated UI checkpoint. |
| Azure DevOps blocked/queued | Explain YAML locally and inspect the instructor's saved or live run. Keep run ID for later verification. | Learner remote run is unperformed or pending, not succeeded. |

Never disable organizational policy, share credentials, expose the API publicly,
or overwrite unrelated participant work to rescue a session.

## Closing the room

Ask participants to show a checkpoint, two specific verification results, and
their next-project habit. Tally completed, paired, and demonstration-only outcomes
separately. Collect remaining blockers for follow-up; do not convert them into
success claims.

End with: **"Copilot accelerated the SDLC work. Reviewed requirements,
bounded changes, and test evidence made the result trustworthy."**
