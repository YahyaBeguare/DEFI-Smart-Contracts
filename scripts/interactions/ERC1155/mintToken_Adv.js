const hre = require("hardhat");
const path = require("path");

const addressFile = require("../../../address.json");
const mintingFile = require("../../../ressources/ERC1155/Advanced/MintingFile.json");
let advContractAddress;
let receiver;
let tokenId;
let amount;

async function mintToken() {
  // get the contract address
  try {
    advContractAddress =
      addressFile["ERC1155_contracts"]["AdvancedContracts"]["AdvContract"][
        "ContractAddress"
      ];

    console.log("using contract : ", advContractAddress);

  } catch (error) {
    console.error("Error getting contract address", error);
  }
  //  mint Token
  try {
    const advContract = await hre.ethers.getContractAt(
      "AdvContract",
      advContractAddress
    );

    receiver = mintingFile["receiverAddress"];
    tokenId = mintingFile["tokenId"];
    amount = mintingFile["amount"];

    console.info(
      "Receiver:",
      receiver,
      "tokenId:",
      tokenId,
      "Amount: ",
      amount
    );
    const mintTx = await advContract.mint(receiver, tokenId, amount, "0x");
    console.log("Mint transaction sent. Waiting for confirmation...");

    // Wait for the transaction to be mined

    const receipt = await mintTx.wait();
    console.info("Mint transaction confirmed. Transaction Hash:", receipt.hash);
  } catch (error) {
    console.error("Error minting Token:", error);
  }
}


mintToken().catch((error)=>{
  console.error(error);
  process.exitCode = 1
});
