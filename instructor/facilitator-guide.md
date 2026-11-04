# Facilitator guide

## Session contract

Audience: intermediate engineers new to GitHub Copilot. Follow the
[participant narrative](../docs/README.md): one inherited React app, one
inspector-lead story, and continuous improvement through Modules 0-5.
Use synthetic data only. Scoring is not official CFIA policy.

**Copilot proposes; you review; checks provide evidence.**

| Module | Timebox | Transition |
| --- | --- | --- |
| 0 | 15 min | Observe the baseline and explain actual code. |
| 1 | 15 min | Agree on measurable rules before coding. |
| 2 | 35 min | Improve one form/service workflow, not a rewrite. |
| 3 | 25 min | Reproduce and address distinct review findings. |
| 4 | 20 min | Extend existing tests against independent oracles. |
| 5 | 10 min | Capture reusable patterns and honest evidence. |

Core total: two hours. There is no backend or optional CI/deployment track.

## Before participants arrive

- Verify VS Code, authorized Copilot access, Node.js 22.12+, PowerShell, and npm
  access. Recommend Node.js 24 LTS. Account/tool provisioning is pre-work.
- Run [quick setup](../README.md#quick-setup), tests, build, and the browser flow
  on the actual classroom network. Only port 5173 is needed.
- Baseline test count is **20** across scoring, local service, and App tests.
  Participant additions change the count; assertions matter more than totals.
- Use a separate rehearsal copy to complete Modules 1-4. Prepare small reviewed
  rescue diffs for normalization, field feedback, unknown-field rejection,
  failed-load presentation, and Unicode tests. Do not solve the distributed starter.
- Prepare verified recovery checkpoints yourself; they are not supplied reference
  solutions. Never overwrite participant work as a rescue.
- Use a fresh browser profile or confirmed reset before demonstrating. Existing
  localStorage survives Vite restarts. Keep the address `127.0.0.1:5173` consistent.
- Prepare an approved package cache/feed if needed. The test tools are already
  in the manifest/lockfile; participants should not install another runner.
- Keep saved synthetic prompt responses and check output for outage fallback.
  Label them as recorded examples rather than live results.

## Architecture talk track

One React + TypeScript app calls an asynchronous
[findings service](../client/src/findings.ts). On absent storage it loads a
[bundled synthetic example](../client/src/seed-findings.json), then persists
records in `cfia-workshop.findings.v1`. The [risk function](../client/src/risk.ts)
maps severity to exact score/action pairs.

There are no HTTP endpoints, credentials, database migrations, or cross-service
startup dependencies. The Vite process serves the UI, not an inspection API.
Promises retain meaningful load/save/error behavior without artificial latency.

Browser storage is not a trusted security boundary. Users can edit records,
scores, and code. Shape checking catches malformed data but does not establish
authenticity. Keep reliability hardening separate from production assurances.

## Room pacing and recovery

Use three states: **green** (checkpoint demonstrated), **amber** (specific failing
check), **red** (unable to run tools). Ask for step + command + observed result,
not "Copilot is broken." Pair a driver and navigator; switch roles each module.

For blockers, inspect directory/runtime/exact error, make one bounded correction,
and rerun the same check. If still blocked, pair the learner or use a reviewed
rescue diff. Preserve their original work. Never count unexecuted checks as passes.
Protect Module 5; shorten optional elaboration, not the evidence requirements.

## Module 0 - Setup and orientation

**Success:** one app runs; 20 baseline tests and build pass; a high finding
shows **80 / Prioritize immediate review**; reload retains it; cancel reset
preserves it and confirmed reset restores the example.

Keep the user's orientation workflow: run the app, then one Ask-mode prompt to
explain it. No starter edits yet.

**Likely blockers and recovery**

- `npm.ps1` policy: use `npm.cmd`; do not weaken machine-wide policy.
- Wrong directory: use root `--prefix .\client` commands.
- Occupied port: identify the owner; do not kill unrelated processes.
- Different records: confirm origin/profile; `localhost` and `127.0.0.1` differ.
- Corrupt synthetic storage: inspect the visible error, then explicitly reset.

**Debrief:** where is scoring computed, what initializes seeds, what survives a
restart, and which Copilot claim did you compare with source?

## Module 1 - Requirements

**Success:** [requirements.md](../requirements.md) contains F/V/NF IDs, exact
20/50/80 rules, 40/120/60/1000 limits, type/unknown-key rules, code-point
boundaries, persistence/reset behavior, and a definition of done.

Model one criterion: whitespace-only facility input rejects, identifies the
field, and leaves storage unchanged. Clarify that normalization/limits and strict
extra-key rejection are planned, not current protections.

**Watch for:** invented CFIA policy, runtime validation assumed from TS types,
requirements copied only from starter behavior, and production security claims.

## Module 2 - Implementation

**Success:** a normalized finding saves through the form/service, returns the
exact score/action, and survives reload. Invalid text leaves storage unchanged,
retains entered values, and provides usable field feedback.

Keep validation before any storage write and reuse shared rules. Explain why
`Array.from(text).length` differs from `.length` for emoji. Keep scoring pure and
leave unknown-field hardening for Module 3.

Prepare a normalization-test rescue diff. Reject unrelated libraries, new
backend infrastructure, silent catches, or test assertions weakened to match bugs.

**Debrief:** what did the new regression prove, and what remains unverified?

## Module 3 - Security and review

**Success:** one input-handling issue and one distinct code-quality issue have
reproduction, fix, and regression evidence.

Default targets:

1. Extra create-input keys are ignored: high severity still produces 80. The
   desired strict contract rejects extras without appending. Do not describe
   ignored `risk_score: 1` as a successful override exploit.
2. Load failure can coexist with a successful-looking empty/stale list. Separate
   error/empty states and provide honest retry/reset feedback.

Have learners inspect literal markup rendering and DevTools score tampering.
The first should already be safe React text behavior; the second demonstrates
the browser-only trust limitation, not an invitation to add browser secrets.

Do not silently recover corrupt storage with `[]` or clear unrelated keys.
Do not manufacture two findings from one issue. If a target was already fixed,
select another concrete defect in current feedback/validation behavior.

## Module 4 - Tests and confidence

**Success:** extended scoring, service, and App tests pass with a new edge case.
Require explicit output assertions and full unchanged-state checks.

Default new edge: trimmed 1000 emoji notes accepted; 1001 rejected. Use
`"\u{1F642}".repeat(1000)` so code-point and UTF-16 counts differ.

Keep real App/form/service integration in jsdom; do not stub the only behavior
under test. Inject storage failures only in the relevant cases. Restore spies,
clean the DOM, and isolate localStorage between tests.

**Debrief:** which checks are component evidence, which were observed in a real
browser, and what does a green build alone fail to establish?

## Module 5 - Retrospective

**Success:** [prompt playbook](../prompts/prompt-playbook.md) has three patterns,
three traps/mitigations, actual tracker evidence, and a next-project application
for each pattern. Label anticipated traps and unverified claims honestly.

Stop the single app process with Ctrl+C. Do not erase participant evidence.

## Fast-finish extensions

- Add a regression for internal newline preservation or accessible field feedback.
- Explain the difference between stored-shape validity and semantic consistency.
- Verify failed reset preserves both displayed and persisted records.

Keep authentication, shared records, CI/deployment, new scoring policy, and
unrequested features out of the core workshop.
