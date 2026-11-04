# Module 5 - Retrospective and operational reuse

## 1. Objective

**Timebox: 10 minutes; 5-minute fast path if needed.** Capture **three reusable
GHCP prompt patterns**, **three traps with mitigation actions**, and one concrete
way to apply each pattern to your day-to-day projects.

Save the results in the [prompt playbook](../prompts/prompt-playbook.md).
Use evidence from the same tracker you improved in Modules 1-4, not generic tips.

## 2. Why this matters in real SDLC

A successful demo is useful only if its habits transfer to your next change.
The reusable workflow is not "ask Copilot to build it": it is defining an oracle,
reviewing a bounded diff, and verifying the result.

GHCP outputs are probabilistic. Your review and test evidence remain the
guardrails when applying these patterns to another service or UI.

## 3. Tasks

### A. Record three patterns (3 minutes)

Use the templates in section 4. Add three rows to the playbook:

`Pattern | Exact prompt used | Tracker example | Verification evidence |
Next use in my project`

For the tracker example, cite a criterion or review finding and the actual
result: normalized facility name, rejected extra score field, or Unicode-boundary
test. Include the command or browser check you used; do not invent evidence.

### B. Record three traps and actions (2 minutes)

Use these candidates or replace them with traps you actually encountered:

| Trap | Mitigation action to record |
| --- | --- |
| One giant prompt produces unrelated changes | Name allowed files and one criterion; approve an explanation before each small diff. |
| Blindly accepting plausible code or review claims | Inspect the referenced code and reproduce the behavior before accepting a fix. |
| Green tests mistaken for sufficient confidence | Map tests to criteria, add a missing edge case, and document mocked boundaries and unverified risks. |

Add a tracker example to each row. Label a trap **observed** or **anticipated**
rather than claiming an experience you did not have.

### C. Transfer the lessons (3 minutes)

For each pattern, finish:

> On my next [specific task], I will supply [context], ask for [bounded output],
> and verify it with [specific check].

Examples: an API validation change, a form submission fix, or a dependency-related
regression. Use task descriptions, not confidential code or production data.
Choose one action you can try on your next pull request or local review.

### D. Share and close (2 minutes)

Tell a partner one change you made, why it reduced risk, and what evidence
supports it. Name one remaining limitation from
[requirements.md](../requirements.md).

For the **5-minute fast path**, spend two minutes on patterns, one on traps,
one on transfer, and one on the partner debrief. Still capture all three of each.

Stop the single local app with Ctrl+C in its terminal when finished.

## 4. VS Code + GHCP prompts to run

These are reusable templates. Save them in the playbook and replace brackets
with your reviewed context. You do not need to rerun implementation now.
If asking Chat to summarize the lab, attach actual evidence and allow edits
only to the playbook.

**Pattern 1 - Criteria before code**

```text
Do not edit code. Turn [user story] into testable criteria within [scope].
Use [reviewed rules]. Return IDs, inputs, exact expected outcomes, edge cases,
and verification methods. List unresolved assumptions instead of inventing policy.
```

Use for: a new endpoint or feature request. Tracker example: Module 1's
score/action contract and explicit validation limits.

**Pattern 2 - Explain, bound, apply**

```text
Do not edit yet. For [criterion or reproduced finding], explain the smallest
change in [allowed files], preserved behavior, and verification command.
Wait for approval. After approval, apply only that change and summarize the diff.
```

Use for: a focused bug fix or hardening change. Tracker example: reject unknown
create-input fields without rewriting scoring or storage.

**Pattern 3 - Test against an independent oracle**

```text
Generate tests from [reviewed criteria] with explicit expected outputs.
Include [edge case]. Do not derive expected values from production constants.
State what each test proves, its mocked boundaries, and remaining coverage gaps.
```

Use for: regression tests around an existing feature. Tracker example:
1000/1001-code-point notes and the distinction between jsdom localStorage
integration and real-browser reload checks.

## 5. Checkpoint

Show the saved [prompt playbook](../prompts/prompt-playbook.md) containing:

- **Three patterns**, each with an exact prompt, tracker example, and evidence.
- **Three traps**, each with a concrete mitigation action.
- **Three day-to-day applications**, one per pattern.
- One selected next-project action and one remaining lab limitation.

No new feature or infrastructure work is required.

## 6. Retrospective checklist

- [ ] I captured three prompts I can reuse with different task context.
- [ ] I captured three traps and actions that prevent or detect them.
- [ ] I mapped each pattern to a specific day-to-day engineering task.
- [ ] I can explain what I changed and why it reduced risk.
- [ ] I can distinguish a Copilot suggestion from verified behavior.
- [ ] I can name evidence still needed before claiming the full definition of done.
- [ ] I chose one concrete habit to use on my next change.

## 7. Common traps

- **Generic lessons:** replace "give better context" with allowed files,
  criterion IDs, and expected response shape.
- **Invented success stories:** record actual observations; label missing
  evidence and anticipated traps honestly.
- **No transfer action:** name the next task and verification check, not
  "use Copilot more."
