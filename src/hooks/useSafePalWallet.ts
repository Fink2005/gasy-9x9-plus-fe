// hooks/useSafePalWallet.ts
import { Buffer } from 'node:buffer';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

interface WalletData {
  address: string;
  signature: string;
  message: string;
}

interface SafePalProvider {
  isSafePal: boolean;
  connect: () => Promise<{ publicKey: { toString: () => string } }>;
  disconnect: () => Promise<void>;
  signMessage: (message: Uint8Array, display: string) => Promise<Uint8Array>;
}

declare global {
  interface Window {
    solana?: SafePalProvider;
  }
}

export function useSafePalWallet() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletData, setWalletData] = useState<WalletData | null>(null);

  const connect = useCallback(async () => {
    setIsConnecting(true);
    try {
      const provider = window.solana;

      if (!provider || !provider.isSafePal) {
        window.open('https://www.safepal.com/download?product=2');
        throw new Error('SafePal wallet not installed');
      }

      // Connect and get public key
      const response = await provider.connect();
      const address = response.publicKey.toString();

      // Create message with timestamp for security
      const message = `Sign this message to authenticate with our app.\nTimestamp: ${Date.now()}\nNonce: ${Math.random().toString(36).substring(7)}`;
      const encodedMessage = new TextEncoder().encode(message);

      // Request signature
      const signatureArray = await provider.signMessage(encodedMessage, 'utf8');
      const signature = Buffer.from(signatureArray).toString('base64');

      const data: WalletData = {
        address,
        signature,
        message
      };

      setWalletData(data);
      toast.success('Wallet connected successfully!');

      return data;
    } catch (error: any) {
      console.error('Connection error:', error);

      if (error.code === 4001) {
        toast.error('User rejected the request');
      } else {
        toast.error('Failed to connect wallet. Please try again.');
      }
      throw error;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    try {
      const provider = window.solana;
      if (provider && provider.disconnect) {
        await provider.disconnect();
        setWalletData(null);
        toast.success('Wallet disconnected');
      }
    } catch (error) {
      console.error('Disconnect error:', error);
      toast.error('Failed to disconnect wallet');
    }
  }, []);

  return {
    connect,
    disconnect,
    isConnecting,
    walletData,
    isConnected: !!walletData,
    address: walletData?.address,
    signature: walletData?.signature
  };
}
