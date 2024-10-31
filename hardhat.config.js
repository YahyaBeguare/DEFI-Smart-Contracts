require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
//require("./tasks/rsa.test");

SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL; 
WALLET_PRIVATE_KEY = process.env.PRIVATE_KEY; 
GANACHE_ACCOUNT = process.env.GANACHE_WALLET_PRIVATE_KEY;
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
  // this line sets the default network to use when running tasks or scripts 
   defaultNetwork: "ganache",
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
