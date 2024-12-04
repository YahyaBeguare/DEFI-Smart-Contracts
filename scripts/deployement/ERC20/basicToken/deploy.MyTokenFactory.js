const hre = require("hardhat");
const fs = require("fs");


async function deployTokensFactory() {
  // Get the deployer account (when using Hardhat's local network it defaults to the first account)
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy the MyToken contract with constructor arguments
  const Factory = await hre.ethers.deployContract("TokensFactory");

  await Factory.waitForDeployment();
  console.log("TokensFactory contract deployed to:", Factory.target);

  try {
    // Save the factory contract's address to the address.json file
    addressFile["ERC20_contracts"]["Factory"] = {
      FactoryAddress: ZeroToken.target,      
    };

    fs.writeFileSync("./address.json", JSON.stringify(addressFile, null, 2));
    console.log("Factory Contract's address successfully written to address.json");
  } catch (err) {
    console.error("Error writing to address.json:", err);
  }
 
}


deployTokensFactory().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
