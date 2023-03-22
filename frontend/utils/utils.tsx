import {
  OPTIMISTIC_GOERLI_ENS_ADDRESS,
  ARBITRUM_GOERLI_ENS_ADDRESS,
  SCROLL_ENS_ADDRESS,
  POLYGONZK_ENS_ADDRESS,
} from "../service/contractAddresses";
import { Chain } from "wagmi";

export function getContractAddress(chain: any) {
  switch (chain?.network) {
    case "optimism-goerli":
      return OPTIMISTIC_GOERLI_ENS_ADDRESS;
      break;
    case "arbitrum-goerli":
      return ARBITRUM_GOERLI_ENS_ADDRESS;
      break;
    case "scroll-testnet":
      return SCROLL_ENS_ADDRESS;
      break;
    case "polygon-zkevm-testnet":
      return POLYGONZK_ENS_ADDRESS;
      break;
    default:
    // code block
  }
}

export const scrollTestnet: Chain = {
    id: 534353,
    name: "Scroll Testnet",
    network: "scroll-testnet",
    nativeCurrency: {
      decimals: 18,
      name: "Ether",
      symbol: "ETH",
    },
    rpcUrls: {
      public: { http: ["https://alpha-rpc.scroll.io/l2"] },
      default: { http: ["https://alpha-rpc.scroll.io/l2"] },
    },
    blockExplorers: {
      default: { name: "ScrollExplorer", url: "https://blockscout.scroll.io" },
    },
  };
  
  export const polygonZkTestnet: Chain = {
    id: 1442,
    name: "Polygon ZkEVM Testnet",
    network: "polygon-zkevm-testnet",
    nativeCurrency: {
      decimals: 18,
      name: "Ether",
      symbol: "ETH",
    },
    rpcUrls: {
      public: { http: ["https://rpc.public.zkevm-test.net"] },
      default: { http: ["https://rpc.public.zkevm-test.net"] },
    },
    blockExplorers: {
      default: {
        name: "Polygon ZkEVM Explorer",
        url: " https://testnet-zkevm.polygonscan.com",
      },
  
    },
  };
