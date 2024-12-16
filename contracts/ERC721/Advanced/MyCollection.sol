// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract MyCollection is ERC721, ERC721URIStorage, ERC721Pausable, Ownable {
    
   uint256 public tokenCounter;

    // Mapping to store token URIs for minted NFTs
    mapping(uint256 => string) private _tokenURIs;

    // Constructor to initialize collection details and transfer ownership
    constructor(
        string memory name,
        string memory symbol,
        address initialOwner
    ) ERC721(name, symbol) {
        tokenCounter = 0;
        transferOwnership(initialOwner); // Set initial owner
    }

    // Mint function with token URI, only when not paused
    function mint(address to, string memory tokenURI) public onlyOwner whenNotPaused {
        uint256 tokenId = tokenCounter;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);

        // Store token URI in the mapping
        _tokenURIs[tokenId] = tokenURI;

        tokenCounter += 1;
    }

    // Function to retrieve the URI of a specific token
    function getTokenURI(uint256 tokenId) public view returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        return _tokenURIs[tokenId];
    }

    // Function to retrieve all minted token URIs
    function getAllTokenURIs() public view returns (string[] memory) {
        string[] memory uris = new string[](tokenCounter);
        for (uint256 i = 0; i < tokenCounter; i++) {
            uris[i] = _tokenURIs[i];
        }
        return uris;
    }

    // Pause the contract (only by owner)
    function pause() public onlyOwner {
        _pause();
    }

    // Unpause the contract (only by owner)
    function unpause() public onlyOwner {
        _unpause();
    }

    // Override _beforeTokenTransfer to check pause state
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override {
        super._beforeTokenTransfer(from, to, tokenId);
        require(!paused(), "Token transfer while paused");
    }
}