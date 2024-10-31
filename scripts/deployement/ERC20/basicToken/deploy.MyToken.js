const hre = require("hardhat");
const fs = require("fs");
const addressFile = require("../../../../address.json");

async function deployMyToken() {
  // Get the deployer account (when using Hardhat's local network it defaults to the first account) 
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  //deploy the MyToken contract
  const MyToken = await hre.ethers.deployContract("MyToken", {
    // gasLimit: 650000, // Specify gas limit for this transaction
    // gasPrice: 150000000, // Specify gas price for this transaction
  });
  await MyToken.waitForDeployment();
  console.log("MyToken contract deployed to:", MyToken.target);

  try {
    //save the contract's address to the address.json file
    addressFile["ERC20_contracts"]["BasicContracts"]["MyToken"] = {
     
                TokenAddress: MyToken.target,
        
    };

    fs.writeFileSync("./address.json", JSON.stringify(addressFile, null, 2));
    console.log("Contract address successfully written to address.json");
  } catch (err) {
    console.error("Error writing to address.json:", err);
  }
}

deployMyToken().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
