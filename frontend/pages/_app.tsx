import "@rainbow-me/rainbowkit/styles.css";
import "../styles/globals.css";
import {
  getDefaultWallets,
  RainbowKitProvider,
  midnightTheme,
} from "@rainbow-me/rainbowkit";
import type { AppProps } from "next/app";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import {
  arbitrum,
  goerli,
  mainnet,
  optimism,
  arbitrumGoerli,
  optimismGoerli,
  zkSyncTestnet,
} from "wagmi/chains";
import { scrollTestnet, polygonZkTestnet } from "../utils/utils"
import { publicProvider } from "wagmi/providers/public";
import Layout from "../components/Layout";

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
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true" ? [goerli] : []),

  ],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "Universum",
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
      <RainbowKitProvider chains={chains} theme={midnightTheme()}>
        <Layout>
        <Component {...pageProps} />
        </Layout>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
