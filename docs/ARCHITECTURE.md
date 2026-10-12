# Architecture

```mermaid
flowchart LR
  F[Shared fictional fixtures] --> UI[Next.js audit workbench]
  F --> API[FastAPI POST /audit]
  UI --> R[Deterministic reconciliation]
  API --> R2[Deterministic reconciliation]
  R --> V[Findings: code, amount, evidence]
  R2 --> V
```

GitHub Pages hosts only the static frontend. FastAPI is tested source, not a live dependency. Production would move normalization/reconciliation behind the API, persist immutable inputs and decision events, and keep marketplace adapters isolated.
