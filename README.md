# ClaimLens

A runnable prototype of a cross-marketplace payout audit. The UI uses clearly labeled fictional fixtures; FastAPI implements the same deterministic reconciliation operation. No marketplace account is connected and no claim is filed.

## Run

```bash
npm ci
npm run dev
uv sync --project api --locked --dev
uv run --project api uvicorn main:app --app-dir api --reload
```

## Verify

```bash
npm run typecheck
npm run test:e2e
npm run build
npm run audit:prod
uv run --project api pytest api/tests
```

GitHub Pages hosts the static Next.js frontend only. The Python backend is runnable/tested source and is not publicly deployed. See `research/notes.md` for derived source analysis and `docs/` for the product, architecture, opportunity score, reviews, and phased prompts.
