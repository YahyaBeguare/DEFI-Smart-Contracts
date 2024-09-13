const hre = require("hardhat");
const fs = require("fs");
const addressFile= require("address.json");

async function deployMyToken() {
  //deploy the MyToken contract
  const MyToken = await hre.ethers.deployContract("MyToken");
  await MyToken.waitForDeployment();
  console.log("MyToken contract deployed to:", MyToken.getAddress());

  //save the contract's address to the address.json file
  addressFile["ERC20 contract"] = {
    MyToken: MyToken.target ,
  };

  fs.writeFileSync("address.json", JSON.stringify(addressFile, null, 2));

}

deployMyToken().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
