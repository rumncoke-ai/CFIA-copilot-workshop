# Module 1 - Understand the inherited application

## 1. Objective

**Suggested duration: 15 minutes.**

In this module, we'll step into the role of a developer who has just joined the
team maintaining the Inspection Findings Tracker. Before making changes, we'll
use GitHub Copilot to understand what the application does, how its business
rules work, and where those rules are implemented in code. We'll:

1. Follow the application's business workflow and explore its risk-scoring logic.
2. Explore the technical architecture and visualize how the main components interact.
3. Check Copilot's explanations against the actual source code.
4. Look at the existing tests to understand how application behavior is validated.

**Important:** This module is about exploring, so we won't change any application
code.

## 2. Why it matters

Maintenance starts with understanding what exists, not asking Copilot to rewrite
it. An inspector lead depends on the complete save-and-follow-up workflow.
You need to know where a change belongs and which existing behavior to preserve.

## 3. Tasks

### A. Understand the business logic

Before diving into the implementation, we'll use Copilot to understand how
inspectors use the application and how it determines recommended follow-up
actions.

#### Step 1: Explore the business workflow

1. Open the repository folder in VS Code.
2. Open GitHub Copilot Chat and select the **Copilot** harness/session target.
   In its **Agent mode** picker, select **Interactive**.
3. Paste this prompt:

```text
I'm a developer who has recently joined the team maintaining the Inspection
Findings Tracker. Before exploring the technical implementation, help me
understand the application's business workflow and decision-making logic.
Review the existing source code and explain:

1. Business workflow: What information does an inspector enter when recording
   a finding? What happens after submission, and what information is displayed?
2. Risk assessment: What are the exact scoring rules for each severity level,
   and how are recommended follow-up actions selected?
3. Practical example: Walk through a synthetic inspection finding and show how
   its severity leads to a particular risk score and recommended action.

Keep the explanation concise, conversational, and focused on the business
process rather than technical implementation details. Cite the source files.
These are synthetic training rules, not official inspection policy.
Do not investigate bugs, suggest improvements, modify files, install packages,
or run mutating commands.
```

#### Step 2: Verify the business rules

1. Review Copilot's explanation.
2. Open [risk.ts](../client/src/risk.ts) and locate the severity-to-score mapping.
3. Confirm that the implemented scores and follow-up actions match the explanation.

**Checkpoint:** We should now be able to explain what the application does,
what information an inspector provides, and how severity determines the risk
score and recommended follow-up action.

### B. Explore the technical architecture

Now that we understand the business workflow, we'll explore how the application
implements it and create a diagram showing how the main parts connect.

#### Step 1: Explore the implementation

1. Continue the conversation with Copilot.
2. (Optional) Attach these files to Chat:
   - [client/src/App.tsx](../client/src/App.tsx)
   - [client/src/FindingForm.tsx](../client/src/FindingForm.tsx)
   - [client/src/findings.ts](../client/src/findings.ts)
   - [client/src/risk.ts](../client/src/risk.ts)

   > <sub>Tip: Hold Ctrl (Windows/Linux) or Cmd (Mac) to select several files in Explorer, then drag them into Chat together. Or type # in Chat, start typing a file name, and select the match. Repeat for each file.</sub>

3. Paste this prompt:

```text
Now that I understand the Inspection Findings Tracker's business workflow,
help me understand how it is implemented. Explore the existing source code
and explain:

1. Application architecture: Identify the main React components, TypeScript
   services, and supporting files. Briefly explain each file's responsibility.
2. Technical data flow: Trace a finding from form submission through validation,
   risk calculation, storage, and display.
3. Data persistence: Explain where findings are stored, how existing findings
   and seed data are loaded, and what happens on refresh or confirmed reset.
4. Architecture diagram: Generate a small Mermaid flowchart showing the form,
   application component, data service, risk calculation, and storage, with
   the actual functions and calls that connect them.

Reference the actual source files and functions. Keep the explanation concise
and structured. Distinguish the existing implementation from anything
intentionally left for the lab. Do not invent an API, backend, or AI scoring model.
Do not investigate bugs, suggest improvements, modify files, install packages,
or run mutating commands.
```

#### Step 2: Review the diagram

1. Examine the Mermaid diagram and open the referenced functions.
2. Check that the connections follow real calls.
3. Identify where form submission, input validation, risk calculation, data
   storage, and display occur. Locate the storage key as well.

**Checkpoint:** We should now understand how the application's components work
together to process, store, and display findings.

### C. Explore existing tests

Before making changes, we'll look at one existing test to understand how it
checks the application's behavior.

#### Step 1: Find an existing test

1. Open [risk.test.ts](../client/src/risk.test.ts).
2. Locate the high-severity case in the parameterized scoring test.
3. Review it independently and identify:
   - The function being tested.
   - The input provided.
   - The expected result.
   - The assertion that checks that result.

#### Step 2: Ask Copilot for clarification

If the test or its syntax is unfamiliar, use this optional prompt:

```text
Explain the high-severity case in the parameterized risk calculation test in
client/src/risk.test.ts. Walk me through its input, expected output, and assertion.
Explain what behavior it verifies and one important behavior it does not verify.
Keep the explanation short and reference the actual test.
Do not modify files, install packages, or run mutating commands.
```

#### Step 3: Reflect

- Does the test check the same scoring rule we explored earlier?
- Does passing this test guarantee that the entire application works correctly?

We won't need to run or modify tests in this module. We'll explore automated
testing in greater detail in [Module 3](3-testing.md).

## 4. Checkpoint

Before continuing, make sure we can:

- Explain the application's business purpose and workflow.
- Describe how severity determines risk scores and recommended actions.
- Identify the main components and their responsibilities.
- Explain the flow from form -> App -> service -> scoring/storage -> display.
- Locate validation, scoring, seed initialization, and confirmed reset.
- Interpret the Mermaid diagram and distinguish existing behavior from a proposal.
- Verify a Copilot explanation against source code and application behavior.
- Locate and understand an existing unit test and recognize its limits.
- Confirm that no application files were modified.

## 5. Retrospective

Take a moment to reflect:

1. How did Copilot help us understand the unfamiliar application?
2. Why is it useful to understand business logic before exploring the implementation?
3. Why should we verify Copilot-generated explanations against the actual code?

**Next: [Module 2 - Fix the bug from start to finish](2-implementation.md).**
