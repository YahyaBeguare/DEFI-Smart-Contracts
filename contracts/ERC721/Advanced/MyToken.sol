// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyToken is ERC721, ERC721Pausable, Ownable {
    
    // Base URI for the collection
    string private _baseTokenURI;

    // Mapping for token-specific URIs (optional, for unique tokens)
    mapping(uint256 => string) private _tokenURIs; 

    constructor(address initialOwner, string memory name_, string memory symbol_, string memory baseURI_) ERC721(name_, symbol_) Ownable(initialOwner) {
        _baseTokenURI = baseURI_;
    }

    // Override the _baseURI function
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }
    
    /**
     * @dev Returns whether `tokenId` exists.
     * Tokens exist if they are owned by any address other than the zero address.
    */
    // function _exists(uint256 tokenId) internal view virtual  returns (bool) {
    //     return _exists(tokenId);
    // }

    // Function to set a specific token's URI (optional)
    function setTokenURI(uint256 _tokenId, string memory _tokenURI) public {
        require(_exists(_tokenId), "ERC721Metadata: URI set of nonexistent token");
        _tokenURIs[_tokenId] = _tokenURI;
    }

    // Override tokenURI to include token-specific URIs if set
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        string memory tokenSpecificURI = _tokenURIs[tokenId];
        if (bytes(tokenSpecificURI).length > 0) {
            return tokenSpecificURI;
        }

        string memory base = _baseURI();
        return bytes(base).length > 0 ? string(abi.encodePacked(base, tokenId.toString(), ".json")) : "";
    }

    // Example mint function
    function mint(address to, uint256 tokenId) public {
        _safeMint(to, tokenId);
    }
    // ++++++++++++++++++++++++

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function safeMint(address to, uint256 tokenId) public onlyOwner {
        _safeMint(to, tokenId);
    }

    // The following functions are overrides required by Solidity.

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Pausable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }
}
