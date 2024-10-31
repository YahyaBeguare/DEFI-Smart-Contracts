const hre = require("hardhat");
const fs = require("fs");
const addressFile = require("../../../../address.json");

// The path to the JSON file containing token info
const tokenInfoPath = "scripts/deployement/ERC20/basicToken/tokenInfo.json";

async function deployMyToken(tokenInfo) {
  // Get the deployer account (when using Hardhat's local network it defaults to the first account)
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Get the token info from the JSON file
  const { name, symbol, decimals, totalSupply } = tokenInfo;
  console.log("Deploying with arguments:", {
    name,
    symbol,
    decimals,
    initialSupply,
  });

  // Deploy the MyToken contract with constructor arguments
  const MyTokenFac = await hre.ethers.deployContract("MyTokenFac", [
    name,
    symbol,
    decimals,
    totalSupply,
  ]);

  await MyTokenFac.waitForDeployment();
  console.log("MyToken contract deployed to:", MyTokenFac.target);

  try {
    // Save the contract's address to the address.json file
    addressFile["ERC20_contracts"]["BasicContracts"]["MyTokenFac"] = {
      TokenName: name,
      TokenSymbol: symbol,
      TokenAddress: MyTokenFac.target,
      TokenSupply: totalSupply,
    };

    fs.writeFileSync("./address.json", JSON.stringify(addressFile, null, 2));
    console.log("Contract address successfully written to address.json");
  } catch (err) {
    console.error("Error writing to address.json:", err);
  }
}

async function main() {
  try {
    // Read token info from the hardcoded JSON file path
    const tokenInfo = JSON.parse(fs.readFileSync(tokenInfoPath, "utf8"));
    // Call deploy function with token info
    await deployMyToken(tokenInfo);
  } catch (err) {
    console.error("Error reading or parsing JSON file:", err);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
