const hre= require("hardhat");
const fs = require("fs").promises;
const path = require("path");
const addressFile= require("../../../../address.json");
const contractDetails= path.join(__dirname, "../../../../ressources/ERC1155/Advanced/AdvContractArgs.json");
let ContractAddress;
let initialOwner;
let baseURI;

async function deploy(){
    try{
        console.log("Deploying AdvContract...");
    const deployer= (await hre.ethers.getSigners())[0];
    //  getting initial owner address (if not present, set to deployer address)
    let AdvContractArgs= JSON.parse(await fs.readFile(contractDetails, "utf8"));
    initialOwner= AdvContractArgs.initialOwner ;
    baseURI= AdvContractArgs.baseMetadataURI;
    console.log("Initial owner address: ", initialOwner);
    // Check if initialOwner is a valid address
    if (!initialOwner || !hre.ethers.isAddress(initialOwner)) {
        initialOwner = deployer.address;
        console.info("Initial owner address not provided or invalid. Using deployer address",initialOwner," as initial owner.");
      }
    //  Deploying AdvContract
    const AdvContract= await hre.ethers.deployContract("AdvContract",[initialOwner, baseURI]);
    await AdvContract.waitForDeployment();
    ContractAddress= AdvContract.target;
    console.log("AdvContract deployed at: ", AdvContract.target);
    }catch(err){
    console.error("Error deploying AdvContract: ", err.message || err);
    }
    // Update the address.json file
    try{
        addressFile["ERC1155_contracts"]["AdvancedContracts"]["AdvContract"]= {"ContractAddress": ContractAddress, "ContractInitialOwner": initialOwner};
        await fs.writeFile("./address.json", JSON.stringify(addressFile, null, 2));
    }catch(err){
        console.error("Error: ", err);
    }

}

deploy().catch((error) => {
    console.error("Deployment script error:", error.message || error);
    process.exit(1);
  }); 
