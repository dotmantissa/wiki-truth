import { createClient } from 'genlayer-js';
import { studionet } from 'genlayer-js/chains';
import { ExecutionResult, TransactionStatus } from 'genlayer-js/types';
import {
  CONTRACT_ADDRESS,
  TX_POLL_INTERVAL,
  TX_POLL_RETRIES
} from './constants';

export type VerifyFactPayload = {
  pageTitle: string;
  expectedPhrase: string;
};

export function buildGenLayerClient(account: string) {
  return createClient({
    chain: studionet,
    account: account as `0x${string}`
  });
}

export async function callVerifyFact(
  account: string,
  payload: VerifyFactPayload,
  onStatus?: (message: string) => void
): Promise<string> {
  const client = buildGenLayerClient(account);

  onStatus?.('Submitting verification transaction...');
  const hash = await client.writeContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    functionName: 'verify_fact',
    args: [payload.pageTitle, payload.expectedPhrase],
    value: BigInt(0)
  });

  onStatus?.('Waiting for GenLayer consensus...');
  const receipt = await client.waitForTransactionReceipt({
    hash,
    status: TransactionStatus.FINALIZED,
    retries: TX_POLL_RETRIES,
    interval: TX_POLL_INTERVAL
  });

  if (!receipt) {
    throw new Error('Verification timed out before finalization. Try again.');
  }
  if (receipt.txExecutionResultName === ExecutionResult.FINISHED_WITH_ERROR) {
    throw new Error('Verification transaction finalized but contract execution failed.');
  }

  return hash;
}

export async function callIsFactTrue(account: string, payload: VerifyFactPayload): Promise<boolean> {
  const client = buildGenLayerClient(account);
  const result = await client.readContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    functionName: 'is_fact_true',
    args: [payload.pageTitle, payload.expectedPhrase]
  });

  return Boolean(result);
}
