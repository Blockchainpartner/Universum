import {
  OPTIMISTIC_GOERLI_ENS_ADDRESS,
  ARBITRUM_GOERLI_ENS_ADDRESS,
  SCROLL_ENS_ADDRESS,
  POLYGONZK_ENS_ADDRESS,
} from "../service/contractAddresses";

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
