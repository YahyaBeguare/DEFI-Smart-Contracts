# Interacting with the `AdvContract` Using Hardhat Console
This document explain step by step how to interact with the AdvContract.sol contract using the hardhat network to mint and Burn fungible and NonFungible tokens , get the contract base uri and check token's ownership, pause and unpause the contract and reset the baseUri and track tokens balances .
Ps: You could use a different network, just replace "localhost" with the name of the network you want to use(sepolia, rinkeby, ganache...) and set the network in the `"hardhat.config.js"` file .
## Prerequisites

- Ensure you have setted the tokens jpg images in the `"ressources\ERC1155\Advanced\TokensPictures"` folder and named them with their ids starting from 1 .

- Ensure you have setted the initialOwner of the contract in the `"ressources\ERC1155\Advanced\AdvContractArgs.json"` file . If not the deployer address will be setted automatically as the initial owner .
- Make sure the Hardhat network is running(just in this case to interact using the hardhat network).

## Steps to Interact with the Deployed Contract

### 1. Start the Hardhat Network

Open a terminal and start the Hardhat network:

```sh
npx hardhat node
```

### 2. Upload the tokens images to IPFS

In another Terminal, to upload the tokens images run:
```sh
npm run uploadImages:AdvContract
```

Then Edit the generated tokens metadata files in `"ressources\ERC1155\Advanced\TokensMetadata"`, and upload the tokens  metadta by running:

```sh
npm run uploadMetadata:AdvContract
```
Then the baseUri will be outputted .

### 3. Deploy the Contract

Deploy your contract if it's not already deployed:

```sh
npx hardhat run run scripts/deployement/ERC1155/Advanced/deploy.AdvContract.js --network localhost
```
or 

```sh
npm run deploy-localhost:AdvContract
```


### 4. Open the Hardhat Console

Open the Hardhat console to interact with your deployed contract:

```sh
npx hardhat console --network localhost
```

### 5. Get the Deployed Contract Instance

In the Hardhat console, get the deployed contract instance:

```javascript
const AdvContract = await ethers.getContractFactory("AdvContract");
const advContract = await AdvContract.attach("deployed_contract_address");
```


Replace `"deployed_contract_address"` with the actual address of your deployed contract.

### 6. Interact with the Contract

#### Get the Base URI

```javascript
let uri = await advContract.uri(0);
console.log("Token Base URI :", uri);
```

#### Set the Base URI

```javascript
let setTx = await advContract.setURI("NEW_URI");
await setTx.wait();
```
Replace `"NEW_URI"` with the new URI  .
#### Mint a New Token
```javascript
const [owner] = await ethers.getSigners();
let mintTx = await advContract.mint(owner.address, 2, 100, "0x");
await mintTx.wait();
console.log("Token minted successfully");
```

This mints 100 units of token ID 1 to the owner's address. The `data` parameter is set to `"0x"` as an empty `bytes` value.

#### Mint Multiple Tokens (Batch Minting)

```javascript
const [owner] = await ethers.getSigners();
const ids = [1, 2, 3]; // Token IDs
const amounts = [100, 200, 300]; // Corresponding amounts
const mintBTx = await advContract.mintBatch(owner.address, ids, amounts, "0x");
await mintBTx.wait();
console.log("Tokens minted successfully");
```

This mints multiple tokens in a single transaction. Ensure that the `ids` and `amounts` arrays have the same length.

#### Check Token Balance

```javascript
const [owner] = await ethers.getSigners();
let balance = await advContract.balanceOf(owner.address, 1);
console.log("Token Balance:", balance.toString());
```

This retrieves the balance of token ID 1 for the owner's address.

#### Pause the Contract

```javascript
const pauseTx = await advContract.pause();
await pauseTx.wait();
console.log("Contract paused successfully");
```

This pauses all token transfers within the contract.

#### Unpause the Contract

```javascript
const unpauseTx = await advContract.unpause();
await unpauseTx.wait();
console.log("Contract unpaused successfully");
```

This unpauses the contract, allowing token transfers to resume.

### 6. Exit the Console

To exit the Hardhat console, type:

```sh
.exit
```

## Notes

- Ensure you replace placeholders like `"deployed_contract_address"` with actual values.
- The `data` parameter in the `mint` and `mintBatch` functions is a `bytes` type, which can be used to pass additional data. In many cases, it can be an empty string (`"0x"`).
- You can add more interactions based on the functions available in your contract. 