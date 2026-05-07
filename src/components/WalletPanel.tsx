import { CHAIN_ID, NETWORK_NAME } from '../lib/constants';

type WalletPanelProps = {
  address: string | null;
  isConnected: boolean;
  wrongNetwork: boolean;
  chainId: number | null;
  walletError: string;
  isSwitching: boolean;
  onConnect: () => Promise<void>;
  onDisconnect: () => void;
  onSwitchNetwork: () => Promise<void>;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
};

function shortAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function WalletPanel(props: WalletPanelProps) {
  const {
    address,
    isConnected,
    wrongNetwork,
    chainId,
    walletError,
    isSwitching,
    onConnect,
    onDisconnect,
    onSwitchNetwork,
    isDarkMode,
    onToggleDarkMode
  } = props;

  return (
    <header className="rounded-2xl bg-white/90 p-4 shadow-soft backdrop-blur-sm dark:bg-slate-900/90">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">WikiTruth</p>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Wikipedia Fact Checker</h1>
        </div>

        {!isConnected ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleDarkMode}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              {isDarkMode ? 'Light' : 'Dark'}
            </button>
            <button
              type="button"
              onClick={onConnect}
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:scale-[1.01] hover:bg-slate-800 active:scale-[0.98] dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              Connect Wallet
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onToggleDarkMode}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              {isDarkMode ? 'Light' : 'Dark'}
            </button>
            <span className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              {address ? shortAddress(address) : ''}
            </span>
            <button
              type="button"
              onClick={onDisconnect}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              Disconnect
            </button>
            {!wrongNetwork && chainId === CHAIN_ID ? (
              <span className="rounded-xl bg-emerald-100 px-3 py-2 text-sm font-medium text-emerald-700">
                {NETWORK_NAME} · #{CHAIN_ID}
              </span>
            ) : (
              <button
                type="button"
                onClick={onSwitchNetwork}
                className="rounded-xl bg-amber-100 px-3 py-2 text-sm font-medium text-amber-800 transition hover:bg-amber-200"
              >
                {isSwitching ? 'Switching...' : `Switch to ${NETWORK_NAME}`}
              </button>
            )}
          </div>
        )}
      </div>

      {walletError ? <p className="mt-3 text-sm text-red-600">{walletError}</p> : null}
    </header>
  );
}
