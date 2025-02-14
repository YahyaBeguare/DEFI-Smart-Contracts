const dotenv = require("dotenv");
const fs = require("fs");
dotenv.config();

const folderPath = "./ressources/ERC1155/Advanced/TokensPictures";
const PinataGateway = process.env.GATEWAY_URL;
const metadtaFilePath = "./ressources/ERC1155/Advanced/TokensMetadata";

async function uploadImages() {
  try {
    const { pinDirectoryToPinata } = await import("./uploadToIPFS.mjs");
    const { ipfsHash, folderLength } = await pinDirectoryToPinata(folderPath);
    const baseImagesURI = "https://" + PinataGateway + "/ipfs/" + ipfsHash;
    console.log("here's the CID:", baseImagesURI);
    console.log("the currency URI is: ", baseImagesURI + "/0.jpg");

    for(i=1; i<=folderLength; i++){
      fs.writeFileSync(`${metadtaFilePath}/${i}.json`, JSON.stringify({
        "name": `Token ${i}`,
        "tokenId": i,
        "description": `This is the description of the token ${i}`,
        "image": `${baseImagesURI}/${i}.jpg`,
        "attributes": []
      }, null, 2));
    }


  } catch (error) {
    console.error(error);
  }
}

uploadImages()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });