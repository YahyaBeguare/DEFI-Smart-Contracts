const { ethers } = require("hardhat");
const fs = require("fs");
const factoryTokensFile = require("../../factoryTokens.json");
const addressFile = require("../../address.json");

const FACTORY_ADDRESS = addressFile["ERC20_contracts"]["Factory"]["FactoryAddress"];
// The path to the JSON file containing token info
const tokenInfoPath = "scripts/deployement/ERC20/basicToken/factoryTokensInfo.json";

// async function getFactoryContract(){
//     // Get the contract factory and attach it to the deployed address
//     const Factory = await hre.ethers.getContractAt("TokensFactory", FACTORY_ADDRESS);
//     return Factory;
// }
async function mintToken() {
  console.log("the factory address is:", FACTORY_ADDRESS);
    // Get the factory contract  
    const Factory = await hre.ethers.getContractAt("TokensFactory", FACTORY_ADDRESS);

  // Get the signer (deployer or another account)
  const [signer] = await ethers.getSigners();

  // Read token info from the hardcoded JSON file path
  const tokenInfo = JSON.parse(fs.readFileSync(tokenInfoPath, "utf8"));

  // Get the token info from the JSON file
  const { name, symbol, decimals, totalSupply } = tokenInfo;
  console.log("Deploying with arguments:", {
    name,
    symbol,
    decimals,
    totalSupply,
  });

  
  // Calling the mintTokenContract function to create a token contract
  const newToken = await Factory.mintTokenContract(name, symbol, decimals, totalSupply);
  const tokenCreationReceipt= await newToken.wait();
  // Get the yokenCreated event logs
  const args = tokenCreationReceipt.logs[0].args;

   console.log("Token created successfully at address:", args.tokenAddress);


  
  try {
    // Save the created token's details to the address.json file
    factoryTokensFile[name] = {
      TokenName: args.name,
      TokenSymbol: args._symbol ,
      TokenAddress: args.tokenAddress,
      TokenSupply: args._initialSupply.toString(),
    };

    fs.writeFileSync("./factoryTokens.json", JSON.stringify(factoryTokensFile, null, 2));
    console.log("token infos successfully written to factoryTokens.json");
  } catch (err) {
    console.error("Error writing to factoryTokens.json:", err);
  }

  // Interact with the contract to get token count
  const tokenCount = await Factory.tokenCount();
  console.log("Total tokens created:", tokenCount.toString());

}

 mintToken().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
