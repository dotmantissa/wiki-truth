export const CHAIN_ID = Number(import.meta.env.VITE_CHAIN_ID ?? 61999);
export const CHAIN_ID_HEX = '0xF22F';
export const NETWORK_NAME = 'GenLayer Studio';
export const RPC_URL = import.meta.env.VITE_RPC_URL ?? 'http://127.0.0.1:4000/api';
export const CONTRACT_ADDRESS =
  import.meta.env.VITE_CONTRACT_ADDRESS ?? '0xeAFcc1935681a471C8E9d5319A2Dd7580baa9fA4';

export const TX_POLL_INTERVAL = 3000;
export const TX_POLL_RETRIES = 240;

export const WIKI_TRUTH_ABI = [
  {
    name: 'verify_fact',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'page_title', type: 'string' },
      { name: 'expected_phrase', type: 'string' }
    ],
    outputs: []
  },
  {
    name: 'is_fact_true',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'page_title', type: 'string' },
      { name: 'expected_phrase', type: 'string' }
    ],
    outputs: [{ name: '', type: 'bool' }]
  }
] as const;

export const STORAGE_LAST_QUERY_KEY = 'wiki-truth:last-query';
