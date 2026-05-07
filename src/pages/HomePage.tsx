import { useEffect, useMemo, useState } from 'react';
import { ResultCard } from '../components/ResultCard';
import { VerificationForm } from '../components/VerificationForm';
import { VerificationStatus } from '../components/VerificationStatus';
import { WalletPanel } from '../components/WalletPanel';
import { useWallet } from '../hooks/useWallet';
import { useWikiTruth } from '../hooks/useWikiTruth';
import { CHAIN_ID, STORAGE_LAST_QUERY_KEY, STORAGE_THEME_KEY } from '../lib/constants';

function getInitialQuery() {
  const saved = localStorage.getItem(STORAGE_LAST_QUERY_KEY);
  if (!saved) return { pageTitle: '', expectedPhrase: '' };
  try {
    const parsed = JSON.parse(saved) as { pageTitle?: string; expectedPhrase?: string };
    return {
      pageTitle: parsed.pageTitle ?? '',
      expectedPhrase: parsed.expectedPhrase ?? ''
    };
  } catch {
    localStorage.removeItem(STORAGE_LAST_QUERY_KEY);
    return { pageTitle: '', expectedPhrase: '' };
  }
}

export function HomePage() {
  const {
    address,
    isConnected,
    chainId,
    wrongNetwork,
    walletError,
    isSwitching,
    connect,
    disconnect,
    switchNetwork
  } = useWallet();

  const { state, statusMessage, error, result, isBusy, verify, resetError } = useWikiTruth();

  const [pageTitle, setPageTitle] = useState(() => getInitialQuery().pageTitle);
  const [expectedPhrase, setExpectedPhrase] = useState(() => getInitialQuery().expectedPhrase);
  const [formError, setFormError] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem(STORAGE_THEME_KEY) === 'dark');

  useEffect(() => {
    localStorage.setItem(STORAGE_LAST_QUERY_KEY, JSON.stringify({ pageTitle, expectedPhrase }));
  }, [pageTitle, expectedPhrase]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem(STORAGE_THEME_KEY, isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const isBlocked = useMemo(() => {
    return !isConnected || wrongNetwork || isBusy || !pageTitle.trim() || !expectedPhrase.trim();
  }, [isConnected, wrongNetwork, isBusy, pageTitle, expectedPhrase]);

  const handleVerify = async () => {
    setFormError('');
    resetError();

    if (!isConnected || !address) {
      setFormError('Connect your wallet to continue.');
      return;
    }

    if (chainId !== CHAIN_ID) {
      setFormError('Switch to GenLayer Studio to continue.');
      return;
    }

    const payload = {
      pageTitle: pageTitle.trim(),
      expectedPhrase: expectedPhrase.trim()
    };

    if (!payload.pageTitle || !payload.expectedPhrase) {
      setFormError('Both fields are required.');
      return;
    }

    await verify(address, payload);
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-5 px-4 py-8 sm:px-6">
      <WalletPanel
        address={address}
        isConnected={isConnected}
        wrongNetwork={wrongNetwork}
        chainId={chainId}
        walletError={walletError}
        isSwitching={isSwitching}
        onConnect={connect}
        onDisconnect={disconnect}
        onSwitchNetwork={switchNetwork}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
      />

      {isConnected && wrongNetwork ? (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-800 dark:border-amber-700 dark:bg-amber-900/40 dark:text-amber-200">
          <p className="font-medium">Switch to GenLayer Studio to continue.</p>
          <p className="text-sm">Network ID: 61999 | RPC: http://127.0.0.1:4000/api</p>
        </section>
      ) : null}

      <VerificationForm
        pageTitle={pageTitle}
        expectedPhrase={expectedPhrase}
        setPageTitle={setPageTitle}
        setExpectedPhrase={setExpectedPhrase}
        onVerify={handleVerify}
        isDisabled={isBlocked}
        isBusy={isBusy}
      />

      {formError ? (
        <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/40 dark:text-red-200">
          {formError}
        </p>
      ) : null}

      <VerificationStatus state={state} message={statusMessage} error={error} />

      <ResultCard result={result} />
    </div>
  );
}
