# Prompt playbook

Use these templates in VS Code Copilot Chat. Replace every `[PLACEHOLDER]` and
attach the named files using Chat's context picker. Keep real inspection records,
secrets, and confidential project data out of prompts.

**Copilot outputs are probabilistic.** Good output is a reviewable proposal,
not proof. Approve edits explicitly and verify the result yourself.

## 1. Requirements decomposition

**When to use it:** before coding an ambiguous story, or when different layers
interpret the same input differently. In [Module 1](../docs/1-requirements.md),
use the inspector-lead story and the synthetic training rules.

**Exact prompt**

```text
Do not edit files or implement code.

User story: [USER_STORY]
In scope: [IN_SCOPE]
Out of scope: [OUT_OF_SCOPE]
Reviewed rules: [FIELD_TYPES_VALIDATION_SCORING_AND_ERROR_RULES]
Attached context: [CURRENT_REQUIREMENTS_AND_RELEVANT_FILES]

Decompose this into functional and non-functional acceptance criteria.
For each criterion return:
ID | Given | When | Then | Verification method.

Specify required fields, missing/null/type handling, normalization order,
length units and boundaries, allowed values, exact outputs, and failure effects
on stored state. Include a valid request/response example and an edge-case
matrix mapped to criterion IDs.

Separate current behavior from desired behavior. List unresolved assumptions
and contradictory rules; do not silently invent policy or expand scope.
Finish with a definition of done requiring implemented criteria, reviewed
changes, and actual passing verification evidence.
```

**What good output looks like**

- Stable criterion IDs with measurable outputs, not "secure" or "user-friendly."
- A case such as whitespace-only facility name -> HTTP 422 -> unchanged list.
- Exact reviewed score/action pairs and explicit local-storage limitations.
- Open questions identified before implementation; proposed rules not falsely
  described as current protections.

**Red flags**

- Invented official CFIA thresholds, authentication, or persistence.
- No type/whitespace/maximum-plus-one cases.
- Criteria derived only from what the starter happens to do.
- "Done" defined as compilation or documentation completion.

## 2. Implementation in incremental steps

**When to use it:** implementing a reviewed criterion or a reproduced bug with
a bounded file scope. In [Module 2](../docs/2-implementation.md), iterate backend
normalization and frontend feedback separately.

**Exact prompt - explain first**

```text
Do not edit yet.

Criterion or confirmed defect: [CRITERION_ID_AND_EXPECTED_BEHAVIOR]
Observed current behavior: [OBSERVATION_OR_REPRODUCTION]
Allowed files: [EXACT_FILE_LIST]
Behavior to preserve: [ROUTES_TYPES_SCORING_UI_AND_ERROR_CONTRACTS]
Verification: [FOCUSED_COMMAND_AND_MANUAL_CHECK]

Inspect the attached code and propose the smallest complete change.
Return:
File/function | Proposed change | Reason | Verification.

Reuse existing models, helpers, and patterns. Identify producer/consumer
changes required for consistency. Explain risks such as validator ordering,
type coercion, state cleanup, or text-length mismatches.
Do not add dependencies, broaden scope, or edit outside the allowed files.
If another file is required, explain why and wait for approval.
```

**Exact prompt - apply after human review**

```text
Apply only this reviewed plan: [APPROVED_PLAN].
Allowed files: [APPROVED_FILE_LIST].

Preserve [UNCHANGED_BEHAVIOR]. Add or update [FOCUSED_REGRESSION_TEST].
Keep proper types and explicit failure handling. Do not truncate data,
duplicate trusted logic, suppress errors, or weaken assertions.
Summarize the actual diff and verification results. If you cannot run
[VERIFICATION_COMMAND], state that it remains unverified.
Stop after this step; do not start the next feature or hardening task.
```

**What good output looks like**

- A small, coherent diff that wires every necessary surface within approved scope.
- Backend scoring remains authoritative; React displays returned values.
- A test or manual check proves the exact changed behavior and preserves the baseline.
- Dependencies and unrelated participant edits stay untouched.

**Red flags**

- Whole-app replacement, new frameworks, or unrelated cleanup.
- Editing before explanation/approval or quietly expanding file scope.
- `any` casts, score calculation copied into the form, or fake successful results.
- Claims that tests passed without actual execution evidence.

## 3. Security-focused review

**When to use it:** after generated changes or before accepting an input-handling
feature. In [Module 3](../docs/3-security-review.md), review changed files and
necessary adjacent code, then reproduce findings before remediation.

**Exact prompt**

```text
Do not edit files.

Changed files/diff: [CHANGED_FILES_OR_DIFF]
Necessary adjacent context: [MODELS_API_RENDERING_AND_TEST_FILES]
Expected contract: [CRITERIA_AND_TRUST_BOUNDARIES]
Threat model: [UNTRUSTED_CALLERS_INPUTS_AND_ASSETS]
Deployment limits: [LOCAL_ONLY_OR_OTHER_REVIEWED_ASSUMPTIONS]

Review input validation, error handling, data assumptions, and maintainability.
Treat the UI as bypassable. Check validation before storage, unknown fields,
trusted server outputs, safe text rendering, error/data exposure, state cleanup,
and unchecked response parsing.

Return:
Finding ID | Category | File/function | Input or failure | Observed behavior |
Impact | Confidence and basis | Reproduction | Small remediation | Verification.

Separate confirmed issues, hypotheses, and accepted deployment limitations.
Do not call ignored client fields a trusted-output exploit unless code or
runtime evidence demonstrates that impact. Identify a distinct code-quality
issue as well as a security-related issue; do not label one patch twice.
Wait for approval before implementing any remediation.
```

**What good output looks like**

- Findings cite actual code and a concrete direct-API or rendering reproduction.
- Unknown-field acceptance is distinguished from successful score manipulation.
- Each suggested fix has a measurable before/after result, such as 422 and
  unchanged storage.
- Error feedback identifies fields without echoing raw submitted data or traceback.

**Red flags**

- Generic OWASP checklist, blanket "secure" assurance, or invented vulnerabilities.
- Review considers only form controls, not direct requests.
- HTML blacklists offered instead of preserving safe text rendering.
- Broad catches, raw error-object logging, or production rewrites presented as fixes.

## 4. Test generation from criteria

**When to use it:** once rules are reviewed, and when adding regression coverage
for a confirmed review finding. In [Module 4](../docs/4-testing.md), attach the
requirements before implementation and reuse existing test infrastructure.

**Exact prompt**

```text
Reviewed acceptance criteria: [CRITERIA_WITH_IDS_AND_EXPLICIT_ORACLES]
Confirmed review findings: [FINDINGS_AND_REPRODUCTIONS]
Existing tests/runner: [TEST_FILES_AND_CONFIGURATION]
Implementation context: [RELEVANT_FILES]
Allowed edits: [TEST_FILES_AND_APPROVED_RUNNER_CONFIGURATION]
Required new edge case: [INPUT_AND_EXPECTED_ACCEPTANCE_OR_REJECTION]

Generate tests from the reviewed criteria, not implementation behavior alone.
Cover exact risk outputs, API success/rejection and unchanged storage, and one
UI create/list flow. Write expected values explicitly; do not import production
constants as the oracle. Parameterize relevant type, whitespace, enum, and
length boundaries.

Use existing fixtures and isolate state. Await UI interactions; mock only
[APPROVED_NETWORK_BOUNDARY], keeping actual components and API utility.
Do not rely on snapshots, arbitrary sleeps, or status-only assertions.

Return a bounded test diff and:
Criterion IDs | Test/case | Oracle | Boundary exercised | Remaining gap.

Run [FOCUSED_COMMANDS] if available and report actual results. If a test fails,
explain the evidence before editing production code. Do not skip it, weaken
the oracle, or call a mocked UI flow live end-to-end coverage.
```

**What good output looks like**

- Risk expectations are literal 20/50/80 tuples with exact action strings.
- Invalid POST asserts status, offending field, and the complete unchanged list.
- Unicode code-point maximum/maximum-plus-one checks catch real boundary errors.
- UI assertions inspect POST payload, displayed outputs, reset, and list behavior.
- In-process API tests, mocked UI tests, and live smoke evidence are clearly separated.

**Red flags**

- Expected values read from `RISK_RULES` or calculated with the same production helper.
- Hundreds of cases with weak assertions or state leakage.
- Tests removed or skipped to obtain a green run.
- A passing build or jsdom test presented as comprehensive confidence.

## 5. Retrospective self-review

**When to use it:** after a verified slice or at the end of the workshop.
In [Module 5](../docs/5-retrospective.md), turn recorded prompts and evidence into
three reusable habits rather than generic success claims.

**Exact prompt**

```text
Do not edit application code.

Goal and reviewed criteria: [GOAL_AND_CRITERIA]
Prompts actually used: [PROMPTS]
Changes accepted/rejected: [REVIEWED_DIFF_SUMMARY]
Observed checks/results: [ACTUAL_TEST_BUILD_AND_BROWSER_EVIDENCE]
Known gaps: [UNVERIFIED_CRITERIA_AND_LIMITATIONS]
Next-project task, without confidential details: [CONCRETE_TASK]

Produce:
1. Three reusable prompt patterns with exact adaptable wording, a tracker
   example, and the evidence that made the result trustworthy.
2. Three traps with mitigation actions; label each observed or anticipated.
3. One day-to-day application per pattern naming context to supply, bounded
   output to request, and a specific verification check.
4. A brief assessment of definition-of-done evidence and remaining work.

Explain what changed and why it reduced risk. Distinguish passing tests from
sufficient confidence. Do not invent experiences, successful commands, or
completed criteria. Finish with one concrete habit to try on the next change.
```

**What good output looks like**

- Three patterns and three traps grounded in actual workshop work.
- A concrete transfer such as: "For my next form fix, attach field rules,
  request one component-sized diff, and verify failed-save input retention."
- Honest distinction between observed success, paired/demo evidence, and pending work.
- A next action small enough to use on a real engineering task.

**Red flags**

- "Use Copilot more" without task, context, and verification.
- Fabricated successful tests or claims that all security issues are resolved.
- Treating one green run as proof of the full definition of done.
- Recommendations that require sharing sensitive project context.

## Participant notes

During Module 5, append your own entries here. Do not replace actual evidence
with the examples above.

### Three patterns and next-project applications

| Pattern | Exact prompt used | Tracker example | Actual verification | Next-project use |
| --- | --- | --- | --- | --- |
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |

### Three traps and mitigations

| Trap | Observed or anticipated | Tracker example | Mitigation action |
| --- | --- | --- | --- |
| 1 | | | |
| 2 | | | |
| 3 | | | |

### Next action and remaining evidence

- Next-project task and habit: complete during the retrospective.
- Remaining criterion/check and why it matters: complete from your evidence map.
