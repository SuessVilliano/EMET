'use client'

import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from 'react'
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
  const [user, setUser] = useState<User | null>(null)

  // Sync wallet connection state to user
  useEffect(() => {
    if (connected && publicKey) {
      const addr = publicKey.toBase58()
      setUser({
        id: crypto.randomUUID(),
        wallet_address: addr,
        role: 'member',
        reputation_score: 0,
        created_at: new Date().toISOString(),
      })
    } else if (!connected) {
      setUser(null)
    }
  }, [connected, publicKey])

  const connect = useCallback(async () => {
    setVisible(true)
  }, [setVisible])

  const disconnect = useCallback(() => {
    walletDisconnect()
    setUser(null)
  }, [walletDisconnect])

  const walletAddress = publicKey?.toBase58() || null

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

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
