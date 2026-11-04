from collections.abc import Iterator

import pytest
from fastapi.testclient import TestClient

from server.app import app, findings


@pytest.fixture
def client() -> Iterator[TestClient]:
    findings.clear()
    try:
        with TestClient(app) as test_client:
            yield test_client
    finally:
        findings.clear()


# intentionally weak for workshop hardening: happy paths only; no edge cases.
def test_list_findings_starts_empty(client: TestClient) -> None:
    response = client.get("/findings")

    assert response.status_code == 200
    assert response.json() == []


def test_create_and_list_high_severity_finding(client: TestClient) -> None:
    payload = {
        "inspector_id": "INS-001",
        "facility_name": "Demo Facility",
        "inspection_type": "Routine",
        "severity": "high",
        "notes": "Synthetic finding: damaged storage seal.",
    }
    expected = {
        **payload,
        "risk_score": 80,
        "follow_up_action": "Prioritize immediate review",
    }

    created = client.post("/findings", json=payload)

    assert created.status_code == 201
    assert created.json() == expected

    listed = client.get("/findings")

    assert listed.status_code == 200
    assert listed.json() == [expected]
