# Module 1 - Understand the inherited application

## 1. Objective

**Suggested duration: 15 minutes.**

In this module, we'll explore the Inspection Findings Tracker with Copilot to
understand how it works. We'll follow what happens when you save a finding, check
Copilot's explanation against the code and the running app, and create a simple
diagram showing how the main parts connect. We'll also look at the existing tests
and what they check. This module is about exploring, so we won't change any
application code.

## 2. Why it matters

Maintenance starts with understanding what exists, not asking Copilot to rewrite
it. An inspector lead depends on the complete save-and-follow-up workflow.
You need to know where a change belongs and which existing behavior to preserve.

## 3. Tasks

### A. Select the workflow and supply context

1. Keep the repository open in VS Code and make sure the app is running.
2. In Chat, select the **Copilot** harness/session target. In its **Agent mode**
   picker, select **Interactive**. These guides use **Interactive, Plan, and
   Autopilot**, not the older Ask/Plan/Agent sequence.
3. Attach these files to Chat (paths start at the repository root):
   - [client/src/App.tsx](../client/src/App.tsx)
   - [client/src/FindingForm.tsx](../client/src/FindingForm.tsx)
   - [client/src/findings.ts](../client/src/findings.ts)
   - [client/src/risk.ts](../client/src/risk.ts)

   > <sub>Tip: Hold Ctrl (Windows/Linux) or Cmd (Mac) to select several files in Explorer, then drag them into Chat together. Or type # in Chat, start typing a file name, and select the match. Repeat for each file.</sub>

4. Paste this prompt:

```text
Explain the inherited Inspection Findings Tracker. Do not edit files, install
packages, or run mutating commands. Use the actual source, not a proposed design.
Trace a finding from form submission to validation, calculated score/action,
localStorage, and display. Explain seed loading, reload, and confirmed reset.
Return a short explanation, source file/function references, and a small Mermaid
diagram. Identify what is implemented versus intentionally left for the lab.
Do not invent an API, backend, AI scoring model, or official inspection policy.
```

### B. Verify the explanation

1. Open each referenced function. Check that the diagram follows real calls.
2. Locate the severity-to-score mapping and storage key.
3. Save a synthetic high finding. Expect **80 / Prioritize immediate review**.
4. Reload the browser at the same address. Confirm the finding remains.

### C. Locate the evidence

1. Attach these test files to Chat (paths start at the repository root):
   - [client/src/risk.test.ts](../client/src/risk.test.ts)
   - [client/src/findings.test.ts](../client/src/findings.test.ts)
   - [client/src/App.test.tsx](../client/src/App.test.tsx)
   - [client/e2e/starter.spec.ts](../client/e2e/starter.spec.ts)
2. Paste:

```text
Do not edit. Identify one scoring unit test, one service/storage test,
one App/form/service integration test, and the real-browser baseline.
Explain what each proves and one thing it does not prove. Cite actual tests.
Do not describe jsdom as browser E2E or passing tests as comprehensive coverage.
```

## 4. Checkpoint

- Explain form -> App -> service -> scoring/storage -> display.
- Locate validation, scoring, seed initialization, and confirmed reset.
- Distinguish the existing architecture from a proposed change.
- Explain the difference between jsdom integration and browser E2E.
- Verify that no application files changed.

## 5. Retrospective

- Which Copilot explanation did you check against source?
- Why do TypeScript types not establish runtime validation?
- What remains unknown before attempting a fix?

**Next: [Module 2 - Fix the bug from start to finish](2-implementation.md).**
