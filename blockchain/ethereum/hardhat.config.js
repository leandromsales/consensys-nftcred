require('dotenv').config()
require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ethers");

task(
  "blockNumber",
  "Prints the current block number",
  async (_, { ethers }) => {
    const blockNumber = await ethers.provider.getBlockNumber();
    console.log("Current block number: " + blockNumber);
  }
);

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      // forking: {
      //   url: process.env.MAINNET_URL
      // }
    },
    linea: {
      url: process.env.API_URL,
      chainId: 59140,
      // network_id: 5,
      gas: 6000000,
      loggingEnabled: true,
      // accounts: [process.env.PRIVATE_KEY]
      // chainId?: number;
      // from?: string;
      // gas?: "auto" | number;
      // gasPrice?: "auto" | number;
      // gasMultiplier?: number;
      // timeout?: number;
      // httpHeaders?: { [name: string]: string };
      // hardfork?: string;
      // mining?: HardhatNetworkMiningUserConfig;
      // blockGasLimit?: number;
      // minGasPrice?: number | string;
      // throwOnTransactionFailures?: boolean;
      // throwOnCallFailures?: boolean;
      // allowUnlimitedContractSize?: boolean;
      // allowBlocksWithSameTimestamp?: boolean;
      // initialDate?: string;
      // forking?: HardhatNetworkForkingUserConfig;
      // coinbase?: string;
      // chains?: HardhatNetworkChainsUserConfig;
      // enableTransientStorage?: boolean;
    },
  }
};
