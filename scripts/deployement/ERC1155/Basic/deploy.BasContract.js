const hre = require("hardhat");
const fs = require("fs");
const addressFile = require("../../../../address.json");
const contractDetails= path.join(__dirname, "../../../../ressources/ERC1155/Basic/basContractArgs.json");

let ContractAddress;
let BaseURI;

async function deploy() {
  try{
    // getting base URI (if not present, set to empty string)
    let BasContractArgs = JSON.parse(await fs.readFile(contractDetails, "utf8"));
    BaseURI = BasContractArgs.baseURI;
  } catch (err) {
    console.error("Error reading contract details: ", err);
  }
  try {
    console.log("Deploying BasContrat...");
    const deployer = (await hre.ethers.getSigners())[0];
    // Deploy BasContract
    const BasContract = await hre.ethers.deployContract("BasContract",[BaseURI]);
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
    fs.writeFileSync("./address.json", JSON.stringify(addressFile, null, 2));
  } catch (err) {
    console.error("Error: ", err);
  }
}

deploy()
  .then(() => process.exit(0))
  .catch((err) => console.error(err));
