const hre = require("hardhat");
const ethers = require("ethers");
const fs = require("fs").promises;
const path = require("path");
const { upload } = require("./uploadToIPFS.js");
const { Blob } = require("buffer");
const addressFile = require("../../../address.json");

// Path to the metadata file
const filePath = path.join(
  __dirname,
  "../../../ressources/ERC721/deployement/collection_metadata.json"
);

// Path to the collectionData file
const collectionPath = path.join(__dirname, "../../../ressources/ERC721/deployement/collectionData.json");
// Path to the collectionInfo file
const collectionInfoPath = path.join(__dirname, "./collectionInfo.json");

let name;
let symbol;
let contractAddress;
async function main() {
  // Get the first signer as deployer
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  let imageCID;
  let collectionMetadataURI;
  // Read the JSON file
  let collectionData = JSON.parse( await fs.readFile(collectionPath, "utf8"));
  // Set the image CID to the metadata.json file ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  try {
    console.info("Uploading the collection image to IPFS...");
    imageCID = await upload(
      "./ressources/ERC721/deployement/collection_image.png",
      "image/png"
    );

  
    // Parse the JSON data
    let metadata = {
      name: collectionData.name,
      symbol: collectionData.symbol,
      descripttion: collectionData.description,
      image: imageCID ,
      attributes: collectionData.attributes,

    }

   

    // Write the updated JSON back to the file
    await fs.writeFile(filePath, JSON.stringify(metadata, null, 2), "utf8");

    console.log("File successfully updated");
  } catch (err) {
    console.error("Error:", err);
  }
  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  // Upload the collection metadata to IPFS
  try {
    console.info("Uploading the collection metaData to IPFS...");
    collectionMetadataURI = await upload(
      "./ressources/ERC721/deployement/collection_metadata.json"
    );
    console.log(`Collection's metadata URI : ${collectionMetadataURI}`);
  } catch (error) {
    console.error(
      "Error uploading collection metadata to IPFS:",
      error.message || error
    );
    if (error.stack) console.error(error.stack);
  }
  // the collection metadata is uploaded to IPFS, we can now deploy the contract
  try {
    

    // Parse the JSON data
    let collectionInfo = JSON.parse( await fs.readFile(collectionInfoPath, "utf8"));

    // Get the name and symbol from the collectionInfo JSON file
    name = collectionData.name;
    symbol = collectionData.symbol;
    let mintingCost = ethers.parseUnits(collectionData.mintingCost, "ether"); 
    console.log("Minting cost: ", mintingCost);
    const initialOwner = deployer.address;

    console.log("Deploying the MyCollection contract...");
    const MyCollection = await hre.ethers.deployContract("MyCollection", [
      name,
      symbol,
      initialOwner,
      collectionMetadataURI,
      mintingCost
    ]);
    await MyCollection.waitForDeployment();
    contractAddress = MyCollection.target;

    // Update the collectionInfo JSON file
    collectionInfo.name = name;
    collectionInfo.symbol = symbol;
    collectionInfo.mintingCost = mintingCost.toString();
    collectionInfo.URI = collectionMetadataURI;
    collectionInfo.initialOwner = deployer.address;
    collectionInfo.collectionContractAddress = MyCollection.target;

    // Write the updated JSON to the collectionInfo file
    await fs.writeFile(
      collectionInfoPath,
      JSON.stringify(collectionInfo, null, 2),
      "utf8"
    );

    console.log("CollectionInfo successfully created");

    console.info(`MyCollection deployed to: ${MyCollection.target}`);
  } catch (error) {
    console.error(
      "Error deploying MyCollection contract:",
      error.message || error
    );
    if (error.stack) console.error(error.stack);
  }

  try {
    // Save the NFT contract's address to the address.json file
    addressFile["ERC721_contracts"]["MyCollection"] = {
      CollectionName: name,
      CollectionSymbol: symbol,
      CollectionAddress: contractAddress,
      CollectionMetadata: collectionMetadataURI,
    };

    await fs.writeFile("./address.json", JSON.stringify(addressFile, null, 2));
    if (contractAddress) {
      console.log("Contract address successfully written to address.json");
    }
  } catch (err) {
    console.error("Error writing to address.json:", err);
  }
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment script error:", error.message || error);
    process.exit(1);
  });
