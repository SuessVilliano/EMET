'use client'

import { useMemo, type ReactNode } from 'react'
import { useSearchParams } from 'next/navigation'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'
import { TipLinkWalletAdapter } from '@tiplink/wallet-adapter'
import { TipLinkWalletAutoConnectV2 } from '@tiplink/wallet-adapter-react-ui'
import { clusterApiUrl } from '@solana/web3.js'

import '@solana/wallet-adapter-react-ui/styles.css'

export function WalletProvider({ children }: { children: ReactNode }) {
  const network = (process.env.NEXT_PUBLIC_SOLANA_NETWORK as WalletAdapterNetwork) || WalletAdapterNetwork.Devnet
  const endpoint = useMemo(
    () => process.env.NEXT_PUBLIC_SOLANA_RPC_URL || clusterApiUrl(network),
    [network]
  )
  const searchParams = useSearchParams()

  const wallets = useMemo(() => [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
    ...(process.env.NEXT_PUBLIC_TIPLINK_CLIENT_ID
      ? [new TipLinkWalletAdapter({
          title: 'EMET',
          clientId: process.env.NEXT_PUBLIC_TIPLINK_CLIENT_ID,
          theme: 'dark',
        })]
      : []),
  ], [])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect>
        <TipLinkWalletAutoConnectV2 isReady query={searchParams}>
          <WalletModalProvider>
            {children}
          </WalletModalProvider>
        </TipLinkWalletAutoConnectV2>
      </SolanaWalletProvider>
    </ConnectionProvider>
  )
}
