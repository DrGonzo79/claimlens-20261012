# CEO review — ClaimLens

**Mode:** scope reduction. The report’s full vision spans five integrations, claim filing, billing, and monitoring; that is too much before a trusted dataset exists.

## Premise and alternatives

The business outcome is recovered cash with defensible evidence, not another dashboard. A CSV audit is reversible and tests value; marketplace write access and automated filing are high-magnitude trust decisions. Recommended path: concierge audit now, read-only connectors only after five observed audits, filing only after measured precision.

`CURRENT: spreadsheets + channel vendors → THIS PLAN: explainable CSV audit → 12-MONTH IDEAL: monitored cross-channel evidence ledger with human-approved filing`

## Review findings

1. **Architecture:** shared fixtures prove parity; deterministic rules return finding codes and evidence. Keep connector adapters outside the core. Nil, empty, invalid, and inconsistent rows fail visibly.
2. **Error/rescue:** malformed amount → validation error; duplicate order IDs → conflict finding; absent payout → `MISSING_PAYOUT`; unrecognized channel → rejected input; calculation failure → audit error banner. No silent row drops.
3. **Security:** demo data is explicitly fictional. Production exports are financial data: encryption, tenant isolation, least-privilege read scopes, retention controls, and audit logs are launch gates.
4. **Data/interaction:** loading, empty, success, and error states are explicit. Re-running replaces prior results; filters do not mutate findings; small screens scroll tables within their region.
5. **Code quality:** one reconciliation module per runtime and stable finding codes. Duplication is acceptable in the static demo but contract tests must prevent drift.
6. **Tests:** cover matched rows, missing payout, fee variance, invalid input, channel filter, audit interaction, and mobile overflow.
7. **Observability:** production needs rows ingested/rejected, exception yield, false-positive overturn rate, dollars recovered, claim aging, connector lag, and audit completion latency.
8. **State:** demo is client-only and disposable. Production needs immutable source rows, normalized transactions, findings, evidence artifacts, claim events, and human decisions.
9. **API:** `POST /audit` accepts bounded rows and tolerance; version finding codes before external clients. Rate-limit uploads; return row-level validation paths.
10. **Scale:** streaming imports and indexed order/channel/time keys matter at 100×. Never join five full exports in browser memory in production.
11. **UX:** show recovered-dollar opportunity first, then ranked findings and why each fired. Keep warnings visible, keyboard focus obvious, and table overflow contained.

## Decisions

- **Accepted:** fictional four-row audit, channel filter, adjustable fee tolerance, deterministic FastAPI operation, downloadable/claim-ready semantics in docs.
- **Deferred:** OAuth connectors, persistence, PDF export, billing, automated filing, notifications.
- **Not in scope:** legal/accounting advice, live seller credentials, claims submitted to marketplaces, or claims of verified recovery.
- **Failure criterion:** if fewer than 2 of 10 qualified sellers provide exports or none authorizes contingency recovery, stop building connectors.
