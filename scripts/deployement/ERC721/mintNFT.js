const hre = require("hardhat");
const ethers = require("ethers");
const fs = require("fs").promises;
const path = require("path");
const { upload } = require("./uploadToIPFS.js");
const { Blob } = require("buffer");

const addressFile = require("../../../address.json");
const mintingFile = require("../../../ressources/ERC721/mint/mintingData.json");
const imagesFolder = "./ressources/ERC721/images";
let items = [];
let imagePath;
let imageCID;
let metadataFilePath;
let URI;

async function mint() {
  // const [deployer] = await hre.ethers.getSigners();

  const CollectionAddress =
    addressFile["ERC721_contracts"]["MyCollection"]["CollectionAddress"];
  console.log("Collection Address: ", CollectionAddress);

  //
  const imageName = mintingFile["mintingData"]["name"];
  const Receiver = mintingFile["mintingData"]["ReceiverAddress"];
  console.info("Receiver: ", Receiver, " Item name: ", imageName);

  // Specify the NFT path from its name in the mintingData.json file  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  try {
    const files = await fs.readdir(imagesFolder);

    // Find all files that match the image name (ignoring the extension)
    const matchedFiles = files.filter((file) => {
      const fileNameWithoutExtension = path.basename(file, path.extname(file));
      return fileNameWithoutExtension === imageName;
    });

    if (matchedFiles.length === 0) {
      throw new Error(`No images found with the name: ${imageName}`);
    }

    // Set the image names with their extensions
    items = matchedFiles; // This will contain the file names with extensions
    console.log("Items: ", items);
  } catch (error) {
    console.error("Error finding images:", error);
    throw error;
  }
  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  if (items.length === 0) {
    throw new Error("No items found to mint");
  } else if (items.length > 1) {
    throw new Error(
      "More than one item found to mint, the image Name is duplicated. Please name the images differently"
    );
  } else {
    console.log("Uploading the NFT image to IPFS...");
    // Dynamically generate the file path
    imagePath = path.join(
      __dirname,
      "../../../ressources/ERC721/images",
      items[0]
    );
    // Dynamically generate the metadata file path

    metadataFilePath =
      "./ressources/ERC721/metadata/" +
      path.basename(items[0], path.extname(items[0])) +
      ".json";
    // path.join(
    //   __dirname,
    //   "../../../ressources/ERC721/metadata/",
    //   path.basename(items[0], path.extname(items[0])) + ".json"
    // );

    console.log("Generated file path:", metadataFilePath);

    // Upload the image to IPFS
    try {
      imageCID = await upload(imagePath);
      console.log(`Image uploaded to IPFS with CID: ${imageCID}`);
    } catch (error) {
      console.error("Error uploading the image to IPFS:", error);
    }
  }
  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  // Create the metadata.json file for the NFT ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  try {
    // Create a new JSON object
    const metadata = {
      name: imageName,
      description: mintingFile["mintingData"]["description"],
      image: imageCID,
      attributes: mintingFile["mintingData"]["attributes"],
    };

    // Write the new JSON object to the file
    await fs.writeFile(
      metadataFilePath,
      JSON.stringify(metadata, null, 2),
      "utf8"
    );

    // console.log("New JSON file successfully created at:", newFilePath);
  } catch (err) {
    console.error("Error creating JSON file:", err);
  }

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  // // Upload the collection metadata to IPFS
  try {
    URI = await upload(metadataFilePath);
    console.info("Metadata uploaded to IPFS with URI: ", URI);
  } catch (error) {
    console.error("Error uploading the metadata to IPFS:", error);
  }

  try {
    const collectionContract = await hre.ethers.getContractAt(
      "MyCollection",
      CollectionAddress
    );
    console.log("Collection contract loaded:", CollectionAddress);
    const NFname = await collectionContract.name();
    console.log("Collection Name: ", NFname);
    // Call the payable mint function
    const mintTx = await collectionContract.mint(Receiver, URI, {
      value: ethers.parseUnits("0.1", "ether"), // Send 0.1 Ether
    });

    console.log("Mint transaction sent. Waiting for confirmation...");

    // Wait for the transaction to be mined
    const receipt = await mintTx.wait();
    console.log("Mint transaction confirmed. Receipt:", receipt);
  } catch (error) {
    console.error("Error minting NFT:", error);
  }
}

mint().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
