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
- **npm** (for managing dependencies)
- **Solidity**
- **Hardhat** for smart contract development
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

#### Basic Tokens

**MyToken**
The MToken.sol contract implements fundamental token functionalities, including transferring tokens, approving allowances, and transferring on behalf of others using allowances. It sets an initial supply of 1 million tokens assigned to the deployer and includes events for transparency. The code is structured with clear validations and safeguards for common token operations.

**MyTokenFac**
The MyTokenFac.sol is an ERC20-like factory contract that allows the creation of tokens with customizable properties (name, symbol, decimals, and total supply). The constructor assigns the initial supply to the deployer's balance. It includes essential ERC20 functionalities like token transfers, approval for spending, and transferring tokens on behalf of others.

You could customise the token properties in the tokenInfo.json file located in scripts\deployement\ERC20\basicToken\tokenInfo.json .

**ZeroToken**
The ZeroToken contract is an ERC20-compliant implementation that supports minting and burning of tokens. It includes an ownership model, where only the owner can mint new tokens. The contract also adheres to the IERC20 interface, ensuring compatibility with ERC20 tools and standards. Key functionalities include standard ERC20 transfers, allowance-based token spending, and the ability to burn tokens from the caller or another account with an approved allowance.

**Comparison with Other Token Implementations**

Below is a feature comparison between `ZeroToken`, `MyToken`, and `MyTokenFac`:

![Comparison Table](./Documentation\ERC20_features.PNG)

## Deployment

You could configure the defaultNetwork in the hardhat.config.js file, and set it to the network you want to use (By Default it's in the localhost netwok, and could choose between localhost, Ganache and sepolia) .
Then depending on the defaultNetwork run the deployement command :

```
npm run deploy:MyToken
```

or

```
npm run deploy:MyTokenFac
```

or

```
npm run deploy:ZeroToken
```

Else if you are navigating between different networks, you could run those commands for deployement without the need to reset the defaultNetwork each time you switch the network .

#### LocalHost network

To deploy the smart contracts on the local hardhat network

1. start the hardhat node in a separate terminal

```
npx hardhat node
```

2. run the deployement command :

```
npm run deploy-localhost:MyToken
```

or

```
npm run deploy-localhost:MyTokenFac
```

or

```
npm run deploy-localhost:ZeroToken
```

#### Ganache (Local Network)

To deploy the smart contracts on a local Ganache blockchain:

Start Ganache:

```
ganache-cli
```

Or just open the ganache app and log to the configured workspace .
Deploy the contracts:
**MyToken.sol**

```
npm run deploy-ganache:MyToken
```

**MyTokenFac.sol**

```
npm run deploy-ganache:MyTokenFac
```

**ZeroToken.sol**

```
npm run deploy-ganache:ZeroToken
```

#### Sepolia (Testnet)

To deploy on Sepolia testnet, make sure you have:

- Sepolia ETH (you can get it from a faucet).
- Your wallet's private key.
- An Infura or Alchemy API key for connecting to Sepolia.
  Update .env with your Sepolia credentials:

* SEPOLIA_PRIVATE_KEY= "your-private-key"
* INFURA_API_KEY= "your-infura-api-key"

Deploy to Sepolia:

**MyToken.sol**

```
npm run deploy-sepolia:MyToken
```

**MyTokenFac.sol**

```
npm run deploy-sepolia:MyTokenFac
```

**ZeroToken.sol**

```
npm run deploy-sepolia:ZeroToken
```

## Interacting with the Contracts

After deployment, you can interact with the smart contracts using:

- **Hardhat console**:

  ```
  npx hardhat console --network localhost
  ```

- **Ethers.js** for JavaScript-based interaction.

- **Metamask** for interacting with the contracts on the Ethereum network.
