require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("hardhat-gas-reporter");

SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;
WALLET_PRIVATE_KEY = process.env.PRIVATE_KEY;
GANACHE_ACCOUNT = process.env.GANACHE_WALLET_PRIVATE_KEY;
COINMARKETCAP= process.env.COINMARKETCAP_API_KEY;
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.21",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  gasReporter: {
    enabled: true,           
    currency: "USD",           // Currency in which to report costs
    coinmarketcap: COINMARKETCAP,  
    outputFile: "gas-report.txt",  // (Optional) File to save the report
    noColors: false, 
    // gasPrice: 20, 
   offline: true,           
  },
  // this line sets the default network to use when running tasks or scripts
  defaultNetwork: "localhost",
  networks: {
    hardhat: {
      _name: "localhost",
      chainId: 1337,
    },
    sepolia: {
      url: `${SEPOLIA_RPC_URL}`,
      accounts: [WALLET_PRIVATE_KEY],
    },
    ganache: {
      url: "http://127.0.0.1:7545",
      chainId: 1337,
      accounts: [GANACHE_ACCOUNT],
    },
  },
};
