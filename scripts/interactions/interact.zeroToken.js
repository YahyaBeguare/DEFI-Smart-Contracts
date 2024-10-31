const hre = require("hardhat");
const fs = require("fs");

const addressFile = require("../../address.json");
const { get } = require("http");

const ZEROTOKEN_ADDRESS = addressFile["ERC20_contracts"]["AdvancedContracts"]["ZeroToken"]["TokenAddress"];




async function getToken() {
    // Get the contract factory and attach it to the deployed address
    console.log("ZEROTOKEN_ADDRESS: ", ZEROTOKEN_ADDRESS);
    
}

async function getTokenContract() {
    // Get the contract factory and attach it to the deployed address
    const token = await hre.ethers.getContractAt("ZeroToken", ZEROTOKEN_ADDRESS);
    return token;

}

async function getTotalSupply() {
    const token = await getTokenContract();
    const supply = await token.totalSupply();
    return supply;
}

async function mintTokens(recipient, amount) {
    const token = await getTokenContract();
    const tx = await token.mint(recipient, amount); // Replace 'mint' with your contract's mint function
    await tx.wait();
    console.log(`Minted ${amount} tokens to ${recipient}`);
}

async function getBalance(account) {
    const token = await getTokenContract();
    const balance = await token.balanceOf(account);
    return balance;
}

module.exports = {
    getToken,
    getTotalSupply,
    mintTokens,
    getBalance
};
