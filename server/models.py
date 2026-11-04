from typing import Literal

from pydantic import BaseModel, ConfigDict


Severity = Literal["low", "medium", "high"]


class FindingCreate(BaseModel):
    # intentionally weak for workshop hardening: unknown fields are ignored.
    model_config = ConfigDict(extra="ignore")

    # intentionally weak for workshop hardening: no trimming or length limits.
    inspector_id: str
    facility_name: str
    inspection_type: str
    severity: Severity
    notes: str


class Finding(FindingCreate):
    risk_score: int
    follow_up_action: str
