require('dotenv').config()

var HDWalletProvider = require("truffle-hdwallet-provider");
const MNEMONIC = process.env.PRIVATE_KEY

module.exports = {
  /**
   * Networks define how you connect to your ethereum client and let you set the
   * defaults web3 uses to send transactions. If you don't specify one truffle
   * will spin up a development blockchain for you on port 9545 when you
   * run `develop` or `test`. You can ask a truffle command to use a specific
   * network from the command line, e.g
   *
   * $ truffle test --network <network-name>
   */
  plugins: ["truffle-contract-size"],
  networks: {
    development: {
     host: "127.0.0.1",     // Localhost (default: none)
     port: 7545,            // Standard Ethereum port (default: none)
     network_id: "5777",       // Any network (default: none)
    },
    goerli: {
      provider: function() {
        return new HDWalletProvider(MNEMONIC, process.env.API_URL)
      },
      network_id: 5,
      gas: 6000000
    },
    live: {
      networkCheckTimeout: 10000, 
      provider: function() {
        return new HDWalletProvider(MNEMONIC, process.env.API_URL)
      },
      network_id: 1
    }
  },

  // Set default mocha options here, use special reporters etc.
	// https://github.com/cgewecke/eth-gas-reporter
  mocha: {
    // timeout: 100000
		reporter: 'eth-gas-reporter',
    reporterOptions: {
			currency: "USD"
		}
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.20",      // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      settings: {          // See the solidity docs for advice about optimization and evmVersion
        optimizer: {
          enabled: false,
          runs: 200
        },
        evmVersion: "paris"
       }
    }
  },
};
