import type { VerificationResult } from '../hooks/useWikiTruth';

type ResultCardProps = {
  result: VerificationResult | null;
};

export function ResultCard({ result }: ResultCardProps) {
  if (!result) return null;

  const isTrue = result.isTrue;

  return (
    <section
      className={`rounded-2xl border p-5 shadow-card transition ${
        isTrue
          ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-900/30'
          : 'border-red-200 bg-red-50 dark:border-red-700 dark:bg-red-900/30'
      }`}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Verification Result</h2>
        <span
          className={`rounded-full px-3 py-1 text-sm font-semibold ${
            isTrue ? 'bg-emerald-200 text-emerald-800' : 'bg-red-200 text-red-800'
          }`}
        >
          {isTrue ? '✅ TRUE' : '❌ FALSE'}
        </span>
      </div>

      <dl className="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-200">
        <div>
          <dt className="font-medium">Page</dt>
          <dd>{result.pageTitle}</dd>
        </div>
        <div>
          <dt className="font-medium">Phrase</dt>
          <dd>{result.expectedPhrase}</dd>
        </div>
        <div>
          <dt className="font-medium">Feedback</dt>
          <dd>{isTrue ? 'Fact verified' : 'Not found on Wikipedia'}</dd>
        </div>
      </dl>

      {!isTrue && result.hint ? (
        <p className="mt-4 rounded-lg bg-amber-100 p-3 text-sm text-amber-900 dark:bg-amber-900/40 dark:text-amber-200">
          {result.hint}
        </p>
      ) : null}
    </section>
  );
}
