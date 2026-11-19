# Module 4 - Code, security, and accessibility review

## 1. Objective

**Suggested duration: 25 minutes.**

In this module, we'll review the changes we've implemented and tested in the
Inspection Findings Tracker. Before the application is ready for release, we'll
check the code for correctness, security, and accessibility.

We'll use GitHub Copilot to:

1. Review code changes using Copilot Code Review.
2. Conduct a security review using a specialized custom agent.
3. Evaluate accessibility using the Accessibility Expert.
4. Investigate findings and determine which recommendations are actionable.
5. Make an evidence-based release-readiness recommendation.

We'll finish with an understanding of how AI-assisted reviews support software
quality and why we remain responsible for evaluating Copilot's recommendations.

This module focuses on reviewing and evaluating findings. Implementing
additional fixes is optional.

## 2. Why it matters

Code review, security analysis, and accessibility evaluation ask different
questions. Custom agents provide reusable roles; prompts provide reusable tasks.
Neither replaces human judgment or proves production readiness.

## 3. Tasks

### A. Review correctness with the dedicated local review feature

Before approving the maintenance change, we'll use Copilot to review the
implementation for potential defects and unintended behavior. We'll evaluate
its recommendations rather than automatically apply them.

1. Keep your Module 2 changes available in Source Control.
2. Open **Source Control** and use the Copilot review action above **Changes**
   for uncommitted changes, if available. Note what was reviewed.
3. Run a separate chat-based review of the same, unchanged changes. Select
   relevant changed code and right click to bring up the dropdown menu. Select **Review** from menu. If **Review** is unavailable, select
   **Interactive**, attach the diff, adjacent callers, and tests, then paste:

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

4. Compare the results and record which review produced each finding. Do not
   apply suggestions or edit code during either review; keep the changes
   unchanged until section D. This exercise does not require a GitHub PR,
   commit, push, or remote reviewer.

### B. Review security

With the correctness review complete, we'll look for security and reliability
concerns before release. We'll use a specialized agent to identify potential
issues and check whether its findings are supported by the code.

1. In Chat, click the agent selector at the top and choose **security-expert**.
   If you can't find it, choose **Agent** mode instead.
2. Attach the actual diff, service, and rendering code, then paste:

```text
Review the facility-name fix and nearby service/rendering code. This is a
synthetic-data, browser-only app with no backend. Check runtime input validation,
validation before storage writes, safe text rendering, error handling, and
localStorage assumptions. Use OWASP Top 10:2025 as an awareness guide, not proof
that every category applies.

For actionable findings, include the file/function, evidence and reproduction,
expected versus actual behavior, severity, impact, confidence, a minimal fix,
and a focused check. Separate confirmed vulnerabilities, reliability issues,
hypotheses, safe behavior, and demo limitations. No findings is valid. Do not
invent remote attacks, authentication, APIs, or tamper-proof browser storage.
Do not edit code; propose fixes for review. Report checks only if performed.
```

3. Keep the findings in Chat or your own notes. If a specialist offers edits,
   commands, or a report file, decline and restate the read-only scope.

### C. Review accessibility

An application can function correctly and still present barriers to people
using a keyboard or assistive technologies. We'll use the Accessibility Expert
to identify potential barriers and check which findings need manual verification.

1. In Chat, click the agent selector at the top and choose **Accessibility Expert**.
   If you can't find it, choose **Agent** mode instead.
2. Attach the form, feedback/error flow, and styles. Paste:

```text
Review the facility-name workflow and its invalid/corrected states.
Do not change application code or install tools. If you propose a testing-plan
file, show its path and wait for approval before writing it.
Check labels, field/error association, aria-invalid, keyboard operation,
visible focus, correction/retry, and discoverable error/status feedback.
Return evidence and applicable WCAG references; separate observed behavior,
source inference, and manual checks not performed. Your role targets WCAG 2.1 AA;
do not present it as a complete WCAG 2.2 evaluation or conformance certification.
Stop after findings and the plan.
```
3. Choose one finding from the accessibility report and check it against the code or running app. If there are no findings, try one suggested manual check. Record whether the evidence supports it or more verification is needed in Chat or your own notes
### D. Decide, then correct

We've reviewed correctness, security, and accessibility. Now we'll choose one
suggestion or problem from any of those reviews, check the evidence, and decide
what to do rather than automatically accept Copilot's recommendation.

1. Choose one suggestion or problem from the code, security, or accessibility
   review. Check it against the code or running app, then record the evidence
   and your decision in Chat or your own notes. Use this guide:

| Decision | Required evidence |
| --- | --- |
| Accept | Reproducible contract violation and a bounded correction/test. |
| Modify | Real issue, but the suggested patch changes too much. |
| Reject | False positive, intended behavior, or unsupported claim. |
| Investigate | Specific evidence still needed before deciding. |

2. If the issue is confirmed and a small correction is in scope, return to the
   standard agent in **Interactive** and ask Copilot to propose a minimal fix
   and a focused verification check. Review the proposal before approving edits.
   Otherwise, record why no change is needed or what needs further investigation.
3. If you make a correction, inspect the diff to confirm it addresses only the
   chosen issue. Add or update a focused regression test where applicable.
   No generated report files are required.
4. Verify any correction with the focused check, rerun affected tests, and build.
   If no actionable issues were found, choose one suggested verification check
   and record the result instead of inventing a repair.

## 4. Checkpoint

- Distinguish dedicated code review, specialist review, and chat fallback.
- Show each finding's evidence, disposition, and verified correction if accepted.
- Explain what you reviewed and what you did not verify.
- Identify relevant WCAG 2.1 guidance and selected 2.2 AA checks, not a full audit.
- Make no blanket security or accessibility-conformance claim.

## 5. Retrospective

- Which suggestion did you accept, modify, reject, or investigate?
- What evidence changed your decision?
- How is selecting a custom agent different from selecting Autopilot?

**Next: [Module 5 - Retrospective and operational reuse](5-retrospective.md).**
