# Interacting with the Deployed Contract in Hardhat Console

## Prerequisites
- Ensure you have deployed your contract using Hardhat.
- Make sure the Hardhat network is running.

## Steps to Interact with the Deployed Contract

### 1. Start the Hardhat Network
Open a terminal and start the Hardhat network:
```sh
npx hardhat node
```

### 2. Deploy the Contract
In another terminal, deploy your contract:
```sh
npx hardhat run scripts/deploy.MyCollection.js --network localhost
```

### 3. Open the Hardhat Console
Open the Hardhat console to interact with your deployed contract:
```sh
npx hardhat console --network localhost
```

### 4. Get the Deployed Contract Instance
In the Hardhat console, get the deployed contract instance:
```javascript
const MyCollection = await ethers.getContractFactory("MyCollection");
const myCollection = await MyCollection.attach("deployed_contract_address");
```
Replace `"deployed_contract_address"` with the actual address of your deployed contract.

### 5. Interact with the Contract

#### Get Contract Name
```javascript
const name = await myCollection.name();
console.log("Contract Name:", name);
```

#### Get Contract Symbol
```javascript
const symbol = await myCollection.symbol();
console.log("Contract Symbol:", symbol);
```

#### Mint a New Token
```javascript
const [owner] = await ethers.getSigners();
const tx = await myCollection.mint(owner.address, "tokenURI");
await tx.wait();
console.log("Token minted successfully");
```
Replace `"tokenURI"` with the actual URI of the token metadata.

#### Get Token URI
```javascript
const tokenId = 1; // Replace with the actual token ID
const tokenURI = await myCollection.tokenURI(tokenId);
console.log("Token URI:", tokenURI);
```

#### Check Token Ownership
```javascript
const tokenId = 1; // Replace with the actual token ID
const owner = await myCollection.ownerOf(tokenId);
console.log("Token Owner:", owner);
```

### 6. Exit the Console
To exit the Hardhat console, type:
```sh
.exit
```

## Notes
- Ensure you replace placeholders like `"deployed_contract_address"` and `"tokenURI"` with actual values.
- You can add more interactions based on the functions available in your contract.
