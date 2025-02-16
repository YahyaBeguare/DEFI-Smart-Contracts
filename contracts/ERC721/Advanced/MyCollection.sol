// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";


contract MyCollection is ERC721, ERC721URIStorage, Ownable, ERC721Pausable {
    uint256 public cost;
    uint256 public tokenCounter;
    string private _collectionMetadataURI; // Variable for collection-level metadata

    event Withdraw(address indexed owner, uint256 amount);

    // Constructor to initialize collection details and transfer ownership
    constructor(
        string memory name, 
        string memory symbol, 
        address initialOwner,
        string memory initialMetadataURI,
        uint256 _cost 
    ) ERC721(name, symbol) Ownable(initialOwner) { 
        tokenCounter = 0;
       _collectionMetadataURI = initialMetadataURI;
        cost = _cost;
    }

    // Function to mint new NFTs (when not paused)
    function mint(address to, string memory newTokenURI) public payable  whenNotPaused {
        if (msg.sender != owner()) {
            require(msg.value >= cost, "Insufficient funds"); 
        }
        
        uint256 tokenId = tokenCounter;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, newTokenURI);
        tokenCounter += 1;
    }

    // Function to set collection-level metadata (onlyOwner)
    function setCollectionMetadataURI(string memory newMetadataURI) public onlyOwner {
        _collectionMetadataURI = newMetadataURI;
    }

    // Function to retrieve collection-level metadata
    function collectionMetadataURI() public view returns (string memory) {
        return _collectionMetadataURI;
    }

    // Retrieve all token URIs
    function getAllTokenURIs() public view returns (string[] memory) {
        string[] memory uris = new string[](tokenCounter);
        for (uint256 i = 0; i < tokenCounter; i++) {
            uris[i] = tokenURI(i);
        }
        return uris;
    }

    // Pausable functionality
    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    // Override tokenURI to resolve conflicts between ERC721 and ERC721URIStorage
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

     function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Pausable) returns (address)
    {      
        return super._update(to, tokenId, auth);
    }      
    
    // Override supportsInterface for compatibility with ERC721URIStorage
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function burn(uint256 tokenId) public {
    // Ensure the contract is not paused before burning
    require(!paused(), "Contract is paused, cannot burn token");
    // Retrieve the token owner (this reverts if the token doesn't exist)
    address tokenOwner = ownerOf(tokenId);
    // Check that the caller is either the owner or an approved operator
    require(_isAuthorized(tokenOwner, _msgSender(), tokenId), "Caller is not owner nor approved");
    // Burn the token (ERC721URIStorage's _burn clears the token URI)
    _burn(tokenId);
    }

    // Allow the owner to withdraw the contract funds 
    function withdraw() public onlyOwner {
        uint256 balance= address(this).balance ;
        require(balance>0, "No funds to withdraw");
        payable(owner()).transfer(balance);
        emit Withdraw(owner(), balance);
    }
}


