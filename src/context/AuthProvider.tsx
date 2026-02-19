'use client';

import { createContext, useContext, useState, type ReactNode, useCallback } from 'react';
import type { User } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  walletAddress: string | null;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  isConnecting: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  walletAddress: null,
  isConnected: false,
  connect: async () => {},
  disconnect: () => {},
  isConnecting: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connect = useCallback(async () => {
    setIsConnecting(true);
    try {
      // Check for Phantom wallet (Solana wallet)
      const phantom = (window as any)?.solana;

      if (phantom?.isPhantom) {
        try {
          const resp = await phantom.connect();
          const addr = resp.publicKey.toString();
          setWalletAddress(addr);
          setUser({
            id: crypto.randomUUID(),
            wallet_address: addr,
            role: 'member',
            reputation_score: 0,
            created_at: new Date().toISOString(),
          });
        } catch (err) {
          console.error('Phantom wallet connection failed:', err);
          // Fall through to demo mode on error
          initializeDemoUser();
        }
      } else {
        // Demo mode for development (no wallet installed)
        initializeDemoUser();
      }
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const initializeDemoUser = () => {
    const demoAddr = 'EMET' + Math.random().toString(36).slice(2, 10) + 'Demo';
    setWalletAddress(demoAddr);
    setUser({
      id: crypto.randomUUID(),
      wallet_address: demoAddr,
      username: 'Demo User',
      role: 'member',
      reputation_score: 0,
      created_at: new Date().toISOString(),
    });
  };

  const disconnect = useCallback(() => {
    setUser(null);
    setWalletAddress(null);

    // Disconnect Phantom if available
    const phantom = (window as any)?.solana;
    if (phantom?.isPhantom) {
      phantom.disconnect().catch((err: Error) => console.error('Disconnect error:', err));
    }
  }, []);

  const value: AuthContextType = {
    user,
    walletAddress,
    isConnected: !!user,
    connect,
    disconnect,
    isConnecting,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
