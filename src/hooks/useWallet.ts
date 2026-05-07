import { BrowserProvider } from 'ethers';
import { useCallback, useEffect, useRef, useState } from 'react';
import { CHAIN_ID, CHAIN_ID_HEX, NETWORK_NAME, RPC_URL } from '../lib/constants';

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, handler: (...args: unknown[]) => void) => void;
      removeListener: (event: string, handler: (...args: unknown[]) => void) => void;
    };
  }
}
type WalletError = { code?: number; message?: string };

export function useWallet() {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [walletError, setWalletError] = useState<string>('');
  const [isSwitching, setIsSwitching] = useState(false);

  const chainListenerRef = useRef<((...args: unknown[]) => void) | null>(null);
  const accountListenerRef = useRef<((...args: unknown[]) => void) | null>(null);

  const isConnected = Boolean(address);
  const wrongNetwork = chainId !== null && chainId !== CHAIN_ID;

  const clearError = useCallback(() => setWalletError(''), []);

  const removeListeners = useCallback(() => {
    if (!window.ethereum) return;
    if (chainListenerRef.current) {
      window.ethereum.removeListener('chainChanged', chainListenerRef.current);
      chainListenerRef.current = null;
    }
    if (accountListenerRef.current) {
      window.ethereum.removeListener('accountsChanged', accountListenerRef.current);
      accountListenerRef.current = null;
    }
  }, []);

  const disconnect = useCallback(() => {
    removeListeners();
    setProvider(null);
    setAddress(null);
    setChainId(null);
    setWalletError('');
  }, [removeListeners]);

  const ensureGenLayerStudio = useCallback(async () => {
    if (!window.ethereum) throw new Error('No wallet detected. Install MetaMask or compatible wallet.');

    const chainHex = (await window.ethereum.request({ method: 'eth_chainId' })) as string;
    if (parseInt(chainHex, 16) === CHAIN_ID) return;

    try {
      setIsSwitching(true);
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: CHAIN_ID_HEX }]
      });
    } catch (switchError: unknown) {
      const knownError = switchError as WalletError;
      if (knownError?.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: CHAIN_ID_HEX,
              chainName: NETWORK_NAME,
              nativeCurrency: { name: 'GEN', symbol: 'GEN', decimals: 18 },
              rpcUrls: [RPC_URL]
            }
          ]
        });
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: CHAIN_ID_HEX }]
        });
      } else {
        throw switchError;
      }
    } finally {
      setIsSwitching(false);
    }
  }, []);

  const connect = useCallback(async () => {
    clearError();

    if (!window.ethereum) {
      setWalletError('No wallet detected. Install MetaMask or a wallet that supports EVM networks.');
      return;
    }

    try {
      const accounts = (await window.ethereum.request({ method: 'eth_requestAccounts' })) as string[];
      if (!accounts?.length) throw new Error('No wallet account available.');

      await ensureGenLayerStudio();

      const nextProvider = new BrowserProvider(window.ethereum);
      const network = await nextProvider.getNetwork();
      const nextChainId = Number(network.chainId);

      setProvider(nextProvider);
      setAddress(accounts[0]);
      setChainId(nextChainId);

      const onChainChanged = (...args: unknown[]) => {
        const nextChainHex = typeof args[0] === 'string' ? args[0] : '0x0';
        setChainId(parseInt(nextChainHex, 16));
      };

      const onAccountsChanged = (...args: unknown[]) => {
        const nextAccounts = Array.isArray(args[0]) ? (args[0] as string[]) : [];
        if (!nextAccounts.length) {
          disconnect();
          return;
        }
        setAddress(nextAccounts[0]);
      };

      removeListeners();
      chainListenerRef.current = onChainChanged;
      accountListenerRef.current = onAccountsChanged;
      window.ethereum.on('chainChanged', onChainChanged);
      window.ethereum.on('accountsChanged', onAccountsChanged);
    } catch (error: unknown) {
      const knownError = error as WalletError;
      if (knownError?.code === 4001) {
        setWalletError('Wallet request rejected.');
      } else {
        setWalletError(
          knownError?.message ||
            'Unable to connect wallet. Switch to GenLayer Studio and try again.'
        );
      }
    }
  }, [clearError, disconnect, ensureGenLayerStudio, removeListeners]);

  const switchNetwork = useCallback(async () => {
    try {
      clearError();
      await ensureGenLayerStudio();
      if (window.ethereum) {
        const nextChainHex = (await window.ethereum.request({ method: 'eth_chainId' })) as string;
        setChainId(parseInt(nextChainHex, 16));
      }
    } catch {
      setWalletError(
        'Switch failed. In your wallet, manually select network ID 61999 (GenLayer Studio RPC: http://127.0.0.1:4000/api).'
      );
    }
  }, [clearError, ensureGenLayerStudio]);

  useEffect(() => {
    return () => removeListeners();
  }, [removeListeners]);

  return {
    provider,
    address,
    chainId,
    isConnected,
    wrongNetwork,
    walletError,
    isSwitching,
    connect,
    disconnect,
    switchNetwork,
    clearError
  };
}
