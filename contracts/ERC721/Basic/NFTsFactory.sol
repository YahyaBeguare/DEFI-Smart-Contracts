// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

// Import the ERC721 interface and any other necessary contracts
import {MyNFT} from "./MyNFT.sol" ; // Assuming you have an ERC721 implementation in the same directory;

/**
 * @title NFTFactory
 * @dev A contract to deploy and manage multiple instances of ERC721 NFT contracts.
 */
contract NFTFactory {
    // Counter for tracking the number of deployed NFT contracts
    uint public contractCount;
    
    // Mapping to store deployed NFT contract addresses by their ID
    mapping(uint => address) public nftContracts;

    // Event emitted when a new NFT contract is deployed
    event NFTContractDeployed(address contractAddress, string name, string symbol);

    /**
     * @dev Deploys a new ERC721 contract (NFT collection).
     * @param name The name of the new NFT collection.
     * @param symbol The symbol of the new NFT collection.
     * @return The address of the newly deployed NFT contract.
     */
    function createNFTCollection(string memory name, string memory symbol) public returns (address) {
        // Deploy a new ERC721 contract
        MyNFT newNFT = new MyNFT(name, symbol);
        
        // Store the address of the new NFT contract
        nftContracts[contractCount] = address(newNFT);
        
        // Increment the contract count
        contractCount++;
        
        // Emit an event to notify that a new NFT contract has been deployed
        emit NFTContractDeployed(address(newNFT), name, symbol);

        // Return the address of the newly deployed NFT contract
        return address(newNFT);
    }

    /**
     * @dev Retrieves the address of a deployed NFT contract by its ID.
     * @param contractId The unique ID of the NFT contract.
     * @return The address of the NFT contract.
     */
    function getNFTContract(uint contractId) public view returns (address) {
        return nftContracts[contractId];
    }
}
