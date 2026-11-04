# Module 2 requirements - Fix the whitespace bug

## Scenario

A facility name containing only spaces can be saved, producing a finding without
a usable name. Fix this one bug. Use synthetic data; scoring is a training
example, not official CFIA policy.

## The one participant task

**BUG-01:** Reject a `facility_name` that is empty after trimming, including
whitespace-only direct service calls.

Add a service regression, demonstrate it failing, then correct the existing
facility validation. Reuse the supplied normalization and error feedback;
do not build a new validation or error-handling system.

Verify:

- With all other fields valid, `"   "` is rejected before storage is read or
  written. Existing serialized data stays unchanged; an absent app key stays absent.
- The form shows the existing facility-specific feedback, retains entered values,
  adds no finding, and does not report the rejected attempt as successful.
- Correcting the name to `"  Demo Facility  "` saves `"Demo Facility"`, clears
  the form, and returns **80 / Prioritize immediate review** for high severity.

## Already supplied - preserve, do not implement

The former BUG-02 through BUG-07 requirements are starter behavior, not six
additional lab tasks:

- Outer facility whitespace is trimmed; internal spaces and Unicode are preserved.
  Returned, persisted, and displayed names use the normalized value.
  The remaining bug is that the empty check runs on the untrimmed value.
- Facility validation runs before storage access. Empty-string direct calls
  already reject without initializing or changing storage.
- Failed saves retain inputs and data, clear any earlier success message, and
  allow correction/retry. Only successful saves clear the form.
- Typed facility errors are associated with the facility control and expose its
  invalid state. Editing clears the field error; storage errors remain separate.
- The form submits through the same service validation as direct calls.
- Scoring, other-field semantics, valid duplicates/order, seeds, persistence,
  refresh, confirmed reset/cancel, and visible storage failures already work.

### Fixed scoring oracle

| Exact severity | Score | Exact action |
| --- | --- | --- |
| `low` | 20 | `Routine follow-up` |
| `medium` | 50 | `Schedule follow-up inspection` |
| `high` | 80 | `Prioritize immediate review` |

Names and notes do not affect scoring. Do not import production scoring constants
as expected test outputs. Missing/non-string fields continue to reject; do not
coerce invalid values into strings.

## Boundaries

Change only the whitespace-only facility check and its regression tests.
Preserve the supplied normalization, feedback, and storage safeguards.
Do not add other-field trimming/limits, unknown-key rejection, new features,
unrelated load-state fixes, a backend, authentication, deployment, or CI.
Markup-like text renders literally through React; do not add an HTML blacklist.
Browser storage and client-side scores remain user-editable and untrusted.

The teaching target is scoped **WCAG 2.2 AA** evaluation of this workflow.
The preserved supplied agents/prompt target **WCAG 2.1 AA**; supplemental checks
do not establish full application conformance.

## Evidence

Complete from actual commands and observations. Module 4 expands testing;
Module 2 does not require implementing the supplied safeguards again.

| Check | Exact command/context | Observed result | Remaining gap |
| --- | --- | --- | --- |
| Whitespace regression fails before, passes after | | | |
| Direct rejection leaves existing/absent storage unchanged | | | |
| Form rejection -> correction -> normalized save | | | |
| Existing tests and build | | | |
| Module 4 browser/accessibility and manual checks | | | |

## Review decisions

| Finding and evidence | Category | Accept / modify / reject / investigate | Correction/check | Status |
| --- | --- | --- | --- | --- |
| | | | | |

## Definition of done

Show the whitespace regression failing before and passing after, demonstrate
rejection and correction in the form, and run relevant tests/build. Record actual
results and remaining manual/unverified gaps rather than claiming full conformance.
