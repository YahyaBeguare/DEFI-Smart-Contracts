// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

// Importing the MyTokenFac contract to create new customisable token instances.
import {MyTokenFac} from "./MyTokenFac.sol";

/**
 * @title TokensFactory
 * @dev A factory contract to deploy and manage multiple instances of MyTokenFac contracts.
 */
contract TokensFactory {

    // Structure to store details about each deployed token contract.
    struct tokensArch {
        string name;         // The name of the token.
        string _symbol;      // The symbol of the token.
        uint8 _decimals;     // The number of decimals for the token.
        uint256 _initialSupply; // The initial supply of the token.
        address tokenAddress;  // The deployed address of the token contract.
    }
    
    // Counter to keep track of the total number of deployed tokens.
    uint public tokenCount; 

    // Mapping to store details of tokens by their unique ID.
    mapping (uint => tokensArch) public tokens;
 
    // Event emitted whenever a new token contract is deployed.
    event tokenCreated(string name, string _symbol, uint8 _decimals, uint256 _initialSupply, address tokenAddress);

    /**
     * @dev Deploys a new MyTokenFac contract and stores its details in the factory.
     * @param _name The name of the token.
     * @param _symbol The symbol of the token.
     * @param _decimals The number of decimals for the token.
     * @param _initialSupply The initial supply of the token.
     */
    function mintTokenContract(
        string memory _name,
        string memory _symbol,
        uint8 _decimals,
        uint256 _initialSupply
    ) public {
        // Deploy a new instance of MyTokenFac.
        MyTokenFac token = new MyTokenFac(_name, _symbol, _decimals, _initialSupply);

        // Store the details of the deployed token in the mapping.
        tokens[tokenCount] = tokensArch(_name, _symbol, _decimals, _initialSupply, address(token)); 
        
        // Increment the token counter.
        tokenCount++;
        // Emit an event to notify that a new token has been created.
        emit tokenCreated(_name, _symbol, _decimals, _initialSupply, address(token));
    }

    /**
     * @dev Retrieves the details of a deployed token by its index.
     * @param _index The unique index of the token in the factory.
     * @return A `tokensArch` struct containing the token's details.
     */
    function getTokenData(uint _index) public view returns (tokensArch memory) {
        return tokens[_index];
    }

    /**
     * @dev Retrieves the address of a deployed token by its name.
     * @param _name The name of the token.
     * @return tokenAddress The address of the token contract.
     */
    function getTokenAddress(string memory _name) public view returns (address tokenAddress) {
        // Loop through all deployed tokens to find one with the matching name.
        for (uint i = 0; i < tokenCount; i++) {
            // Compare the names using `keccak256` to avoid issues with string comparison.
            if (keccak256(abi.encodePacked(tokens[i].name)) == keccak256(abi.encodePacked(_name))) {
                return tokens[i].tokenAddress;
            }
        }
    }
}
