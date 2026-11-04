---
description: "Plan scoped WCAG 2.2 AA checks for the tracker form using the existing Playwright and axe setup."
---

Use the standard agent in Interactive. Read the actual repaired form and
error/status flow, client/playwright.config.ts, and existing browser
tests. This is a separate workshop task, not the unchanged accessibility prompt's
full-suite generation recipe. Expect whitespace-only facility names to show
associated field feedback and an invalid state, retain inputs, and report no
success. Correcting the name should allow a successful save and clear the form.

First propose missing checks for the initial form, whitespace-only rejection,
and corrected successful save. Return criterion, state, automated/manual method,
pass/fail expectation, and evidence location. Pause for approval before edits.

After approval, add only missing cases to client/e2e/accessibility.spec.ts or
client/e2e/*.accessibility.spec.ts using the existing runner and local service.
Use @axe-core/playwright with applicable WCAG 2 A/AA, 2.1 A/AA, and 2.2 AA tags.
Add explicit assertions for accessible labels, invalid state, described errors,
keyboard correction/retry, and focus behavior where appropriate.

Give each criterion-specific case its correct WCAG reference and exact expected
behavior. An axe scan covers selected rules, not every success criterion.
Use isolated browser contexts, awaited locators, and meaningful assertions.
Attach axe results and report failing rule IDs, affected DOM nodes, page/state,
and actionable guidance. Do not invent source file/line mappings from URLs.

Decorative images may correctly have alt=""; do not require nonempty alternative
text on every image. Assess applicable WCAG 2.2 additions separately, including
focus not obscured and target size, respecting criterion exceptions.
Keep screen-reader, zoom/reflow, contrast, and other manual checks explicit;
mark them unverified unless actually performed. A green scan is not conformance.

Do not install packages, create another runner/config, change application code,
generate broad compliance documents, commit, or push.
Run npm.cmd --prefix .\client run test:a11y from repository root.
Report actual commands/results, what each check establishes, and remaining gaps.
