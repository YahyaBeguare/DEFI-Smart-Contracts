const hre = require("hardhat");
const fs = require("fs");
const addressFile= require("../../address.json");

async function deployMyToken() {
  //deploy the MyToken contract
  const MyTokenFac = await hre.ethers.deployContract("MyTokenFac");
  await MyTokenFac.waitForDeployment();
  console.log("MyToken contract deployed to:",MyTokenFac.target );

  try{
  //save the contract's address to the address.json file
  addressFile["ERC20_contract"] = {
    MyToken: MyToken.target,
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
