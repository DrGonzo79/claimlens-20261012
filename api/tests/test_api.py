import json
from pathlib import Path
from fastapi.testclient import TestClient
from main import app

client=TestClient(app)
fixtures=json.loads((Path(__file__).parents[2]/"data"/"demo_ledger.json").read_text())

def test_health(): assert client.get("/health").json()=={"status":"ok"}
def test_audit_shared_fixtures():
    response=client.post("/audit",json={"rows":fixtures,"tolerance":5})
    assert response.status_code==200
    body=response.json()
    assert body["finding_count"]==3
    assert body["potential_recovery"]==220.03
    assert body["findings"][0]["order_id"]=="MCF-7013"
def test_rejects_empty_rows(): assert client.post("/audit",json={"rows":[]}).status_code==422
def test_rejects_negative_money():
    broken={**fixtures[0],"actual_payout":-1}
    assert client.post("/audit",json={"rows":[broken]}).status_code==422
def test_rejects_duplicates():
    assert client.post("/audit",json={"rows":[fixtures[0],fixtures[0]]}).status_code==422
