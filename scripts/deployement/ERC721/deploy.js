const hre = require("hardhat");
const fs = require("fs").promises ;
const path = require("path");
const {upload} = require("./uploadToIPS.js") ;
const { Blob } = require("buffer")
const addressFile = require("../../../address.json");

const filePath = path.join(__dirname, '../../../ressources/ERC721/metadata/collection_metadata.json');

const collectionPath = path.join(__dirname, './collectionInfo.json');
let name;
let symbol;
let contractAddress;
async function main() {
  

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

 
  let imageCID;
  let collectionMetadataURI;

 // Set the image CID to the metadata.json file ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 try {
  console.info("Uploading the collection image to IPFS...");
  imageCID = await upload("./ressources/ERC721/images/collection_image.png", "image/png");

  

  // Read the JSON file
  const data = await fs.readFile(filePath, 'utf8');

  // Parse the JSON data
  let metadata = JSON.parse(data);

  // Update the "image" value
  metadata.cid.image = imageCID;

  // Write the updated JSON back to the file
  await fs.writeFile(filePath, JSON.stringify(metadata, null, 2), 'utf8');

  console.log('File successfully updated');
} catch (err) {
  console.error('Error:', err);
}
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


  try {
    console.info("Uploading the collection metaData to IPFS...");
    collectionMetadataURI = await upload("./ressources/ERC721/metadata/collection_metadata.json",) ;
    console.log(`Collection's metadata URI : ${collectionMetadataURI}`);
  
  } catch(error){
    console.error("Error uploading collection metadata to IPFS:", error.message || error);
    if (error.stack) console.error(error.stack);

  }

  try {
    // 
    
  // Read the JSON file
  const collectionData = await fs.readFile(collectionPath, 'utf8');

  // Parse the JSON data
  let collectionInfo = JSON.parse(collectionData);

  

    // 
    name = collectionInfo.name;
    symbol = collectionInfo.symbol;
    const initialOwner = deployer.address;

    console.log("Deploying the MyCollection contract...");
    const MyCollection = await hre.ethers.deployContract("MyCollection", [
      name,
      symbol,
      initialOwner,
      collectionMetadataURI,
    ]);
    await MyCollection.waitForDeployment();
    contractAddress = MyCollection.target;

    // Update the "image" value
  collectionInfo.URI = collectionMetadataURI;
  collectionInfo.initialOwner = deployer.address;
  collectionInfo.collectionContractAddress = MyCollection.target;

  // Write the updated JSON back to the file
  await fs.writeFile(collectionPath, JSON.stringify(collectionInfo, null, 2), 'utf8');

  console.log('File successfully updated');

  console.info(`MyCollection deployed to: ${MyCollection.target}`);
  } catch (error) {
    console.error("Error deploying MyCollection contract:", error.message || error);
    if (error.stack) console.error(error.stack);
  }

  try {
    // Save the NFT contract's address to the address.json file
    addressFile["ERC721_contracts"]["AdvancedContracts"]["MyCollection"] = {
      CollectionName: name,
      CollectionSymbol: symbol,
      CollectionAddress: contractAddress,
      CollectionMetadata: collectionMetadataURI,
    };

    fs.writeFileSync("./address.json", JSON.stringify(addressFile, null, 2));
    console.log("Contract address successfully written to address.json");
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
