/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
};
require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  zksolc: {
    version: "1.3.1",
    compilerSource: "binary",
    settings: {},
  },
  networks: {
    goerli: {
      url: process.env.RPC_GOERLI_APIKEY,
      accounts: [process.env.PRIVATE_KEY],
    }, 
    optimisticGoerli: {
      url: process.env.RPC_OPTIMISTIC_GOERLI_APIKEY,
      accounts: [process.env.PRIVATE_KEY],
    },
    arbitrumGoerli: {
      url: process.env.RPC_ARBITRUM_GOERLI_APIKEY,
      accounts: [process.env.PRIVATE_KEY],
    },
    zkSyncTestnet: {
      url: process.env.RPC_ZKSYNC_TESTNET_APIKEY,
      ethNetwork: process.env.RPC_GOERLI_APIKEY,
      accounts: [process.env.PRIVATE_KEY],
      zksync: true,
    },
    scrollTestnet: {
      url: process.env.SCROLL_TESTNET_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
    polygonZkTestnet: {
      url: process.env.POLYGONZK_TESTNET_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  mocha: {},
  etherscan: {
    apiKey: {
      goerli: process.env.ETHERSCAN_APIKEY,
      optimisticGoerli: process.env.OPTIMISMSCAN_APIKEY,
    }
  }
};