import '@rainbow-me/rainbowkit/styles.css';
import '../styles/globals.css';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import type { AppProps } from 'next/app';
import { configureChains, createClient, WagmiConfig, Chain } from 'wagmi';
import { arbitrum, goerli, mainnet, optimism, arbitrumGoerli, optimismGoerli, zkSyncTestnet } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import Layout from '../components/Layout'

export const scrollTestnet:Chain = {
  id: 534353,
  name: 'Scroll Testnet',
  network: 'scroll-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    public: { http: ['https://alpha-rpc.scroll.io/l2'] },
    default: { http: ['https://alpha-rpc.scroll.io/l2'] },
  },
  blockExplorers: {
    default: { name: 'ScrollExplorer', url: 'https://blockscout.scroll.io' },
  },
};

export const polygonZkTestnet:Chain = {
  id: 1442,
  name: 'Polygon ZkEVM Testnet',
  network: 'polygon-zkevm-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    public: { http: ['https://rpc.public.zkevm-test.net'] },
    default: { http: ['https://rpc.public.zkevm-test.net'] },
  },
  blockExplorers: {
    default: { name: 'Polygon ZkEVM Explorer', url: ' https://testnet-zkevm.polygonscan.com' },
  },
};

const { chains, provider, webSocketProvider } = configureChains(
  [
    mainnet,
    goerli,
    optimism,
    arbitrum,
    arbitrumGoerli,
    optimismGoerli,
    zkSyncTestnet,
    scrollTestnet,
    polygonZkTestnet,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [goerli] : []),
  ],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'RainbowKit App',
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <Layout>
        <Component {...pageProps} />
        </Layout>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
