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
   git clone https://github.com/yahya-beg/DEFI-Smart-Contracts
   ```

   
   ```
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

The ERC-20 contract defines a standard for fungible tokens, widely used for utility tokens, governance tokens, and various other applications in the DeFi ecosystem

**Features:**

- Mintable
- Burnable
- Transferable



For detailed documentation, see [ERC20.md](docs/ERC20.md).

#### + Basic Tokens

**MyToken**

The MToken.sol contract implements fundamental token functionalities, including transferring tokens, approving allowances, and transferring on behalf of others using allowances. It sets an initial supply of 1 million tokens assigned to the deployer and includes events for transparency. The code is structured with clear validations and safeguards for common token operations.

**MyTokenFac**

The MyTokenFac.sol is an ERC20-like factory contract that allows the creation of tokens with customizable properties (name, symbol, decimals, and total supply). The constructor assigns the initial supply to the deployer's balance. It includes essential ERC20 functionalities like token transfers, approval for spending, and transferring tokens on behalf of others.

You could customise the token properties in the tokenInfo.json file located in scripts\deployement\ERC20\basicToken\tokenInfo.json .

**TokensFactory**

The TokensFactory contract is a smart contract that allows users to deploy multiple instances of customizable ERC-20 tokens through the MyTokenFac contract. It stores key details about each deployed token, such as its name, symbol, decimals, initial supply, and contract address. The contract emits an event when a new token is created and provides functions to retrieve token details by index or name.

#### + Advanced Tokens

**ZeroToken**

The ZeroToken contract is an ERC20-compliant implementation that supports minting and burning of tokens. It includes an ownership model, where only the owner can mint new tokens. The contract also adheres to the IERC20 interface, ensuring compatibility with ERC20 tools and standards. Key functionalities include standard ERC20 transfers, allowance-based token spending, and the ability to burn tokens from the caller or another account with an approved allowance.

**Comparison with Other Token Implementations**

Below is a feature comparison between `ZeroToken`, `MyToken`, and `MyTokenFac`:

![Comparison Table](./Documentation/ERC20_features.PNG)

## Deployment

You could configure the defaultNetwork in the hardhat.config.js file, and set it to the network you want to use (By Default it's in the localhost netwok, and could choose between localhost, Ganache and sepolia) .
Then depending on the defaultNetwork run the deployement command :

**MyToken.sol**

```
npm run deploy:MyToken
```

**MyTokenFac.sol**

```
npm run deploy:MyTokenFac
```

**ZeroToken.sol**

```
npm run deploy:ZeroToken
```

**TokensFactory.sol**

```
npm run deploy:TokensFactory
```

Else if you are navigating between different networks, you could run those commands for deployement without the need to reset the defaultNetwork each time you switch the network .

#### LocalHost network

To deploy the smart contracts on the local hardhat network

1. start the hardhat node in a separate terminal

```
npx hardhat node
```

2. run the deployement command :

**MyToken.sol**

```
npm run deploy-localhost:MyToken
```

**MyTokenFac.sol**

```
npm run deploy-localhost:MyTokenFac
```

**ZeroToken.sol**

```
npm run deploy-localhost:ZeroToken
```

**TokensFactory.sol**

```
npm run deploy-localhost:TokensFactory
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

**TokensFactory.sol**

```
npm run deploy-ganache:TokensFactory
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

**TokensFactory.sol**

```
npm run deploy-sepolia:TokensFactory
```

Ps: Once a contract is deployed, you could check its details on address.json file .

## Interacting with the Contracts

After deployment, you can interact with the smart contracts using:

- **Hardhat console**:

  ```
  npx hardhat console --network localhost
  ```

- **Ethers.js** for JavaScript-based interaction.

- **Metamask** for interacting with the contracts on the Ethereum network.

### TokensFactory

To create new tokens from the factory

1. Customize your Tokens Details in the scripts\deployement\ERC20\basicToken\factoryTokensInfo.json file .
2. Execute the minting script by Running the command :

```
npm run mintToken
```

3. The created tokens info will be stored to the factoryTokens.json file .
