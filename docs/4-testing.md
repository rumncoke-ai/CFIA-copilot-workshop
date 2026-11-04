# Module 4 - Testing and confidence checks

## 1. Objective

**Timebox: 20 minutes.** Extend the preconfigured frontend tests using reviewed
[criteria](../requirements.md) and Module 3 findings as independent oracles.
Add at least one new edge-case regression beyond Modules 2/3.

Use Vitest, jsdom, React Testing Library, and user-event, already installed by
`npm ci`. Do not introduce another runner or spend the module configuring one.

## 2. Why this matters

Copilot can reproduce the same mistake in both implementation and tests.
Expected values must come from the reviewed contract, not production constants.
Tests prove only their exercised cases; a green build is not UI verification.

## 3. Tasks

### A. Map criteria to evidence

Inspect the existing tests before requesting new ones:

| Criteria | Test file and expected evidence |
| --- | --- |
| F-03 / V-04 | [risk.test.ts](../client/src/risk.test.ts): explicit 20/50/80 score/action values. |
| F-01 / F-02 | [findings.test.ts](../client/src/findings.test.ts): full normalized result, creation order, duplicates, explicit empty list. |
| F-05 / V-01 through V-05 | Service tests: invalid runtime types/values identify fields and leave the full stored list unchanged. |
| Unknown-field rule | Preserve Module 3 regressions for score, action, and unrelated keys. |
| F-04 | [App.test.tsx](../client/src/App.test.tsx): real form/service save, exact confirmation, list entry, form reset, failed-write retention/retry. |
| F-06 / NF-03 | Seed initialization, persisted read-back, reset/cancel, malformed data, unavailable storage, and failed writes/reset. |
| New edge case | Notes at 1000/1001 Unicode code points, after trimming. |

Baseline tests do not establish the entire validation contract. Keep earlier
regressions; add missing cases rather than duplicating existing happy paths.

### B. Extend service tests

In [findings.test.ts](../client/src/findings.test.ts):

1. Preserve exact risk/action assertions; never read expected values from the
   production rule table.
2. Parameterize missing, `null`, numeric, empty, whitespace-only, invalid severity,
   and over-limit inputs. For truly dynamic values, design the validator to
   accept `unknown` and narrow it; do not add `as any` just to bypass typing.
3. Seed a valid finding, record the complete list and serialized storage,
   attempt invalid creation, and assert rejection plus unchanged state.
4. Also verify rejection does not initialize storage when the key is absent.
5. Test each exact maximum with all other fields valid. Compare normalized
   fields in the resolved object and stored list.
6. Preserve order, allowed duplicates, explicit `[]`, and error/reset coverage.

**Required new edge case:** notes consisting of `"\u{1F642}".repeat(1000)`,
wrapped in outer spaces, must be accepted after trimming. With 1001 copies they
must reject and preserve storage. The valid string has 1000 code points but
2000 UTF-16 code units, exposing `.length` mistakes.

Add a separate internal-newline/space preservation assertion if not already
covered. Do not change the contract to make a generated test pass.

```powershell
npm.cmd --prefix .\client test -- src\findings.test.ts src\risk.test.ts
```

### C. Extend the real UI flow

In [App.test.tsx](../client/src/App.test.tsx), keep the real App, form, local
service, scoring, and jsdom localStorage. There is no `fetch` to stub.
Use storage failure injection only for the failure cases.

Preserve the happy path:

- Load the seed record; fill controls by label using `userEvent`.
- Save one high-severity synthetic finding.
- Assert exactly **80** and **Prioritize immediate review** in the saved status.
- Assert the new list entry, cleared form, and persisted record.
- Refresh findings, then unmount/remount and verify the saved record remains.

Add one post-hardening case: submit whitespace-only facility text and assert
accessible field feedback, unchanged persisted data, and retained inputs.
Alternatively add the literal-markup regression if field coverage already exists.

Use `findByRole` or `waitFor`, not fixed sleeps. Scope duplicate text assertions
to the saved status or findings region. Restore spies and clean DOM/storage
between cases so order does not affect results. `localStorage.clear()` is safe
in isolated jsdom test setup, not in application reset code.

```powershell
npm.cmd --prefix .\client test
npm.cmd --prefix .\client run build
```

Or use [run-tests.ps1](../scripts/run-tests.ps1) for the same non-watch suite.
The exact test count grows with participant work; do not target the baseline
count or claim comprehensive coverage from it.

### D. Check the browser boundary

With the app running, verify save -> full browser reload -> same record;
cancel reset -> unchanged data; confirm reset -> only seed records.
Use the same origin/profile throughout.

jsdom tests validate component/service integration and storage interactions.
They do **not** prove browser quota behavior, real layout, cross-profile
persistence, accessibility with assistive technology, or trustworthy scores.
Record browser observations separately. There is no network/backend integration
to claim. Browser reload is stronger evidence than the App's Refresh button alone.

### E. Record confidence honestly

Update [requirements.md](../requirements.md) with:

`Criterion ID | Test/check | Exact command | Observed result | Remaining gap`

Run commands yourself. Distinguish pass, fail, and unverified. A failed
command remains failed even if some assertions passed.

## 4. VS Code + Copilot prompts

**Plan test coverage first:**

```text
Do not edit. Compare reviewed criteria against current risk, service, and App
tests. Return criterion ID, existing evidence, missing case, concrete input,
expected output, and test file. Do not infer expected values from production
constants or call jsdom an E2E browser test.
```

**Generate bounded regressions:**

```text
Add only the reviewed cases to [TEST_FILES]. Preserve earlier regressions.
Use explicit expected score/action values, isolated localStorage, and unchanged
full-state assertions on rejection. Include trimmed 1000/1001 emoji notes.
Keep real App/form/service behavior; do not mock away the feature under test.
Await interactions and restore spies. Run the focused suite and report results.
```

**Review confidence:**

```text
Using the actual test output and browser observations I supplied, map evidence
to criteria. Identify weak assertions, missing boundaries, and unverified risks.
Do not claim coverage percentages, browser E2E, or security guarantees without
the corresponding evidence.
```

## 5. Checkpoint and retrospective

- [ ] Exact scoring, service acceptance/rejection, and UI workflow tests pass.
- [ ] A new Unicode boundary or equivalent missing edge case is covered.
- [ ] Rejections assert unchanged storage, not merely an exception.
- [ ] Tests use independent expected values and isolated state.
- [ ] The build passes separately from tests.
- [ ] Actual browser reload/reset checks and remaining gaps are recorded.
- [ ] I can explain a case a green suite still does not prove.

**Common traps:** mocking the local service in the only integration test,
snapshot-only assertions, deriving expected values from production code,
ASCII-only boundaries, leaked spies/storage, and treating component tests as
real-browser evidence.

**Next: [Module 5](5-retrospective.md).**
