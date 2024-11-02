const hre = require("hardhat");
const fs = require("fs");

const addressFile = require("../../address.json");
const { get } = require("http");
const {deployer} = require("../deployement/ERC20/advancedToken/deploy.ZeroToken.js");

const ZEROTOKEN_ADDRESS = addressFile["ERC20_contracts"]["AdvancedContracts"]["ZeroToken"]["TokenAddress"];





async function getTokenContract() {
    // Get the contract factory and attach it to the deployed address
    const token = await hre.ethers.getContractAt("ZeroToken", ZEROTOKEN_ADDRESS);
    return token;

}

async function getTokenName() {
    const token = await getTokenContract();
    const name = await token.name();
    return name;
}

async function getTokenSymbol() {
    const token = await getTokenContract();
    const symbol = await token.symbol();
    return symbol;
}


async function getTotalSupply() {
    const token = await getTokenContract();
    const supply = await token.totalSupply();
    return supply;
}

async function getAllowance(owner, spender) {
    const token = await getTokenContract();
    const allowance = await token.allowance(owner, spender);
    return allowance;
}

async function getBalance(account) {
    const token = await getTokenContract();
    const balance = await token.balanceOf(account);
    return balance;
}

// ++++++++++++++++++++++++++++++++ Write functions ++++++++++++++++++++++++++++++++

async function transferTokens(recipient, amount) {
    const token = await getTokenContract();
    const tx = await token.transfer(recipient, amount);
    await tx.wait();
    console.log(`Transferred ${amount} tokens to ${recipient}`);
}
async function approve(spender, amount) {
    const token = await getTokenContract();
    const tx = await token.approve(spender, amount);
    await tx.wait();
    console.log(`Approved ${spender} to spend ${amount} tokens`);
}

async function transferFrom(sender, recipient, amount) {
    const token = await getTokenContract();
    const tx = await token.transferFrom(sender, recipient, amount);
    await tx.wait();
    console.log(`Transferred ${amount} tokens from ${sender} to ${recipient}`);
}


async function mintTokens(recipient, amount) {
    const token = await getTokenContract();
    const tx = await token.mint(recipient, amount); // Replace 'mint' with your contract's mint function
    await tx.wait();
    console.log(`Minted ${amount} tokens to ${recipient}`);
}

async function burnTokens(amount) {
    const token = await getTokenContract();
    const tx = await token.burn(amount); // Replace 'burn' with your contract's burn function
    await tx.wait();
    console.log(`Burned ${amount} tokens`);
}

async function burnFrom(account, amount) {
    const token = await getTokenContract();
    const tx = await token.burnFrom(account, amount); // Replace 'burnFrom' with your contract's burnFrom function
    await tx.wait();
    console.log(`Burned ${amount} tokens from ${account}`);
}

async function main() {
    const name = await getTokenName();
    console.log(`Token name: ${name}`);

    const symbol = await getTokenSymbol();
    console.log(`Token symbol: ${symbol}`);

    const supply = await getTotalSupply();
    console.log(`Total supply: ${supply}`);

    const balance = await getBalance(deployer);


}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

module.exports = {
   getTokenName,
    getTokenSymbol,
    getAllowance,
    getTotalSupply,
    getBalance,
    transferTokens,
    approve,
    transferFrom,
    mintTokens,
    burnTokens,
    burnFrom,

};

// const symbol = await interact.getTokenSymbol();
// const supply = await interact.getTotalSupply();
// const balaceof= await interact.getBalance();