import { Chain } from "wagmi";

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

export const EIP712Domain = [
  { name: "name", type: "string" },
  { name: "version", type: "string" },
  { name: "chainId", type: "uint256" },
  { name: "verifyingContract", type: "address" },
];

export const ForwardRequest = [
  { name: "from", type: "address" },
  { name: "to", type: "address" },
  { name: "value", type: "uint256" },
  { name: "gas", type: "uint256" },
  { name: "nonce", type: "uint256" },
  { name: "data", type: "bytes" },
];
