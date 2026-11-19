# Facilitator guide - One maintenance story

## Session contract

Participants inherit the React tracker, investigate whitespace-only facility
names, implement one bounded fix, establish test evidence, and review it.
Use synthetic data; scoring is not official CFIA policy.

**Copilot proposes; humans approve; checks provide evidence.**

| Module | Suggested duration | Transition/checkpoint |
| --- | --- | --- |
| 0 | 15 min, separate | Verify prerequisites, run the app, and prepare browser tests. |
| 1 | 15 min | Investigation explanation verified against source. |
| 2 | 35 min | Investigate -> plan -> regression failure -> bounded implementation -> human verification. |
| 3 | 35 min | Standalone contract -> unit -> integration -> browser, including a short accessibility check. |
| 4 | 25 min | Dedicated code review plus specialist security/accessibility review decisions. |
| 5 | 10 min | Handoff and reusable prompting/verification habits. |

Modules 1-5 total **120 minutes**. Including the separate 15-minute prerequisite
module gives **135 minutes**. Durations are suggested, not execution guarantees.
Protect checkpoints rather than rushing through unverified output.

## Prepare before participants arrive

- Verify quick setup, Copilot access, Node.js, npm feeds, and the classroom network.
- Use the **Copilot** harness/session target and verify its Agent mode picker
  has **Interactive, Plan, and Autopilot**. Rehearse exact UI labels.
  Confirm participants can follow Module 0's setup and current controls.
- Explain separately selected permissions. Never require unrestricted access.
- Confirm the intentionally unfixed starter accepts whitespace-only facility names.
- Run existing tests and build. Verify assertions, not a target test count.
- Rehearse Modules 1-4 in a separate working copy. Do not solve the distributed
  starter. Rehearse the [instructor recovery checkpoints](recovery/README.md)
  in an isolated worktree; keep the answer patches out of participant exercises.
  Git and approved package access/cache are needed for that recovery route.
- Keep each module's required headings and one-prompt-at-a-time rhythm.

## Browser-test preparation

After dependency installation, from repository root:

```powershell
Push-Location .\client
npx.cmd playwright install chromium
Pop-Location
npm.cmd --prefix .\client run test:e2e
npm.cmd --prefix .\client run test:a11y
npm.cmd --prefix .\client run build
```

Prepare browser downloads using the approved organizational network/cache.
Do not weaken security policy. Pre-provision Chromium where permitted;
standalone participants follow Module 3's setup. If it cannot be provisioned,
use Module 3's [restricted-environment alternative](../labs/3-testing.md#restricted-environment-alternative).
Retain unit/integration tests and document expected-versus-actual manual results
in an approved available browser. This supports continued learning, but leaves
automated browser/axe coverage unverified; manual checks are not equivalent E2E.
Do not require retries of prohibited downloads or installation of alternate tools.
MCP is optional and not used by the app or test runners; terminal execution and
attached source/results replace agent-tool access when necessary. Package feeds
and authorized Copilot service access still need advance confirmation.

Playwright owns a Vite server on **127.0.0.1:5174**, refuses unknown existing
servers, and stops its managed server afterward. The manual app remains on
**5173**. Each browser test gets a fresh context. Vitest excludes the E2E folder,
and build/typecheck includes browser-test/config types.

The supplied two browser cases establish existing valid save/reload/reset
behavior and an initial-page axe scan. Module 3 starts with a fresh behavior
contract and adds missing coverage, not another whitespace regression.
It works on the unfixed starter or an attendee's already-fixed app.
The accessibility command matches test paths containing `accessibility`; keep
new cases in `accessibility.spec.ts` or `*.accessibility.spec.ts`.

Reports are local ignored outputs. `test:e2e:report` starts a viewer; stop it with
Ctrl+C. Inspect axe JSON and retained failure traces rather than guessing causes.

## Agent picker preparation

1. In Chat's agent selector, if available, confirm **security-expert** and
   **Accessibility Expert** appear from this repository, not a same-named
   personal/organization agent. Neither pins a model or requires MCP.
2. Verify each agent's effective tools are read/search only. Tool aliases and
   enforcement vary by harness/version; inspect the live tool list before use.
   If broader tools appear or aliases fail, use ordinary investigation Chat,
   attach source, paste Module 4's complete prompt, and decline mutating tools.
3. Specialists return findings in Chat only, with location, evidence, severity,
   remediation, and suggested verification. They cannot run checks or apply
   corrections. Participants execute checks and authorize implementation
   separately. No automatic report/plan files, installations, or web requests.
4. Explain that accessibility results are checks, not a full conformance claim.

Model/picker/tool behavior requires live verification in the delivery environment.
Repository tests cannot validate those UI/account-dependent prerequisites.

## Facilitation by module

### Module 1 - Understand

Have learners verify a source reference rather than merely read a fluent answer.
Use a small existing-architecture diagram in chat. Do not turn this into document
generation or a backend redesign.

### Module 2 - Fix

Give everyone the same bug report. Check reproduction before discussing a fix.
Only the whitespace-only rejection remains for participants to implement.
Normalization, validation before storage, typed/associated field feedback,
failed-input retention, and retry are already supplied. The existing empty check
uses the raw name; participants make it check the trimmed name.

Pause after plan review and again after the expected regression failure.
An import/syntax failure is not proof of the bug. Autopilot implements only the
approved correction; inspect the diff and retry workflow afterward.
Keep unrelated full-field limits, unknown-key rejection, and load-state fixes out.

### Module 3 - Test

Use [Module 3](../labs/3-testing.md) independently of Modules 1-2 and 4.
Participants create `labs/03-test-plan.md` with a small contract and requirement
mapping, then add missing unit, integration, and browser coverage. Existing tests
already cover much of the behavior; do not reward duplicate tests or test counts.
Use literal expected score/action outputs and real form/service integration.
Keep the whitespace defect as a known gap if present; preserve earlier fixes.
Reuse the preconfigured browser runner for valid save/reload journeys and retain
reset coverage. Finish with a saved-state axe scan and short manual keyboard
check, not another specialist workflow. Report actual results and unverified gaps;
coverage percentages are unavailable unless separately configured.
On the restricted route, use the manual cases in Module 3 instead of generating
or claiming unrun automated browser checks. Both routes use the same test plan.

### Module 4 - Review

Review the actual change and necessary callers. Distinguish the dedicated local
review action from a chat review fallback. Use accept/modify/reject/investigate.
Do not require a fixed number of vulnerabilities or an extra unrelated repair.
No confirmed actionable finding is a valid result.

Review security in the browser-only context; ignored fields do not demonstrate
successful score override. Review accessibility across initial/error/corrected
states and separate automated evidence from manual evaluation.
GitHub PR review is not required and is not the same surface as custom agents.

### Module 5 - Reflect

Require actual evidence in the handoff. Keep three reusable prompts, three traps,
and one next-project application concrete. Do not generate imaginary successes.

## Recovery

Ask for **step, exact command, actual output**. Keep learner changes.
For a failing test, inspect the smallest relevant evidence, fix the root cause,
and rerun that check without weakening its assertion.
For port conflicts, identify ownership; never kill processes by name.
For unavailable Copilot features, use an explicitly labelled supported fallback.
If browser automation is blocked, record the missing core checkpoint and resolve
it when permitted, or use the labelled restricted route without claiming
automated coverage. For participants who need to rejoin, use the
[five instructor checkpoints](recovery/README.md); never overwrite their work.

## Reference material

The task rhythm was informed by the supplied
[modernization lab](https://github.com/aj-enns/copilot-modernize-review-test/blob/main/labs/01-modernize.md)
and [review lab](https://github.com/aj-enns/copilot-modernize-review-test/blob/main/labs/02-review.md).
The tracker instructions and prompts are original to this maintenance story.

- [Current Copilot planning workflow](https://code.visualstudio.com/docs/agents/run/planning)
- [Agent harness differences](https://code.visualstudio.com/docs/agents/run/agent-harnesses)
- [Custom-agent locations and compatibility](https://code.visualstudio.com/docs/agents/reference/custom-agent-file-reference)
- [WCAG versions and conformance](https://www.w3.org/WAI/standards-guidelines/wcag/)
