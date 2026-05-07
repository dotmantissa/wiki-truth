type VerificationFormProps = {
  pageTitle: string;
  expectedPhrase: string;
  setPageTitle: (value: string) => void;
  setExpectedPhrase: (value: string) => void;
  onVerify: () => void;
  isDisabled: boolean;
  isBusy: boolean;
};

export function VerificationForm(props: VerificationFormProps) {
  const {
    pageTitle,
    expectedPhrase,
    setPageTitle,
    setExpectedPhrase,
    onVerify,
    isDisabled,
    isBusy
  } = props;

  return (
    <section className="rounded-2xl bg-white p-5 shadow-card dark:bg-slate-900">
      <div className="space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Wikipedia Page</span>
          <input
            value={pageTitle}
            onChange={(event) => setPageTitle(event.target.value)}
            placeholder="e.g. Albert Einstein"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Phrase To Verify</span>
          <input
            value={expectedPhrase}
            onChange={(event) => setExpectedPhrase(event.target.value)}
            placeholder="e.g. theory of relativity"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </label>

        <button
          type="button"
          onClick={onVerify}
          disabled={isDisabled}
          className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isBusy ? 'Verifying...' : 'Verify Fact'}
        </button>
      </div>
    </section>
  );
}
