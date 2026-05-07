import { useMemo, useRef, useState } from 'react';
import { callIsFactTrue, callVerifyFact, type VerifyFactPayload } from '../lib/genlayerClient';
import { getWikipediaPhraseHint } from '../lib/wikipedia';

export type VerificationState = 'idle' | 'verifying' | 'success' | 'error';

export type VerificationResult = VerifyFactPayload & {
  isTrue: boolean;
  txHash: string;
  verifiedAt: string;
  hint?: string | null;
};

const READ_RETRY_DELAY_MS = 3500;
const MAX_READ_RETRIES = 12;

function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function useWikiTruth() {
  const [state, setState] = useState<VerificationState>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [result, setResult] = useState<VerificationResult | null>(null);

  const activeRequestRef = useRef<string>('');

  const verify = async (account: string, payload: VerifyFactPayload) => {
    const requestKey = `${payload.pageTitle}::${payload.expectedPhrase}`.toLowerCase();
    if (state === 'verifying' || activeRequestRef.current === requestKey) return;

    activeRequestRef.current = requestKey;
    setState('verifying');
    setError('');

    try {
      setStatusMessage('Scanning Wikipedia...');
      const txHash = await callVerifyFact(account, payload, (sdkMessage) => {
        if (sdkMessage.toLowerCase().includes('waiting')) {
          setStatusMessage('Analyzing content...');
        } else {
          setStatusMessage(sdkMessage);
        }
      });

      setStatusMessage('Checking truth result...');
      let isTrue = false;
      for (let attempt = 0; attempt < MAX_READ_RETRIES; attempt += 1) {
        isTrue = await callIsFactTrue(account, payload);
        if (isTrue) break;

        if (attempt < MAX_READ_RETRIES - 1) {
          setStatusMessage(
            `Finalizing truth state... (${attempt + 1}/${MAX_READ_RETRIES})`
          );
          await wait(READ_RETRY_DELAY_MS);
        }
      }
      const hint = isTrue ? null : await getWikipediaPhraseHint(payload.pageTitle, payload.expectedPhrase);

      setResult({
        ...payload,
        txHash,
        isTrue,
        verifiedAt: new Date().toISOString(),
        hint
      });
      setState('success');
      setStatusMessage(isTrue ? 'Fact verified' : 'Not found on Wikipedia');
    } catch (err: unknown) {
      const knownError = err as { message?: string };
      setState('error');
      setError(knownError?.message || 'Verification failed.');
    } finally {
      activeRequestRef.current = '';
    }
  };

  const resetError = () => setError('');

  const isBusy = useMemo(() => state === 'verifying', [state]);

  return {
    state,
    statusMessage,
    error,
    result,
    isBusy,
    verify,
    resetError
  };
}
