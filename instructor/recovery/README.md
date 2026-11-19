# Instructor-only recovery checkpoints

These are rescue materials, not participant exercises. The two patches contain
the regression and solution. Do not open or distribute them during the normal
learner workflow. Repository files are not access-controlled instructor secrets:
participants can discover them, but no participant instructions link here.
Nothing applies them automatically; the original starter keeps its bug.

## Prepare once before delivery

Rehearse from the committed workshop revision you will distribute, using Git,
the approved Node/npm setup, and an approved package cache/feed. The commands
below use `HEAD` of that revision, not a participant's partly fixed commit.
Record that revision for the class:

```powershell
git rev-parse HEAD
```

Keep a clean instructor checkout of that revision. Run recovery there, or replace
`HEAD` below with the recorded revision if using a participant checkout. Patches
are intentionally small and may need instructor maintenance if source changes.
Do not force a patch that fails its check.

## Shared restore procedure (all five checkpoints)

**Warn the participant first:** recovery starts a new working copy; it does not
merge their work or recover Chat history. Keep their original folder, open
editors, unsaved buffers, and Chat/plan evidence. Do not reset, clean, switch their
branch, or overwrite their files. Stop their app with Ctrl+C before starting the
recovery app so port 5173 is free.

From the instructor checkout's repository root, create a **new sibling
worktree**. The chosen destination must not exist; choose a different name for
another participant/attempt. Do not delete an existing folder to make this work.

```powershell
$workshopRoot = (Get-Location).Path
$recovery = Join-Path (Split-Path -Parent $workshopRoot) "cfia-recovery"
git worktree add --detach "$recovery" HEAD
```

Check that Git succeeded before continuing. Open the new folder in VS Code
using **File > Open Folder**. In the original terminal, apply only the patches
listed for the selected checkpoint below, checking each exit/result before the
next command. A nonzero exit means stop and investigate, not continue.

Then, still in that terminal:

```powershell
npm.cmd --prefix "$recovery\client" ci
npm.cmd --prefix "$recovery\client" test
npm.cmd --prefix "$recovery\client" run build
```

Check each result separately. Checkpoint 3 deliberately has two failing
regressions; build should still pass. All other checkpoints require green
existing tests/build. No browser download is needed for recovery.

Target **under five minutes**: create worktree, apply zero to two patches, run
cached dependency install/checks, and hand off. Pre-rehearse npm access and timing.
An uncached/blocked install, unavailable Git, or slow machine cannot be guaranteed
under five minutes; prepare checkpoint worktrees on an approved workstation
before class rather than improvising a policy bypass.

## 1. Application understood and ready for planning

- **Use when:** Module 1 investigation drifted or app files were changed early.
- **State:** original app/tests, intentional whitespace bug present, source
  explanation and data-flow understanding checked with the facilitator.
- **Restore:** shared procedure only; apply no patches.
- **Verify:** tests/build pass. In the app, save a synthetic high finding and
  reload: expect **80 / Prioritize immediate review** and persistence. Facilitator
  checks the learner can trace form -> App -> service -> scoring/storage -> list.
- **Resume:** Module 2 task A (reproduce), then task B (plan).
- **Human-only:** understanding/diagram cannot be generated or validated by Git.
  Briefly reconstruct them in Chat from source; do not claim earlier work ran.

## 2. Maintenance plan approved

- **Use when:** Module 2 task B is off-scope or a plan has been lost.
- **State:** same unfixed app as checkpoint 1; reviewed bounded plan below.
- **Restore:** shared procedure only; apply no patches. Supply this instructor
  plan in Chat and obtain explicit participant/facilitator approval:
  1. Add a service regression for three spaces with other fields valid. Prove
     facility rejection before storage reads/writes, for initialized and absent
     storage, and unchanged serialized storage.
  2. Run the focused service suite and inspect acceptance-versus-rejection
     failure, not a tooling error.
  3. Change only the facility empty check to inspect the trimmed name. Reuse
     existing normalization, typed error, feedback, and retained-input retry.
  4. Run focused/full tests and build. Manually check rejection, valid padded
     names, retry, persistence, and unchanged scoring/reset behavior.
- **Verify:** tests/build still pass before the regression; participant can name
  affected files and exclusions. No new dependencies, backend, or UI redesign.
- **Resume:** Module 2 task C (write the regression, not the fix).
- **Human-only:** plan approval is a decision, not an automatically restored fact.

## 3. Regression written and failing as expected

- **Use when:** Module 2 task C cannot produce a meaningful red test.
- **State:** original buggy service plus two regression cases (storage absent/
  initialized); no fix.
- **Restore:** before shared installation/checks, apply the test patch only:

```powershell
git -C "$recovery" apply --check "$workshopRoot\instructor\recovery\regression.patch"
git -C "$recovery" apply "$workshopRoot\instructor\recovery\regression.patch"
```

- **Verify:** shared full test run fails only the two `rejects whitespace-only
  facility before storage access` cases because the promise resolves instead of
  rejecting. Build passes. A missing package/import/syntax error is not this
  checkpoint. Inspect the failure together; do not weaken the assertion.
- **Resume:** Module 2 task D (approved correction).

## 4. Bug fixed and regression passing

- **Use when:** Module 2 task D implementation expanded or cannot go green.
- **State:** checkpoint 3 regression plus the one-line trimmed-name check.
- **Restore:** apply the checkpoint 3 commands, then:

```powershell
git -C "$recovery" apply --check "$workshopRoot\instructor\recovery\fix.patch"
git -C "$recovery" apply "$workshopRoot\instructor\recovery\fix.patch"
```

- **Verify:** shared full tests/build pass. Inspect the two-file diff:

```powershell
git -C "$recovery" --no-pager diff --stat
git -C "$recovery" --no-pager diff -- client\src\findings.ts client\src\findings.test.ts
```

- **Resume:** Module 2 task E (inspect and demonstrate in the browser).

## 5. Application ready for code, security, and accessibility review

- **Use when:** the participant needs to enter Module 3 with a bounded review diff.
- **State:** same app/test patch set as checkpoint 4, with task E verified, not
  already reviewed or certified. Preserve the uncommitted diff for local review.
- **Restore:** same commands as checkpoint 4 and shared tests/build. Start the
  manual app after confirming port ownership:

```powershell
npm.cmd --prefix "$recovery\client" run dev
```

- **Verify:** at http://127.0.0.1:5173, three-space facility is rejected with
  associated field feedback, other inputs retained, and no false success/list
  entry. Correct to `  Demo Facility  ` and save: expect normalized name,
  **80 / Prioritize immediate review**, cleared form, and persistence on reload.
  Use keyboard navigation to observe feedback/focus. Stop with Ctrl+C when done.
- **Resume:** Module 3 task A, then the read-only specialist or chat reviews.
- **Human-only:** task E's visual/keyboard observations and actual readiness need
  live verification. Git/tests do not restore browser localStorage or UI evidence.
  Module 4 still follows, on the full or restricted path.

## Handoff

Tell the learner which checkpoint was restored, what was actually run, and which
manual checks remain. Reattach relevant files and the approved plan in a fresh
Chat if needed. Keep original work for later comparison; do not commit/merge the
recovery into their branch automatically. Any review-discovered corrections,
Module 4 additions, browser state, and Chat history are not checkpoint contents.
