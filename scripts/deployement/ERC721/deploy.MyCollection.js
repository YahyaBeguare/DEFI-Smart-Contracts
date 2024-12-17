const { ethers } = require("hardhat");
const { NFTStorage, File } = require("nft.storage");
const fs = require("fs");
const path = require("path");

// NFT.Storage API key
const nftStorageApiKey = process.env.NFT_STORAGE_API_KEY;

async function main() {
  // Get the deployer account (when using Hardhat's local network it defaults to the first account)
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Initialize NFT.Storage client
  const client = new NFTStorage({ token: nftStorageApiKey });

  // Path to collection image
  const imagePath = path.join(
    __dirname,
    "../../ressources",
    "images",
    "collection_image.png"
  );
  const imageData = fs.readFileSync(imagePath);

  // Upload the collection image to IPFS
  console.log("Uploading collection image to NFT.Storage...");
  const metadata = await client.store({
    name: "My NFT Collection",
    description: "The NFT collection's description.",
    image: new File([imageData], "collection_image.png", { type: "image/png" }),
  });

  const collectionMetadataURI = metadata.url; // IPFS URL
  console.log(`Collection metadata uploaded: ${collectionMetadataURI}`);

  // Contract details
  const name = "My NFT Collection";
  const symbol = "MYNFT";
  const initialOwner = deployer.address;

  // Deploy the contract
  console.log("Deploying the MyCollection contract...");
  const MyCollection = await ethers.getContractFactory("MyCollection");
  const myCollection = await MyCollection.deploy(
    name,
    symbol,
    initialOwner,
    collectionMetadataURI
  );
  await myCollection.deployed();

  console.log(`MyCollection deployed to: ${myCollection.address}`);
}

// Run the deployment script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
