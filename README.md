
# DeFi Protocols - Smart Contract Development and Deployment

## Overview

This repository contains implementations of various DeFi protocols using the Ethereum blockchain. It includes smart contracts for **ERC20**, **ERC721**, and **ERC1155** tokens, along with examples for deploying and interacting with these contracts on Ethereum and other EVM-compatible networks. Additionally, the repository provides best practices for securing, testing, and deploying these smart contracts.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Smart Contracts](#smart-contracts)
    - [ERC20](#erc20)
4. [Deployment](#deployment)
5. [Interacting with the Contracts](#interacting-with-the-contracts)


## Prerequisites

Before getting started, ensure you have the following installed:

- **Node.js** (version 18.6.0 or later)
- **npm**  (for managing dependencies)
- **Solidity** 
- **Hardhat**  for smart contract development
- **Metamask** (for interacting with deployed contracts)
- **Infura** or **Alchemy** API keys for connecting to Ethereum nodes

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/defi-protocols.git
   cd defi-protocols
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Compile the smart contracts:
   ```
   npx hardhat compile
  
   ```

## Smart Contracts

### ERC20

The ERC20 contract defines a standard for fungible tokens. It's commonly used for creating utility tokens, governance tokens, or stablecoins in the DeFi ecosystem.

**Features:**
- Mintable
- Burnable
- Transferable

Example Usage:
```solidity
function transfer(address recipient, uint256 amount) public returns (bool);
```

For detailed documentation, see [ERC20.md](docs/ERC20.md).


## Deployment


#### Ganache (Local Network)
To deploy the smart contracts on a local Ganache blockchain:

Start Ganache:

```
ganache-cli
```

Deploy the contracts:

```
npx hardhat run scripts/deploy.js --network ganache
```

#### Sepolia (Testnet)
To deploy on Sepolia testnet, make sure you have:

+ Sepolia ETH (you can get it from a faucet).
+ Your wallet's private key.
+ An Infura or Alchemy API key for connecting to Sepolia.
Update .env with your Sepolia credentials:

- SEPOLIA_PRIVATE_KEY=<your-private-key>
- INFURA_API_KEY=<your-infura-api-key>

Deploy to Sepolia:

```
npx hardhat run scripts/deploy.js --network sepolia
```
## Interacting with the Contracts

After deployment, you can interact with the smart contracts using:

- **Hardhat console**:
  ```
  npx hardhat console --network localhost
  ```

-  **Ethers.js** for JavaScript-based interaction.

- **Metamask** for interacting with the contracts on the Ethereum network.



