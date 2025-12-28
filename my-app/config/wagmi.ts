import { http, createConfig, cookieStorage, createStorage } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

export const config = createConfig({
  chains: [mainnet, sepolia],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),

  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },

  connectors: [
    injected(), 
  ],
})