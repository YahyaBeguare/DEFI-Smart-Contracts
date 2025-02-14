const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs").promises;

dotenv.config();

const folderPath = "./ressources/ERC1155/Basic/TokensMetadata";
const extentionFile= require("../../../../ressources/ERC1155/Basic/imageExtension.json");
const contractArgsPath = path.join(__dirname,"../../../../ressources/ERC1155/Basic/BasContractArgs.json");
const PinataGateway = process.env.GATEWAY_URL;
let baseMetadataURI;
let imageExtension;

async function uploadImages() {
    // Upload the metadata to IPFS +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  try {
    const { pinDirectoryToPinata } = await import("../Advanced/uploadToIPFS.mjs");
    const {ipfsHash, } = await pinDirectoryToPinata(folderPath);
    baseMetadataURI = "https://" + PinataGateway + "/ipfs/" + ipfsHash;
    console.log("here's the Metadata CID for the BasContract:", baseMetadataURI);
    // console.log("the currency metadata URI is: ", baseImagesURI + "/0.jpg");
  } catch (error) {
    console.error(error);
  }
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//   Set the base URI for the metadata +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  try {
    let contractArgs = JSON.parse( await fs.readFile(contractArgsPath, "utf8"));
    //  get the images extention
    imageExtension = extentionFile["imageExtension"] ;
    const baseURI = baseMetadataURI + "/{id}."+imageExtension;
    contractArgs.baseMetadataURI = baseURI ;
    console.log("baseURI :", baseURI);
     // Write the updated JSON to the contractArgs file
     await fs.writeFile(
        contractArgsPath,
        JSON.stringify(contractArgs, null, 2),
        "utf8"
      );

  } catch (error) {
    console.error(error);
  }
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
}

uploadImages()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });