---
description: "Review the tracker maintenance diff against its actual browser-only security boundaries."
---

Review the supplied facility-name maintenance diff, adjacent service/rendering
code, and SECURITY.md. Expect whitespace-only facility names to be rejected before
storage access, with field feedback, retained inputs, and no success message.
Corrected valid names should save normally; existing normalization, scoring,
persistence, and reset behavior must remain unchanged. Do not edit application code, install
tools, commit, push, or broaden scope. If the selected specialist mandates a
report, preview the path and limit writes to that report.

Use the actual frontend-only, synthetic-data context. Examine runtime input
handling, validation before writes, safe text rendering, error behavior, and
localStorage assumptions. Use applicable OWASP Top 10:2025 categories as an
awareness framework, not as evidence that every category affects this app.

Return actionable findings with file/function, verified line when available,
concrete reproduction, expected versus actual behavior, severity, impact,
confidence, minimal proposed remediation, and focused verification.
Separate confirmed vulnerabilities, reliability/contract defects, hypotheses,
existing safe behavior, and accepted demo limitations.

No findings is valid. Do not invent remote attack paths, authentication, APIs,
or tamper-proof client storage. Ignored caller fields do not prove a successful
score override. Propose corrections for human approval; do not apply them.
Report checks as performed only if you actually performed them.
