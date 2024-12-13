// SPDX License Identifier: MIT

pragma solidity ^0.8.20;

// Import the IERC721Receiver interface, which is used for safe transfers to contracts
import {IERC721Receiver} from "./IERC721Receiver.sol";    

// Define the IERC165 interface which supports interface identification for smart contracts
interface IERC165 {
    // This function checks if a contract supports a specific interface (via interfaceId)
    function supportsInterface (bytes4 interfaceId) external view returns (bool);
}

// Define the ERC721 interface, inheriting from IERC165 for interface support
interface IERC721 is IERC165 {
    // Event to log transfers of tokens from one address to another
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);

    // Event for approval of a specific token to another address
    event Approval(address indexed owner, address indexed spender, uint256 indexed tokenId); 
    
    // Event to approve or disapprove an operator for all tokens owned by a specific address
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);

    // Function to return the balance (number of tokens) of an address
    function balanceOf(address owner) external view returns (uint256 balance);

    // Function to return the owner of a specific tokenId
    function ownerOf(uint256 tokenId) external view returns (address owner);

    // Function to safely transfer a token from one address to another
    function safeTransferFrom(address from, address to, uint256 tokenId) external;

    // Overloaded function to safely transfer a token with additional data
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes calldata data) external;

    // Function to transfer a token from one address to another without safety checks
    function transferFrom(address from, address to, uint256 tokenId) external;

    // Function to approve a spender to transfer a specific token
    function approve(address to, uint256 tokenId) external;

    // Function to get the address approved to transfer a specific token
    function getApproved(uint256 tokenId) external view returns (address operator);

    // Function to set or remove an operator approval for all tokens of the sender
    function setApprovalForAll(address operator, bool _approved) external;
}

// ERC721 token implementation that conforms to the IERC721 interface
contract ERC721 is IERC721 {
    // Mapping to store the owner of each tokenId
    mapping (uint256 => address) internal _owners;

    // Mapping to store the balance (number of tokens) of each address
    mapping (address => uint256) internal _balanceOf;

    // Mapping to store the approved address for each tokenId
    mapping (uint256 => address) internal _tokenApprovals;

    // Mapping to store the approval for all tokens from one owner to an operator
    mapping (address => mapping (address => bool)) private isApprovedForAll;

    // Public variables to store the name and symbol of the NFT collection
    string public name;
    string public symbol;

    // Constructor to initialize the name and symbol of the NFT collection
    constructor(string memory _name, string memory _symbol) {
        name = _name;
        symbol = _symbol;
    }

    // Function to check if the contract supports the ERC721 interface or ERC165 interface
    function supportsInterface(bytes4 interfaceId) external pure returns (bool) {
        return interfaceId == type(IERC721).interfaceId || interfaceId == type(IERC165).interfaceId;
    }

    // Function to check the balance of a particular address
    function balanceOf(address owner) external view returns (uint256 balance) {
        require(owner != address(0), "ERC721: balance query for the zero address");
        return _balanceOf[owner];
    }

    // Function to return the owner of a particular tokenId
    function ownerOf(uint256 tokenId) external view returns (address) {
        address owner = _owners[tokenId];
        require(owner != address(0), "ERC721: owner query for nonexistent token");
        return owner;
    }

    // Function to transfer a token from one address to another
    function transferFrom(address from, address to, uint256 tokenId) public {
        // Ensure the caller is either the owner or approved for the token
        require(_isApprovedOrOwner(from, msg.sender, tokenId), "ERC721: transfer caller is not owner nor approved");
        // Ensure the token is owned by the 'from' address
        require(_owners[tokenId] == from, "ERC721: transfer of token that is not owned");
        // Ensure the recipient address is not the zero address
        require(to != address(0), "ERC721: transfer to the zero address");

        // Update balances and ownership
        _balanceOf[from]--;
        _balanceOf[to]++;
        _owners[tokenId] = to;

        // Emit Transfer and Approval events
        emit Transfer(from, to, tokenId);
        emit Approval(from, to, tokenId);
    }

    // Safe transfer function to ensure the recipient can handle ERC721 tokens
    function safeTransferFrom(address from, address to, uint256 tokenId) external {
        transferFrom(from, to, tokenId);
        // Check if recipient is a smart contract and if it can handle the token
        require(to.code.length == 0 || IERC721Receiver(to).onERC721Received(msg.sender, from, tokenId, "") == IERC721Receiver.onERC721Received.selector, "unsafe recipient");
    }

    // Safe transfer with additional data
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes calldata data) external {
        transferFrom(from, to, tokenId);
        // Check if recipient is a smart contract and if it can handle the token
        require(to.code.length == 0 || IERC721Receiver(to).onERC721Received(msg.sender, from, tokenId, data) == IERC721Receiver.onERC721Received.selector, "unsafe recipient");
    }

    // Function to approve an address to transfer a specific tokenId
    function approve(address to, uint256 tokenId) external {
        address owner = _owners[tokenId];
        // Ensure that the caller is the owner or approved for all tokens
        require(msg.sender == owner || isApprovedForAll[owner][msg.sender], "ERC721: approve caller is not owner nor approved for all");
        _tokenApprovals[tokenId] = to;

        // Emit Approval event
        emit Approval(owner, to, tokenId);
    }

    // Function to get the approved address for a specific tokenId
    function getApproved(uint256 tokenId) external view returns (address operator) {
        require(_owners[tokenId] != address(0), "ERC721: approved query for nonexistent token");
        return _tokenApprovals[tokenId];
    }

    // Internal function to check if the spender is the owner or is approved to spend the token
    function _isApprovedOrOwner(address owner, address spender, uint256 tokenId) internal view returns (bool) {
        return (spender == owner || _tokenApprovals[tokenId] == spender || isApprovedForAll[owner][spender]);
    }

    // Function to set or remove approval for an operator to manage all tokens of the sender
    function setApprovalForAll(address operator, bool _approved) external {
        isApprovedForAll[msg.sender][operator] = _approved;
        // Emit ApprovalForAll event
        emit ApprovalForAll(msg.sender, operator, _approved);
    }

    // Internal function to mint a new token for a given address
    function _mint(address to, uint256 tokenId) internal {
        require(to != address(0), "ERC721: mint to the zero address");
        require(_owners[tokenId] == address(0), "ERC721: token already minted");

        // Update balances and ownership
        _balanceOf[to]++;
        _owners[tokenId] = to;

        // Emit Transfer event indicating token creation
        emit Transfer(address(0), to, tokenId);
    }

    // Internal function to burn a token (destroy it) from a given tokenId
    function _burn(uint256 tokenId) internal {
        address owner = _owners[tokenId];
        require(owner != address(0), "ERC721: burn of token that is not owned");

        // Update balances and delete ownership data
        _balanceOf[owner]--;
        delete _owners[tokenId];
        delete _tokenApprovals[tokenId];

        // Emit Transfer event indicating token destruction
        emit Transfer(owner, address(0), tokenId);
    }
}
