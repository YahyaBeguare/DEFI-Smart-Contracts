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