# DeFi Protocols - Smart Contract Development and Deployment

## Overview

This repository contains implementations of various DeFi protocols using the Ethereum blockchain. It includes smart contracts for **ERC20**, **ERC721**, and **ERC1155** tokens, along with examples for deploying and interacting with these contracts on Ethereum and other EVM-compatible networks. Additionally, the repository provides best practices for securing, testing, and deploying these smart contracts.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Smart Contracts](#smart-contracts)
   - [ERC20](#erc20)
   - [ERC721](#erc721)
4. [Deployment](#deployment)
5. [Testing](#testing)
6. [Interacting with the Contracts](#interacting-with-the-contracts)

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
   git clone https://github.com/YahyaBeguare/DEFI-Smart-Contracts
   ```
  Access the folder you cloned the project to 
   ```
   cd "YOUR FOLDER NAME"
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

For detailed documentation, see [ERC20.md](https://ethereum.org/en/developers/docs/standards/tokens/erc-20/).

#### + Basic Tokens Contracts

**MyToken.sol**

The MToken.sol contract implements fundamental token functionalities, including transferring tokens, approving allowances, and transferring on behalf of others using allowances. It sets an initial supply of 1 million tokens assigned to the deployer and includes events for transparency. The code is structured with clear validations and safeguards for common token operations.

**MyTokenFac.sol**

The MyTokenFac.sol is an ERC20-like factory contract that allows the creation of tokens with customizable properties (name, symbol, decimals, and total supply). The constructor assigns the initial supply to the deployer's balance. It includes essential ERC20 functionalities like token transfers, approval for spending, and transferring tokens on behalf of others.

You could customise the token properties in the tokenInfo.json file located in scripts\deployement\ERC20\basicToken\tokenInfo.json .

**TokensFactory.sol**

The TokensFactory contract is a smart contract that allows users to deploy multiple instances of customizable ERC-20 tokens through the MyTokenFac contract. It stores key details about each deployed token, such as its name, symbol, decimals, initial supply, and contract address. The contract emits an event when a new token is created and provides functions to retrieve token details by index or name.

#### + Advanced Tokens Contracts

**ZeroToken.sol**

The ZeroToken contract is an ERC20-compliant implementation that supports minting and burning of tokens. It includes an ownership model, where only the owner can mint new tokens. The contract also adheres to the IERC20 interface, ensuring compatibility with ERC20 tools and standards. Key functionalities include standard ERC20 transfers, allowance-based token spending, and the ability to burn tokens from the caller or another account with an approved allowance.

**Comparison with Other Token Implementations**

Below is a feature comparison between `ZeroToken`, `MyToken`, and `MyTokenFac`:

![Comparison Table](./Documentation/ERC20_features.PNG)

### ERC721

The ERC-721 contract defines a standard for non-fungible tokens (NFTs), widely used for digital art, collectibles, gaming assets, and real-world asset tokenization.

**Features:**

- Mintable

- Burnable

- Enumerable

- Metadata

For detailed documentation, see [ERC721.md](https://ethereum.org/en/developers/docs/standards/tokens/erc-721/).

#### + Advanced NFTs Contracts

**MyCollection.sol**
MyCollection is an ERC-721 NFT contract that allows the owner to mint and burn tokens, while managing per-token metadata via URI storage. The contract is pausable, meaning token transfers and modifications (minting/burning) can be temporarily halted. It also stores a collection-level metadata URI to represent the overall collection. And it uses the openzeppelin implementation for a better security . 

## Deployment

You could configure the defaultNetwork in the hardhat.config.js file, and set it to the network you want to use (By Default it's in the localhost netwok, and could choose between localhost, Ganache and sepolia) .

### Deployment Prerequisites

#### ERC20 Contracts

- Before deploying MyTokenFac.sol contract

  - Set the token details in the "scripts\deployement\ERC20\basicToken\tokenInfo.json" file

- Before deploying MyTokenFactory.sol cotract

  - Set the token details in the "scripts\deployement\ERC20\basicToken\factoryTokensInfo.json" file .

- Before deploying ZeroToken.sol contract
  - Set the token details in the "scripts\deployement\ERC20\advancedToken\advancedTokenInfo.json" file .

#### ERC721 Contracts

- Before deploying MyCollection.sol contract you should :
  - Make an account on pinata (https://docs.pinata.cloud/quickstart).
  - Set the PINATA_JWT and the GATEWAY_URL in the .env file .
  - Place a png image that you want to set for your NFT collection in the (ressources/ERC721/deployement) and name it "collection_image.png".
  - Set the collection details(name,symbol, description, inialOwner, attributes and mintingCost ) in the "ressources/ERC721/deployement/collectionData.json" file.

### Deployement commands

Then depending on the defaultNetwork run the deployement command :

##### ERC20 Contracts

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

##### ERC721 contracts

**MyCollection.sol**

```
npm run deploy:MyCollection
```

Ps: Once the NFT collection contrat is deployed , a collectionInfo.json file that contains the collection details(name, symbol, URI, contract address, initial oner...) will be generated in the "scripts/deployement/ERC721" folder .

Else if you are navigating between different networks, you could run those commands for deployement without the need to reset the defaultNetwork each time you switch the network .

#### LocalHost network

To deploy the smart contracts on the local hardhat network

1. start the hardhat node in a separate terminal

```
npx hardhat node
```

2. run the deployement command :

##### ERC20 contracts

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

##### ERC721 Contracts

**MyCollection.sol**

```
npm run deploy-localhost:MyCollection
```

#### Ganache (Local Network)

To deploy the smart contracts on a local Ganache blockchain:

Start Ganache:

```
ganache-cli
```

Or just open the ganache app and log to the configured workspace .
Deploy the contracts:

##### ERC20 Contracts

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

##### ERC721 Contracts

**MyCollection.sol**

```
npm run deploy-ganache:MyCollection
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

##### ERC20 Contracts

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

##### ERC721 Contracts

**MyCollection.sol**

```
npm run deploy-sepolia:MyCollection
```

Ps: Once a contract is deployed, you could check its details on address.json file .

## Testing

### ERC721

To test the MyCollection.sol contract , run this command :

```
npm run test:MyCollection
```

## Interacting with the Contracts

After deployment, you can interact with the smart contracts using the hardhat console on your preffered network , this is an exapmle of using hardhat console on hardhat local network :

**Hardhat console**:

- Starts the console in a new terminal (assuming hardhat node is runing on another terminal for this example)

  ```
  npx hardhat console --network localhost
  ```

- **Ethers.js** for JavaScript-based interaction.

- **Metamask** for interacting with the contracts on the Ethereum network.

### ERC20 Contracts

**TokensFactory.sol**

To create new tokens from the factory

1. Customize your Tokens Details in the scripts\deployement\ERC20\basicToken\factoryTokensInfo.json file .
2. Execute the minting script by Running the command :

```
npm run mintToken
```

Or one of this commands for a specific network :

```
npm run mintToken-localhost
```

```
npm run mintToken-ganache
```

```
npm run mintToken-sepolia
```

3. The created tokens info will be stored to the factoryTokens.json file .

### ERC721 Contracts

**MyCollection.sol**

To mint new tokens on the MyCollection contrat

1. Place the image of the NFT in the "ressources/ERC721/mint/images" folder.
2. Customize your Tokens Details(name, descripton, receiver address, attributes) in the "ressources/ERC721/mint/mintingData.json" file, and make sure that the name of your token is the same as the the token image( Ex: "name" : "toto" , the image name should be toto as toto.jpg or toto.png or toto.jpeg....)
3. Execute the minting script by Running the command :

```
npm run mintNFT
```

Or one of this commands for a specific network :

```
npm run mintNFT-localhost
```

```
npm run mintNFT-ganache
```

```
npm run mintNFT-sepolia
```

Ps: By running the minting script, the program will try to find the image that has the same name of the token you want to mint, and upload it to IPFS, then creates in the "ressources/ERC721/mint/metadata" folder, the metadata json file for your token based on the details that you've specified in the mintingData.json file , and then includes the CID of the token image from IPFS, then upload the metadata file to IPFS and generates the URI to interact with the mint() function in the smart contract .
