'use client'

import { createContext, useContext, useMemo, type ReactNode, useCallback } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import type { User } from '@/lib/types'

interface AuthContextType {
  user: User | null
  walletAddress: string | null
  isConnected: boolean
  connect: () => Promise<void>
  disconnect: () => void
  isConnecting: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  walletAddress: null,
  isConnected: false,
  connect: async () => {},
  disconnect: () => {},
  isConnecting: false,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const { publicKey, connected, disconnect: walletDisconnect, connecting } = useWallet()
  const { setVisible } = useWalletModal()
  const walletAddress = publicKey?.toBase58() || null

  const user = useMemo<User | null>(() => {
    if (!connected || !walletAddress) return null
    return {
      id: `wallet:${walletAddress}`,
      wallet_address: walletAddress,
      role: 'member',
      reputation_score: 0,
      created_at: '',
    }
  }, [connected, walletAddress])

  const connect = useCallback(async () => {
    setVisible(true)
  }, [setVisible])

  const disconnect = useCallback(() => {
    void walletDisconnect()
  }, [walletDisconnect])

  return (
    <AuthContext.Provider
      value={{
        user,
        walletAddress,
        isConnected: connected && !!publicKey,
        connect,
        disconnect,
        isConnecting: connecting,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
