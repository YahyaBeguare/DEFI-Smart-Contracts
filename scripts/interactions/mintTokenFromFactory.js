const { ethers } = require("hardhat");
const fs = require("fs");
const factoryTokensFile = require("../../factoryTokens.json");
const addressFile = require("../../address.json");

const FACTORY_ADDRESS = addressFile["ERC20_contracts"]["Factory"];
// The path to the JSON file containing token info
const tokenInfoPath = "scripts/deployement/ERC20/basicToken/factoryTokensInfo.json";

async function getFactoryContract(){
    // Get the contract factory and attach it to the deployed address
    const Factory = await hre.ethers.getContractAt("TokensFactory", FACTORY_ADDRESS);
    return Factory;
}
async function mintToken() {
    // Get the factory contract  
    Factory= getFactoryContract();

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

  
  // Call a function (example: create a token contract)
  const createToken = await Factory.mintTokenContract(name, symbol, decimals, totalSupply);
  await createToken.wait();
  console.log("Token created successfully!");

  try {
    // Save the created token's details to the address.json file
    factoryTokensFile[name] = {
      TokenName: name,
      TokenSymbol: symbol,
      TokenAddress: MyTokenFac.target,
      TokenSupply: totalSupply,
    };

    fs.writeFileSync("./factoryTokens.json", JSON.stringify(factoryTokensFile, null, 2));
    console.log("token infos successfully written to factoryTokens.json");
  } catch (err) {
    console.error("Error writing to factoryTokens.json:", err);
  }

  // Interact with the contract (example: get token count)
  const tokenCount = await Factory.tokenCount();
  console.log("Total tokens created:", tokenCount.toString());

}

 mintToken().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
