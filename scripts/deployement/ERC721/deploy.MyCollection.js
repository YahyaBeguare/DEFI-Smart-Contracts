const { ethers } = require("hardhat");
const fs = require("fs");
const nftStorage = require("nft.storage");
const { NFTStorage, File } = nftStorage;
require("dotenv").config();

async function main() {
  const NFT_STORAGE_API_KEY = process.env.NFT_STORAGE_API_KEY;
  const client = new NFTStorage({ token: NFT_STORAGE_API_KEY });

  // Read collection metadata and upload to NFT.storage
  const collectionMetadata = fs.readFileSync("./metadata/collection.json", "utf-8");
  const metadataCID = await client.storeBlob(new File([collectionMetadata], "collection.json"));

  console.log("Metadata uploaded to IPFS with CID:", metadataCID);

  // Deploy the contract
  const Collection = await ethers.getContractFactory("MyCollection");
  const collection = await Collection.deploy(`ipfs://${metadataCID}/`);
  await collection.deployed();

  console.log("Contract deployed at address:", collection.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
