from server.models import Severity


# Synthetic training rules, not official CFIA inspection policy.
RISK_RULES: dict[Severity, tuple[int, str]] = {
    "low": (20, "Routine follow-up"),
    "medium": (50, "Schedule follow-up inspection"),
    "high": (80, "Prioritize immediate review"),
}


def calculate_risk(severity: Severity) -> tuple[int, str]:
    return RISK_RULES[severity]
