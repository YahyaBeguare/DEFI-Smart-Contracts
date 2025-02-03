// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {ERC721} from "./ERC721.sol";

contract MyNFT is ERC721 {
    // Mapping tokenId to metadata URI
    mapping(uint256 => string) private _tokenURIs;

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {} 

    // Mint function to create an NFT with metadata
    function mint(address to, uint256 tokenId, string memory tokenURI_) external {
        _mint(to, tokenId); // Mint the token
        _setTokenURI(tokenId, tokenURI_); // Set the metadata URI
    }

    // Internal function to store the token URI
    function _setTokenURI(uint256 tokenId, string memory tokenURI_) internal {
        _tokenURIs[tokenId] = tokenURI_;
    }

    // Public function to retrieve token URI
    function tokenURI(uint256 tokenId) public view  returns (string memory) {
        require(_owners[tokenId] != address(0), "ERC721Metadata: URI query for nonexistent token");
        return _tokenURIs[tokenId];
    }
}
