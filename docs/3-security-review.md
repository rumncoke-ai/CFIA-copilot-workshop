# Module 3 - Code, security, and accessibility review

## 1. Objective

**Suggested duration: 25 minutes.**

Review the Module 2 change from three perspectives. Finish with evidence-backed
decisions, not a quota of findings or an automatic rewrite.

## 2. Why it matters

Code review, security analysis, and accessibility evaluation ask different
questions. Custom agents provide reusable roles; prompts provide reusable tasks.
Neither replaces human judgment or proves production readiness.

## 3. Tasks

### A. Prepare the review

1. Keep your Module 2 changes available in Source Control.
2. Confirm the expected behavior: reject whitespace-only facility names before
   storage access, show the existing field feedback, retain inputs, and allow a
   corrected name to save normally. Read the [security boundaries](../SECURITY.md).
3. Open the [customization guide](../.github/workshop-customizations.md). Inspect
   both supplied agent definitions before invoking them. They are preserved
   unchanged, pin a model, list version-dependent tools, and can write reports.
4. Confirm the specialist appears in your Copilot harness agent picker and that
   its model/tools are available. If not, use the labelled fallback below.

### B. Review correctness with the dedicated local review feature

1. Open **Source Control** and use the Copilot review action above **Changes**
   for uncommitted changes, if available.
2. Alternatively select relevant changed code and use **Chat: Review** from the
   Command Palette when available. Selection review and diff review have
   different scopes; check what was actually reviewed.
3. Read each suggestion before applying it. If the dedicated UI is unavailable,
   select **Interactive**, attach the diff, adjacent callers, and tests, then paste:

```text
Review my whitespace-only facility fix. Blank names must be rejected before
storage access, with field feedback, retained inputs, and no success message.
Correction and retry must work. Preserve existing normalization, scoring,
persistence, duplicates, seed data, and confirmed reset.
Do not edit or generate reports. Focus on correctness, inconsistent form/service
rules, error handling, preserved behavior, and unrelated changes.
For each actionable finding give file/function, failing input, expected versus
actual behavior, impact, and focused verification. Say when evidence is missing.
No findings is valid. Do not treat stylistic preferences as confirmed defects.
```

4. Label this fallback **chat-based review**, not dedicated Copilot code review.
   This exercise does not require a GitHub PR, commit, push, or remote reviewer.

### C. Review security with the supplied custom agent

1. Select **security-expert** (the supplied file's default name), or the
   corresponding displayed agent name.
2. Attach the actual diff, service, rendering code, and security boundaries.
3. Read the [security review prompt](../.github/prompts/workshop-security-review.prompt.md).
   Invoke `/workshop-security-review` without switching away from the selected
   specialist, or paste its body if prompt invocation changes roles in your UI.
4. Expect evidence-led review of runtime values, literal rendering, and browser
   storage assumptions. The supplied agent may write a report under
   `security-reports`; preview any proposed write.
5. Do not describe ignored extra fields as successful score overrides, or local
   user edits as proof of a remote exploit. No backend/authentication is in scope.
6. If model/tools are unavailable, select the standard agent in Interactive and
   use the same prompt body. Record **standard-agent fallback**, not a specialist run.

### D. Review accessibility with the supplied custom agent

1. Select **Accessibility Expert**. Inspect the unchanged
   [definition](../.github/agents/accessibility.md).
2. It mandates creating a WCAG 2.1 testing-plan document. This is **not read-only**.
   Review proposed output paths before invocation; allow only workshop report/
   plan outputs, not unsolicited application fixes.
3. Attach the form, feedback/error flow, and styles. Paste:

```text
Review the facility-name workflow and its invalid/corrected states.
Do not change application code or install tools. Your definition mandates
testing-plan output: preview the path and limit file writes to that plan.
Check labels, field/error association, aria-invalid, keyboard operation,
visible focus, correction/retry, and discoverable error/status feedback.
Return evidence and applicable WCAG references; separate observed behavior,
source inference, and manual checks not performed. Your role targets WCAG 2.1 AA;
do not present it as a complete WCAG 2.2 evaluation or conformance certification.
Stop after findings and the plan.
```

4. Supplement its 2.1 findings with relevant **WCAG 2.2 AA** checks, particularly
   focus not obscured and target size, where applicable. See the
   [W3C additions](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/).
5. Manually navigate and correct the form using the keyboard. Record screen-reader,
   zoom, contrast, and other checks as unverified unless actually performed.

### E. Decide, then correct

1. Record each suggestion, supporting evidence, and your decision in Chat or
   your own notes. Use this guide:

| Decision | Required evidence |
| --- | --- |
| Accept | Reproducible contract violation and a bounded correction/test. |
| Modify | Real issue, but the suggested patch changes too much. |
| Reject | False positive, intended behavior, or unsupported claim. |
| Investigate | Specific evidence still needed before deciding. |

2. Return to the standard agent in **Interactive**. Approve only confirmed,
   in-scope corrections. Add a focused regression for each accepted defect.
3. Inspect application diffs separately from generated reports. Keep report
   outputs local; ignored report paths do not appear in normal Source Control.
4. Rerun affected tests and build. If no actionable issues were found, record
   that result and remaining gaps rather than inventing a repair.

## 4. Checkpoint

- Distinguish dedicated code review, specialist review, and chat fallback.
- Show each finding's evidence, disposition, and verified correction if accepted.
- Explain the custom agents' actual capabilities and report-writing limits.
- Separate WCAG 2.1 agent guidance from the workshop's scoped 2.2 AA target.
- Make no blanket security or accessibility-conformance claim.

## 5. Retrospective

- Which suggestion did you accept, modify, reject, or investigate?
- What evidence changed your decision?
- How is selecting a custom agent different from selecting Autopilot?

**Next: [Module 4 - Testing and confidence](4-testing.md).**
