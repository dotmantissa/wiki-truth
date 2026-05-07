import type { VerificationState } from '../hooks/useWikiTruth';

type VerificationStatusProps = {
  state: VerificationState;
  message: string;
  error: string;
};

export function VerificationStatus({ state, message, error }: VerificationStatusProps) {
  if (state === 'idle') {
    return (
      <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
        Connect your wallet, enter a query, and verify whether a phrase exists on Wikipedia.
      </div>
    );
  }

  if (state === 'error') {
    return <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">{error}</div>;
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-blue-50 p-4 text-sm text-blue-700">
      {state === 'verifying' ? <span className="absolute inset-x-0 top-0 h-1 bg-blue-400/70 animate-scan" /> : null}
      {message}
    </div>
  );
}
