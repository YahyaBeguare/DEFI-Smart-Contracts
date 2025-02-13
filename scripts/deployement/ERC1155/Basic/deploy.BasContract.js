const hre = require("hardhat");
const fs = require("fs").promises;
const path = require("path");


const addressFile = require("../../../../address.json");
const contractDetails= path.join(__dirname, "../../../../ressources/ERC1155/Basic/BasContractArgs.json");

let ContractAddress;
let baseURI;

async function deploy() {
  try{
    // getting base URI (if not present, set to empty string)
    let BasContractArgs = JSON.parse(await fs.readFile(contractDetails, "utf8"));
    baseURI = BasContractArgs.baseMetadataURI;
    console.log("Base URI: ", baseURI);
  } catch (err) {
    console.error("Error reading contract details: ", err);
  }
  try {
    console.log("Deploying BasContrat...");
    const deployer = (await hre.ethers.getSigners())[0];
    // Deploy BasContract
    const BasContract = await hre.ethers.deployContract("BasContract",[baseURI]);
    await BasContract.waitForDeployment();
    ContractAddress = BasContract.target;
    console.log("BasContract deployed at: ", BasContract.target);
  } catch (err) {
    console.error("Error deploying BasContract: ", err.message || err);
  }
  //   Update the address.json file
  try {
    addressFile["ERC1155_contracts"]["BasicContracts"]["BasContract"][
      "ContractAddress"
    ] = ContractAddress;
    fs.writeFile("./address.json", JSON.stringify(addressFile, null, 2));
  } catch (err) {
    console.error("Error: ", err);
  }
}

deploy().catch((error) => {
  console.error("Deployment script error:", error.message || error);
  process.exit(1);
}); 