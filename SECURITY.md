# Security boundaries

This workshop uses synthetic inspection findings, not production CFIA data.
Do not put real inspection records, personal information, credentials, or
connection strings into this repository or Copilot prompts.

The app is a frontend-only local training tool, not a production deployment.
It stores synthetic records in localStorage under `cfia-workshop.findings.v1`.
Storage persists across browser reloads and dev-server restarts for the same
origin and profile. Reset demo data replaces only this app's records with the
bundled example after confirmation; it does not clear unrelated site data.

Users can edit localStorage and client-side code. Neither browser validation
nor calculated scores are a trusted enforcement boundary. Shape checks detect
malformed records, not all semantic tampering. Never describe this lab as
providing authentication, shared durable records, or authoritative scoring.

Security review focuses on runtime input handling, safe text rendering,
storage assumptions, visible failures, and the actual maintenance diff.
Intentional starter gaps include text normalization/limits and rejection of
unknown create fields. Do not treat every exercise gap as an exploitable
vulnerability, or add an HTML blacklist instead of safe rendering.

The core participant fix addresses facility-name whitespace and feedback only.
Other-field limits and unknown-field hardening are deferred, not completed.
The supplied specialist agents can write reports and have model/tool dependencies;
read the [customization guide](.github/workshop-customizations.md) before invoking
them. Keep reports synthetic and local. Automated accessibility scans and
security suggestions are not certification or proof of production readiness.

If a secret or real record is accidentally included, stop sharing the affected
content and notify the facilitator. Revoke exposed credentials through the
appropriate organizational process.
