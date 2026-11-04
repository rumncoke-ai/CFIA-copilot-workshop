# Module 1 - Requirements and acceptance criteria

## 1. Objective

**Timebox: 15 minutes.** Convert the user story into a reviewable contract for
implementation, hardening, and testing:

> As an inspector lead, I can log findings and receive a risk score and follow-up
> recommendation so that I can prioritize follow-up consistently.

Your output is an updated [requirements.md](../requirements.md) at the repository
root, with functional and non-functional acceptance criteria, explicit
validation rules, edge cases, and a definition of done.

This is a requirements exercise, not a coding exercise. Keep the
[Module 0](0-prereqs.md) baseline intact. Later modules will implement and prove
this contract.

## 2. Why this matters in real SDLC

"Improve triage" does not tell a developer how to handle blank inspector IDs,
whether scores come from the client or server, or what happens after a failed
save. Different interpretations produce inconsistent results.

Explicit criteria let the inspection team review the same expected behavior
before code exists. They also give Copilot concrete constraints and give human
reviewers test oracles: known inputs with exact expected outputs.

Copilot-generated criteria are proposals, not policy. Use the training contract
below; do not let Copilot invent official CFIA scoring rules.

## 3. Tasks

### A. Separate observed behavior from desired behavior (3 minutes)

Open [requirements.md](../requirements.md), [models.py](../server/models.py),
[risk.py](../server/risk.py), and [app.py](../server/app.py). Recall the finding
you saved in Module 0. Run Prompt 1 below.

Identify what already works and what is still a gap:

- POST creates a finding; GET lists it.
- Severity drives a server-calculated score and recommendation.
- The starter does not trim or limit text and ignores unknown request fields.
- The existing tests do not establish comprehensive validation or security.

Do not describe missing protections as implemented.

### B. Define the training contract (5 minutes)

Use these fixed rules to keep the two-hour lab bounded. Run Prompts 2 and 3.
Record them in your artifact; do not spend this module designing a new scoring
algorithm.

**Functional criteria**

| ID | Acceptance criterion | Observable evidence |
| --- | --- | --- |
| F-01 | A valid `POST /findings` returns HTTP 201 and one object containing all five normalized input fields, `risk_score`, and `follow_up_action`. | Compare the complete response with an expected example; GET includes exactly one additional finding. |
| F-02 | `GET /findings` returns HTTP 200 and an array in creation order, or `[]` when empty. Identical valid submissions create separate entries. | Create two findings, including a repeated payload, and compare the resulting list. |
| F-03 | The server derives score and action only from validated severity using the exact table below. | Submit each severity and compare both outputs; no client-provided score/action is accepted. |
| F-04 | A successful UI save displays the score/action and adds the returned finding to the list; it clears the form. Failed saves retain entered values, display an error, and do not add a local list entry. | Exercise one successful save and one failed save in the browser. |
| F-05 | Invalid requests return HTTP 422 and do not change stored findings. | Compare GET before and after invalid submissions, including requests bypassing the UI. |

**Scoring and follow-up rules**

| Severity | Risk score | Exact follow-up action |
| --- | --- | --- |
| `low` | 20 | `Routine follow-up` |
| `medium` | 50 | `Schedule follow-up inspection` |
| `high` | 80 | `Prioritize immediate review` |

These are severity-only, synthetic training rules. Notes, facility name, and
inspection type do not change the score. Scores are deterministic, not an AI
prediction.

**Validation contract (V-01 through V-05)**

All five fields are required strings. Reject missing fields, `null`, and
non-string values; do not coerce numbers into strings.

| ID | Field | Explicit rule |
| --- | --- | --- |
| V-01 | `inspector_id` | Trim leading/trailing whitespace; require 1-40 characters after trimming. |
| V-02 | `facility_name` | Trim leading/trailing whitespace; require 1-120 characters after trimming. |
| V-03 | `inspection_type` | Trim leading/trailing whitespace; require 1-60 characters after trimming. It remains free text for this lab. |
| V-04 | `severity` | Accept only exact lowercase `low`, `medium`, or `high`; reject `High`, `critical`, and whitespace-padded values. Do not normalize severity. |
| V-05 | `notes` | Trim leading/trailing whitespace; require 1-1000 characters after trimming. Preserve internal whitespace and line breaks. |

Count text length as Unicode code points after trimming, not bytes. Accept
Unicode text within these limits; do not add an ASCII-only or HTML blacklist.
Whitespace-only text becomes empty and is rejected.

Reject all unknown request fields, including `risk_score` and
`follow_up_action`, with HTTP 422. The server is the enforcement boundary.
Frontend checks should provide matching feedback, but cannot replace API
validation.

**Non-functional criteria**

| ID | Acceptance criterion | Observable evidence |
| --- | --- | --- |
| NF-01 | Finding text renders as text, not executable markup. | Submit notes containing `<img src=x onerror=alert(1)>`; the UI displays the literal text without creating an image or executing the handler. |
| NF-02 | Expected failures are visible: validation identifies the offending field; a failed request leaves the save control usable again. UI errors do not display a server traceback. | Submit invalid data and simulate an unavailable backend; inspect feedback and retry behavior. |
| NF-03 | The app runs locally using documented commands, one backend worker, and synthetic data. Storage resets on backend restart; browser refresh retrieves current data. | Follow setup instructions, refresh the UI, then restart the backend and verify GET returns `[]`. |
| NF-04 | Local quality gates pass: backend tests cover scoring and API acceptance/rejection; frontend TypeScript/build checks pass and an automated test covers one UI create/list flow. | Record the actual test/check commands and passing results in Module 4. Never claim coverage from a green build alone. |

Out of scope: authentication, production deployment, durable storage, file
uploads, finding editing/deletion, dashboards, and official inspection policy.
The optional pipeline does not belong to the core definition of done.

### C. Make edge cases executable (4 minutes)

Run Prompt 4. Include a valid payload and its exact expected response:

```json
{
  "inspector_id": "INS-001",
  "facility_name": "Demo Facility",
  "inspection_type": "Routine",
  "severity": "high",
  "notes": "Synthetic finding: damaged storage seal."
}
```

Expected POST status: **201**. Expected response:

```json
{
  "inspector_id": "INS-001",
  "facility_name": "Demo Facility",
  "inspection_type": "Routine",
  "severity": "high",
  "notes": "Synthetic finding: damaged storage seal.",
  "risk_score": 80,
  "follow_up_action": "Prioritize immediate review"
}
```

Build your edge-case matrix by modifying this valid payload, one rule at a time:

| Case | Expected outcome |
| --- | --- |
| Each of `low`, `medium`, `high` | HTTP 201 with the exact score/action pair above. |
| `facility_name` is `"  Demo Facility  "` | HTTP 201; stored and returned name is `"Demo Facility"`. |
| Any text field is empty or whitespace-only | HTTP 422; list unchanged. |
| Any required field is omitted, `null`, or numeric | HTTP 422; list unchanged. |
| Each text field has exactly its maximum code-point length | HTTP 201, with all other fields valid. |
| Each text field is one code point over its maximum | HTTP 422; list unchanged. |
| Severity is `High`, `critical`, or `" high "` | HTTP 422; list unchanged. |
| Extra `risk_score: 1`, `follow_up_action`, or another unknown field | HTTP 422; no trusted-output override and list unchanged. |
| Notes contain Unicode, internal line breaks, or the markup example | HTTP 201 within length limits; internal text preserved and rendered literally. |
| Same valid payload submitted twice | Two HTTP 201 responses; two list entries. |
| Backend unavailable during save | Visible UI error, preserved input, no new local entry, save control re-enabled. |

Expand "any" and "each" into individual parameterized cases when writing tests
in Module 4. Do not run hardening tests now or change code to make them pass.

### D. Save and review the artifact (3 minutes)

Use Prompt 5 to update only [requirements.md](../requirements.md).
Preserve its scenario and workshop constraints. Add these headings:

- User story
- Functional acceptance criteria
- Validation rules
- Scoring and follow-up rules
- Non-functional acceptance criteria
- Examples and edge-case matrix
- Out of scope
- Definition of done

Each criterion needs an ID and a verification method. Keep a baseline status
column such as **Observed in Module 0**, **Not yet implemented**, or
**Not yet verified**. Observing one happy path does not prove all cases.

Your **definition of done** must say that all in-scope criteria are satisfied,
review findings are resolved or explicitly documented as accepted local-lab
limitations, and the required tests/checks pass with evidence.
The requirements document being complete is this module's checkpoint; it does
not mean the feature is done. Resolve contradictory rules with the facilitator
before moving to [Module 2](2-implementation.md).

## 4. VS Code + GHCP prompts to run

Use question-only Chat for Prompts 1-4. Attach the named files using the VS Code
context picker. For Prompt 5, allow document editing only and inspect the diff
before accepting it.

### Prompt 1 - Extract the current contract

Attach [models.py](../server/models.py), [risk.py](../server/risk.py),
[app.py](../server/app.py), and [test_app.py](../server/test_app.py).

```text
Do not edit files. Based only on the attached starter, separate observed
behavior from missing requirements for create/list findings. Identify input
fields, HTTP statuses, scoring rules, storage behavior, and test limitations.
Do not assume a validation rule exists because it would be desirable.
```

**Expected response shape:** a table with `Behavior | Source file/function |
Existing evidence | Gap or uncertainty`. It must distinguish source inspection
from executed test evidence.

### Prompt 2 - Write functional acceptance criteria

Attach this module page and [requirements.md](../requirements.md).

```text
Do not edit files. Turn the inspector-lead story and Module 1 training contract
into F-01 through F-05 acceptance criteria. Preserve exact severity scores,
actions, HTTP statuses, duplicate behavior, and out-of-scope boundaries.
Do not introduce authentication, persistence, or a new scoring algorithm.
```

**Expected response shape:** five rows with `ID | Given | When | Then |
Verification method`. Each Then must name observable outputs, not "works well."

### Prompt 3 - Specify validation and non-functional criteria

Attach this module page and [models.py](../server/models.py).

```text
Do not edit files. Restate V-01 through V-05 and NF-01 through NF-04 from the
training contract. Include type/missing/null checks, trimming, code-point
length limits, strict severity, rejection of unknown fields, safe text
rendering, failure feedback, local storage limits, and quality gates.
Identify which checks must be enforced server-side. Do not call desired
protections implemented.
```

**Expected response shape:** a field-validation table plus a non-functional
criteria table, each with rule IDs and verification methods; a short list of
baseline gaps. No vague "secure" or "fast" criteria without evidence.

### Prompt 4 - Generate test oracles and edge cases

Attach this module page and [risk.py](../server/risk.py).

```text
Do not edit files or write tests yet. Use the Module 1 valid payload as a base
and produce an edge-case matrix covering every field, severity rule, length
boundary, extra field, duplicate submission, literal markup, and failed save.
For API cases specify status, response expectations, and stored-list change.
For UI cases specify visible behavior. Use exact expected score/action pairs.
```

**Expected response shape:** `Case ID | Criterion IDs | Input/change |
Expected status or UI result | Expected response | Storage/list effect`.
Boundary examples must say how many code points they contain.

### Prompt 5 - Produce the requirements artifact

Attach this module page, [requirements.md](../requirements.md), and the reviewed
outputs of Prompts 1-4.

```text
Update only the root requirements.md using our reviewed criteria and the
Module 1 training contract. Preserve existing scenario and workshop constraints.
Add the requested headings, stable criterion IDs, exact scoring and validation
rules, a valid request/response example, edge-case matrix, and definition of
done. Record baseline statuses honestly: observed, not implemented, or not
verified. Do not edit application code or claim that tests have been run.
Summarize unresolved contradictions instead of silently choosing new rules.
```

**Expected response shape:** a diff affecting only the root requirements
document, followed by a short summary of sections added and unresolved issues.
Review it in VS Code; remove unsupported claims before saving.

## 5. Checkpoint

Show your partner or facilitator the saved [requirements.md](../requirements.md).
It must contain:

- The single inspector-lead story and bounded scope.
- Functional F-01 through F-05 and non-functional NF-01 through NF-04, with
  observable verification methods.
- Validation V-01 through V-05, explicit unknown-field rejection, and the three
  exact score/action pairs.
- A valid request/response example and the edge-case matrix.
- Baseline gaps clearly distinguished from future requirements.
- A definition of done that includes implementation, review, and test evidence.

No application code should change in this module. The API still has intentional
gaps; that is expected. Your artifact is the shared contract for the next three
modules.

## 6. Retrospective checklist

- [ ] I can distinguish a user story from a testable acceptance criterion.
- [ ] I can explain one functional and one non-functional criterion using
      concrete inputs and observable outcomes.
- [ ] I can explain the difference between this module's document checkpoint
      and the feature's definition of done.
- [ ] I can state what evidence is needed before declaring the feature done:
      implemented criteria, reviewed changes, and passing checks/tests.
- [ ] I can show a rejection case and explain why it must not change storage.
- [ ] I can explain why server-side validation is required even with a form.
- [ ] I checked Copilot's proposed rules against the training contract, not
      its confidence or fluent wording.
- [ ] I discussed at least one trap and resolved any contradictory requirements.

## 7. Common traps

| Trap | Concrete guardrail |
| --- | --- |
| "The app is secure and reliable" used as a criterion | Replace it with identified inputs, expected behavior, and a verification method. |
| Copilot invents official CFIA risk thresholds | Preserve the synthetic 20/50/80 table and exact action strings; label them training rules. |
| Describing desired validation as current behavior | Record baseline gaps and use "not yet implemented" where appropriate. |
| Omitting whitespace, type, or length-boundary cases | Check each field at empty, maximum, and maximum-plus-one lengths after trimming; include missing/null/non-string values. |
| Letting the frontend supply trusted risk outputs | Reject score/action request fields; compute outputs on the server. |
| Rejecting markup instead of rendering it safely | Treat notes as text; verify literal rendering rather than claiming an HTML blacklist prevents injection. |
| Turning the lab into a production platform | Keep authentication, durable storage, and deployment outside the core scope. |
| Calling the feature done because the document or build is finished | Require criterion coverage, human review, and passing behavioral tests; record real evidence in later modules. |
