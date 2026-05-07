# WikiTruth Frontend

Production-ready React + TypeScript + Tailwind frontend for the WikiTruth GenLayer intelligent contract.

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

## UX + Feature Coverage

- Wallet connect/disconnect
- GenLayer Studio network enforcement + switch attempt
- Verify flow: `verify_fact(page_title, expected_phrase)`
- Auto result read: `is_fact_true(page_title, expected_phrase)`
- Animated verification states with scan-line effect
- Edge-case handling (empty inputs, wrong network, duplicate submissions, timeout/errors)
- Last query persistence in `localStorage`
