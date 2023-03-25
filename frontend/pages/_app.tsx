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
  optimism,
  arbitrumGoerli,
  optimismGoerli,
  zkSyncTestnet,
} from "wagmi/chains";
import { scrollTestnet, polygonZkTestnet } from "../utils/constants";
import { publicProvider } from "wagmi/providers/public";
import Layout from "../components/Layout";

// When going live / demo, let only networks where contracts were deployed
const { chains, provider, webSocketProvider } = configureChains(
  [optimismGoerli, optimism, arbitrumGoerli, scrollTestnet, polygonZkTestnet],
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
