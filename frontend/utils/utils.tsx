import {
  OPTIMISTIC_GOERLI_ENS_ADDRESS,
  ARBITRUM_GOERLI_ENS_ADDRESS,
  SCROLL_ENS_ADDRESS,
  POLYGONZK_ENS_ADDRESS,
  OPTIMISTIC_GOERLI_MINIMAL_FORWARDER,
  ARBITRUM_GOERLI_MINIMAL_FORWARDER,
  SCROLL_MINIMAL_FORWARDER,
  POLYGONZK_MINIMAL_FORWARDER,
  OPTIMISTIC_GOERLI_REGISTRAR_ADDRESS,
  ARBITRUM_GOERLI_REGISTRAR_ADDRESS,
  SCROLL_REGISTRAR_ADDRESS,
  POLYGONZK_REGISTRAR_ADDRESS,
} from "./contractAddresses";

export const getContractAddress = (chain: any) => {
  switch (chain?.network) {
    case "optimism-goerli":
      return OPTIMISTIC_GOERLI_ENS_ADDRESS;
    case "arbitrum-goerli":
      return ARBITRUM_GOERLI_ENS_ADDRESS;
    case "scroll-testnet":
      return SCROLL_ENS_ADDRESS;
    case "polygon-zkevm-testnet":
      return POLYGONZK_ENS_ADDRESS;
    default:
      break;
  }
};
export const getContractAddressForwarder = (chain: any) => {
  switch (chain.network) {
    case "optimism-goerli":
      return OPTIMISTIC_GOERLI_MINIMAL_FORWARDER;
      break;
    case "arbitrum-goerli":
      return ARBITRUM_GOERLI_MINIMAL_FORWARDER;
      break;
    case "scroll-testnet":
      return SCROLL_MINIMAL_FORWARDER;
      break;
    case "polygon-zkevm-testnet":
      return POLYGONZK_MINIMAL_FORWARDER;
      break;
    default:
      // code block
      return "";
  }
};

export const getContractAddressRegistrar = (chain: any) => {
  switch (chain.network) {
    case "optimism-goerli":
      return OPTIMISTIC_GOERLI_REGISTRAR_ADDRESS;
      break;
    case "arbitrum-goerli":
      return ARBITRUM_GOERLI_REGISTRAR_ADDRESS;
      break;
    case "scroll-testnet":
      return SCROLL_REGISTRAR_ADDRESS;
      break;
    case "polygon-zkevm-testnet":
      return POLYGONZK_REGISTRAR_ADDRESS;
      break;
    default:
      // code block
      return "";
  }
};
