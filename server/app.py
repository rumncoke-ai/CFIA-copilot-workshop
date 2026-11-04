from fastapi import FastAPI, status

from server.models import Finding, FindingCreate
from server.risk import calculate_risk


app = FastAPI(title="CFIA Inspection Findings Tracker")
findings: list[Finding] = []


@app.post("/findings", response_model=Finding, status_code=status.HTTP_201_CREATED)
async def create_finding(payload: FindingCreate) -> Finding:
    risk_score, follow_up_action = calculate_risk(payload.severity)
    finding = Finding(
        **payload.model_dump(),
        risk_score=risk_score,
        follow_up_action=follow_up_action,
    )
    findings.append(finding)
    return finding


@app.get("/findings", response_model=list[Finding])
async def list_findings() -> list[Finding]:
    return findings.copy()
