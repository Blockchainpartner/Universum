/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
};
require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    goerli: {
      url: process.env.RPC_GOERLI_APIKEY,
      accounts: [process.env.PRIVATE_KEY],
    }, 
    optimisticGoerli: {
      url: process.env.RPC_OPTIMISTIC_GOERLI_APIKEY,
      accounts: [process.env.PRIVATE_KEY],
    }
  },
  mocha: {},
  etherscan: {
    apiKey: {
      goerli: process.env.ETHERSCAN_APIKEY,
      optimisticGoerli: process.env.OPTIMISMSCAN_APIKEY,
    }
  }
};