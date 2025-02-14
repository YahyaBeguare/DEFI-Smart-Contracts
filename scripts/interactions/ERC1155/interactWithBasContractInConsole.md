# Interacting with the `BasContract` Using Hardhat Console
This document explain step by step how to interact with the BasContract.sol contract using the hardhat network to mint and Burn fungible and NonFungible tokens , get the contract base uri and check token's ownership .
Ps: You could use a different network, just replace "localhost" with the name of the network you want to use(sepolia, rinkeby, ganache...) and set the network in the `"hardhat.config.js"` file .
## Prerequisites

- Ensure you have setted the tokens images in the `"ressources\ERC1155\Basic\TokensPictures"` folder .
- Make sure the Hardhat network is running(just in this case to interact using the hardhat network).

## Steps to Interact with the Deployed Contract

### 1. Start the Hardhat Network

Open a terminal and start the Hardhat network:

```sh
npx hardhat node
```
Ps: This step is not required if another network is used .

### 2. Upload the tokens images to IPFS

In another Terminal, to upload the tokens images run:
```sh
npm run uploadImages:BasContract
```

Then to upload the tokens  metadta run:

```sh
npm run uploadMetadata:BasContract
```


### 3. Deploy the Contract

In another terminal, deploy your contract if it's not already deployed:

```sh
npx hardhat run scripts/deployement/ERC1155/Basic/deploy.BasContract.js --network localhost
```



### 4. Open the Hardhat Console

Open the Hardhat console to interact with your deployed contract:

```sh
npx hardhat console --network localhost
```

### 5. Get the Deployed Contract Instance

In the Hardhat console, get the deployed contract instance:

```javascript
const BasContract = await ethers.getContractFactory("BasContract");
const basContract = await BasContract.attach("deployed_contract_address");
```

Replace `"deployed_contract_address"` with the actual address of your deployed contract (you could get it from the adress.json file in the project's root).

### 6. Interact with the Contract

#### Get the Base URI

```javascript
const uri = await basContract.uri(0);
console.log("Token Base URI :", uri);
```

#### Mint a New Token

```javascript
const [owner] = await ethers.getSigners();
const tx = await basContract.mint(owner.address, 1, 100, "0x");
await tx.wait();
console.log("Token minted successfully");
```

This mints 100 units of token ID 1 to the owner's address. The `data` parameter is set to `"0x"` as an empty `bytes` value.

#### Mint Multiple Tokens (Batch Minting)

```javascript
const [owner] = await ethers.getSigners();
const ids = [1, 2, 3]; // Token IDs
const amounts = [100, 200, 300]; // Corresponding amounts
const tx = await basContract.mintBatch(owner.address, ids, amounts, "0x");
await tx.wait();
console.log("Tokens minted successfully");
```

This mints multiple tokens in a single transaction. Ensure that the `ids` and `amounts` arrays have the same length.

#### Check Token Balance

```javascript
const [owner] = await ethers.getSigners();
const balance = await basContract.balanceOf(owner.address, 1);
console.log("Token Balance:", balance.toString());
```

This retrieves the balance of token ID 1 for the owner's address.

### 6. Exit the Console

To exit the Hardhat console, type:

```sh
.exit
```

## Notes

- Ensure you replace placeholders like `"deployed_contract_address"` with actual values.
- The `data` parameter in the `mint` and `mintBatch` functions is a `bytes` type, which can be used to pass additional data. In many cases, it can be an empty string (`"0x"`).
- You can add more interactions based on the functions available in this contract. 