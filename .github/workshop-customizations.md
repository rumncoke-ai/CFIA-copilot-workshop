# Workshop agents and prompts

## What is supplied

The three reference files below are preserved byte-for-byte from the supplied
downloads. Their contents are examples to inspect, not guarantees of correctness
or compatibility. The workshop companion prompts are separate, original files.

| Kind | File | Purpose |
| --- | --- | --- |
| Supplied custom agent | [security-expert.md](agents/security-expert.md) | OWASP Top 10:2025 review role; default display name may be `security-expert`. |
| Supplied custom agent | [accessibility.md](agents/accessibility.md) | Accessibility Expert, explicitly targeting WCAG 2.1 AA. |
| Supplied prompt | [accessibility.prompt.md](prompts/accessibility.prompt.md) | Broad WCAG 2.1 testing-suite generation recipe. |
| Workshop companion prompt | [workshop-security-review.prompt.md](prompts/workshop-security-review.prompt.md) | Bounded evidence-led security review for Module 3. |
| Workshop companion prompt | [workshop-accessibility-tests.prompt.md](prompts/workshop-accessibility-tests.prompt.md) | Scoped WCAG 2.2 AA test planning/execution for Module 4. |

An agent defines a role, instructions, and tools. A prompt supplies a reusable
task. Interactive/Plan/Autopilot control the workflow; selecting a model or agent
does not automatically change the harness or permissions.

## Check discovery before the session

1. Select the **Copilot** harness/session target in Chat.
2. Open **Chat: Open Customizations** and the **Agents** tab where available.
   Confirm the two workspace agents are listed without file errors.
3. Inspect the selected role in the agent picker. Verify the pinned model and
   recognized tools are available before running a representative review.
4. Type `/` in Chat and look for the prompt names. If a prompt changes the active
   role in your version, paste its body into the intended agent conversation.
5. Inspect tool activity, output paths, and diffs. Discovery alone does not prove
   that a role ran correctly.

Current VS Code documentation supports `.md` and `.agent.md` files in
`.github/agents`. Tools/frontmatter support varies by harness. Do not rename or
silently rewrite the supplied files to hide incompatibilities.

## Limits to disclose

- Both agents pin **Claude Sonnet 4**. That model may not be available in the
  participant account. Use a supported UI override only if it actually works;
  otherwise use a standard-agent prompt fallback and label it accurately.
- Tool lists include editor/version-specific identifiers. Check recognized
  capabilities; do not promise terminal, browser, or editing tools from names alone.
- The security definition has a legacy `mode: agent` field. Do not assume it
  configures the current Agent mode picker or makes a role automatically compatible.
- The security agent writes under `security-reports`. The accessibility agent
  mandates a plan on every invocation and names multiple output locations:
  `tests/accessibility` and `WCAG-2.1-AA`. These agents are **not read-only**.
  Preview/approve report writes separately from application changes.
- Those generated report paths are ignored by this workshop. Inspect them in the
  Explorer even if Source Control shows no new files. Do not include real records.
- Both accessibility sources target **WCAG 2.1 AA**. The workshop teaching target
  is scoped **WCAG 2.2 AA** evaluation, with supplementary checks; do not relabel
  the originals or claim that either establishes full conformance.
- The supplied accessibility prompt incorrectly fails every image with empty
  alternative text. Decorative images may correctly use `alt=""`.
- That prompt's generated DOM URL/element position does not establish a source
  file/line, its final execution covers only Perceivable checks, and its mandatory
  broad generation does not fit the small maintenance exercise.
- Do not run that full recipe verbatim as the core test exercise. Inspect it,
  discuss its limits, then use the distinct scoped workshop companion.
- Do not fetch/copy entire external checklists into generated workshop material.
  Link official criteria and author scoped checks.

## Fallbacks and evidence

If a model/tool/discovery prerequisite is unavailable, stop the specialist run.
In the standard agent's **Interactive** workflow, attach the same context and
paste the relevant companion prompt body. For accessibility review, use Module
3's review request without the specialist's mandatory plan-writing requirement.
Record that this was a **standard-agent fallback**, not a custom-agent demo.

Browser tests run through the repository's existing Playwright configuration,
not through assumed tool names in the supplied agents. Verify model/tool
availability and picker behavior on the actual classroom environment; those
interactive checks cannot be inferred from a valid Markdown file.

## Sources

- [Custom agent reference and harness compatibility](https://code.visualstudio.com/docs/agents/reference/custom-agent-file-reference)
- [Create and verify custom agents](https://code.visualstudio.com/docs/agent-customization/custom-agents)
- [Prompt files](https://code.visualstudio.com/docs/agent-customization/prompt-files)
- [Copilot planning and permissions distinction](https://code.visualstudio.com/docs/agents/run/planning)
- [WCAG versions](https://www.w3.org/WAI/standards-guidelines/wcag/)
- [Decorative images](https://www.w3.org/WAI/tutorials/images/decorative/)
- [OWASP Top 10:2025](https://top10.owasp.org/2025/)
