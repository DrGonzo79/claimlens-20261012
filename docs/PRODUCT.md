# Product plan

## ICP and JTBD
Finance/ops leads at $2M–$20M GMV brands using Amazon fulfillment plus at least one other sales channel. “When a settlement does not match an order, show me the exact break and evidence before the claim window expires.”

## MVP and data model
Upload/normalize order and payout rows, apply explicit reconciliation rules, rank findings by recoverable amount and urgency, and prepare an evidence checklist. Entities: `SourceRow`, `Order`, `Payout`, `Finding`, `EvidenceItem`, `Claim`, `DecisionEvent`.

## Architecture and model strategy
Next.js static demo mirrors a tested FastAPI `POST /audit` domain operation. Production adds server-side encrypted imports and connector adapters. Rules remain deterministic for monetary conclusions; AI may classify messy memo text or draft case narratives, but it cannot create amounts, submit claims, or override evidence without human approval.

## Economics and validation
The report’s midpoint model is $5M GMV × 2% recoverable × 22% = $22K/year per retained customer. Every input needs validation. Run 10 concierge audits; success means ≥5 export bundles, ≥3 material findings confirmed by operators, ≥2 signed contingency authorizations, and <10% finding-overturn rate. Kill if access or accuracy fails.

## Moat, risks, roadmap
The plausible moat is a channel-spanning evidence graph plus adjudication outcomes—not generic anomaly detection. Risks are policy compression, platform trust, false positives, long claims, and outbound CAC.

- **30 days:** 10 observed audits, canonical schemas, claim-window rules, first recovery authorization.
- **60 days:** one read-only connector, evidence packet export, decision audit log, recovery-yield dashboard.
- **90 days:** second channel, human-approved case workflow, contingency invoicing, SOC 2 readiness plan. Expand only with measured yield.
