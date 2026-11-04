# Facilitator guide - One maintenance story

## Session contract

Participants inherit the React tracker, investigate whitespace-only facility
names, implement one bounded fix, review it, and establish test evidence.
Use synthetic data; scoring is not official CFIA policy.

**Copilot proposes; humans approve; checks provide evidence.**

| Module | Suggested duration | Transition/checkpoint |
| --- | --- | --- |
| 0 | 15 min, separate | Existing prerequisites; do not rewrite this guide. |
| 1 | 15 min | Interactive explanation verified against source. |
| 2 | 35 min | Interactive -> Plan -> regression failure -> bounded Autopilot fix -> human verification. |
| 3 | 25 min | Dedicated code review plus specialist security/accessibility review decisions. |
| 4 | 35 min | Unit/service, integration, browser E2E, scoped accessibility evidence. |
| 5 | 10 min | Handoff and reusable prompting/verification habits. |

Modules 1-5 total **120 minutes**. Including the separate 15-minute prerequisite
module gives **135 minutes**. Durations are suggested, not execution guarantees.
Protect checkpoints rather than rushing through unverified output.

## Prepare before participants arrive

- Verify quick setup, Copilot access, Node.js, npm feeds, and the classroom network.
- Use the **Copilot** harness/session target and verify its Agent mode picker
  has **Interactive, Plan, and Autopilot**. Rehearse exact UI labels.
  Module 0 intentionally retains older wording; point to Module 1 for current
  controls rather than editing prerequisites.
- Explain separately selected permissions. Never require unrestricted access.
- Confirm the intentionally unfixed starter accepts whitespace-only facility names.
- Run existing tests and build. Verify assertions, not a target test count.
- Rehearse Modules 1-4 in a separate working copy. Do not solve the distributed
  starter. Prepare reviewed recovery notes/checkpoints yourself; no reference
  application solution or automated rescue patch is supplied.
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
Do not weaken security policy or let participants install tooling during the
testing module. If Chromium cannot be provisioned, resolve before delivery;
a manual browser check is not equivalent to the core automated E2E checkpoint.

Playwright owns a Vite server on **127.0.0.1:5174**, refuses unknown existing
servers, and stops its managed server afterward. The manual app remains on
**5173**. Each browser test gets a fresh context. Vitest excludes the E2E folder,
and build/typecheck includes browser-test/config types.

The supplied two browser cases establish existing valid save/reload/reset
behavior and an initial-page axe scan. Bug-specific tests are participant work,
not failing tests shipped in the starter. Module 4 adds invalid/corrected states.
The accessibility command matches test paths containing `accessibility`; keep
new cases in `accessibility.spec.ts` or `*.accessibility.spec.ts`.

Reports are local ignored outputs. `test:e2e:report` starts a viewer; stop it with
Ctrl+C. Inspect axe JSON and retained failure traces rather than guessing causes.

## Customization preparation

Read [agents and prompts](../.github/workshop-customizations.md).

1. Verify the supplied files remain unchanged from the approved originals.
2. Verify workspace discovery in the actual agent/prompt pickers. Both `.md`
   agent definitions are supported by the current reference; do not assume that
   valid filenames guarantee model/tool compatibility.
3. Check **Claude Sonnet 4** availability and supported tool identifiers. Rehearse
   the real invocation, not only file inspection.
4. Preview mandatory report/plan writes. The supplied accessibility agent is
   not read-only; it names more than one plan/output location.
5. Explain the standard-agent fallback when a model/tool is unavailable. Label
   the fallback honestly; do not claim a specialist ran.
6. Preserve the WCAG 2.1 baseline labels on the originals. The workshop companion
   targets scoped WCAG 2.2 AA checks, including applicable additions.
7. Discuss the supplied prompt's incorrect blanket empty-alt assertion and its
   Perceivable-only final execution. Do not run that recipe verbatim as the core.

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

### Module 3 - Review

Review the actual change and necessary callers. Distinguish the dedicated local
review action from a chat review fallback. Use accept/modify/reject/investigate.
Do not require a fixed number of vulnerabilities or an extra unrelated repair.
No confirmed actionable finding is a valid result.

Review security in the browser-only context; ignored fields do not demonstrate
successful score override. Review accessibility across initial/error/corrected
states and separate automated evidence from manual evaluation.
GitHub PR review is not required and is not the same surface as custom agents.

### Module 4 - Test

Expand missing evidence rather than duplicate Module 2 regressions. Use literal
expected score/action outputs and complete storage comparisons.
Run real-browser invalid -> correction -> save -> reload and reset preservation.
No fixed sleeps or network mocks are needed. Reuse the preconfigured browser runner.
Use axe/DOM assertions plus manual keyboard checks, and state what remains unverified.

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
the prerequisite rather than claiming completion.

## Reference material

The task rhythm was informed by the supplied
[modernization lab](https://github.com/aj-enns/copilot-modernize-review-test/blob/main/labs/01-modernize.md)
and [review lab](https://github.com/aj-enns/copilot-modernize-review-test/blob/main/labs/02-review.md).
The tracker instructions and prompts are original to this maintenance story.

- [Current Copilot planning workflow](https://code.visualstudio.com/docs/agents/run/planning)
- [Agent harness differences](https://code.visualstudio.com/docs/agents/run/agent-harnesses)
- [Custom-agent locations and compatibility](https://code.visualstudio.com/docs/agents/reference/custom-agent-file-reference)
- [WCAG versions and conformance](https://www.w3.org/WAI/standards-guidelines/wcag/)
