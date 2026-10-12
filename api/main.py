from typing import Literal
from fastapi import FastAPI
from pydantic import BaseModel, Field, model_validator

app = FastAPI(title="ClaimLens audit API", version="0.1.0")

class LedgerRow(BaseModel):
    order_id: str = Field(min_length=1, max_length=80)
    channel: str = Field(min_length=1, max_length=80)
    sale: float = Field(ge=0)
    expected_payout: float = Field(ge=0)
    actual_payout: float = Field(ge=0)
    status: Literal["settled", "delivered", "returned"]
    claim_days_left: int = Field(ge=0, le=365)

class AuditRequest(BaseModel):
    rows: list[LedgerRow] = Field(min_length=1, max_length=10_000)
    tolerance: float = Field(default=5, ge=0, le=10_000)
    @model_validator(mode="after")
    def unique_orders(self):
        ids=[row.order_id for row in self.rows]
        if len(ids)!=len(set(ids)): raise ValueError("duplicate order_id")
        return self

class Finding(BaseModel):
    order_id: str
    channel: str
    code: Literal["MISSING_PAYOUT", "PAYOUT_VARIANCE"]
    amount: float
    claim_days_left: int
    evidence: list[str]

@app.get("/health")
def health(): return {"status":"ok"}

@app.post("/audit")
def audit(request: AuditRequest):
    findings=[]
    for row in request.rows:
        gap=round(row.expected_payout-row.actual_payout,2)
        if row.actual_payout==0 and row.expected_payout>0:
            findings.append(Finding(order_id=row.order_id,channel=row.channel,code="MISSING_PAYOUT",amount=row.expected_payout,claim_days_left=row.claim_days_left,evidence=["order status","expected payout","settlement export"]))
        elif gap>request.tolerance:
            findings.append(Finding(order_id=row.order_id,channel=row.channel,code="PAYOUT_VARIANCE",amount=gap,claim_days_left=row.claim_days_left,evidence=["order total","fee schedule","payout line"]))
    findings.sort(key=lambda f:(f.claim_days_left,-f.amount))
    return {"finding_count":len(findings),"potential_recovery":round(sum(f.amount for f in findings),2),"findings":findings}
