# WikiTruth Frontend

Production-ready React + TypeScript + Tailwind frontend plus GenLayer intelligent contract for WikiTruth.

## Requirements

- Node.js 20+
- A wallet extension (MetaMask or compatible)
- Access to GenLayer Studio

## Environment

Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

Variables:

- `VITE_CHAIN_ID=61999`
- `VITE_RPC_URL=http://127.0.0.1:4000/api`
- `VITE_CONTRACT_ADDRESS=0xeAFcc1935681a471C8E9d5319A2Dd7580baa9fA4`

## Run locally

```bash
npm install
npm run dev
```

Open the shown localhost URL.

## Build

```bash
npm run build
npm run preview
```

## Contract

- Contract source: `contract/wiki_truth.py`
- Methods:
  - `verify_fact(page_title: str, expected_phrase: str) -> None`
  - `is_fact_true(page_title: str, expected_phrase: str) -> bool`

The contract also accepts a full Wikipedia URL for `page_title` and extracts the title automatically (for example `https://en.wikipedia.org/wiki/Aesthetics` -> `Aesthetics`).

## Contract Tests

```bash
pytest contract/tests/direct -v
```

Optional lint (if installed):

```bash
genvm-lint check contract/wiki_truth.py
```

## UX + Feature Coverage

- Wallet connect/disconnect
- GenLayer Studio network enforcement + switch attempt
- Verify flow: `verify_fact(page_title, expected_phrase)`
- Auto result read: `is_fact_true(page_title, expected_phrase)`
- Animated verification states with scan-line effect
- Edge-case handling (empty inputs, wrong network, duplicate submissions, timeout/errors)
- Last query persistence in `localStorage`
