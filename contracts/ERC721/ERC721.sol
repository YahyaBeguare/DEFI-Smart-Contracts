// SPDX License Identifier: MIT

pragma solidity ^0.8.20;

import {IERC721} from "./IERC721.sol";
// import {IERC165} from "./IERC721.sol"; 
import {IERC721Receiver} from "./IERC721Receiver.sol";

 

contract ERC721 is IERC721 {
    mapping (uint256 => address) private _owners;
    mapping (address => uint256) private _balanceOf;
    mapping (uint256 => address) private _tokenApprovals;
    mapping (address => mapping (address => bool)) private isApprovedForAll;

    function supportsInterface(bytes4 interfaceId) external view returns (bool) {
        return interfaceId == type(IERC721).interfaceId || interfaceId == type(IERC165).interfaceId;
    }

     function balanceOf(address owner) external view returns (uint256 balance){
        require(owner != address(0), "ERC721: balance query for the zero address");
        return _balanceOf[owner];
     }
     function ownerOf(uint256 tokenId) external view returns (address ){
        address owner = _owners[tokenId];
        require(owner != address(0), "ERC721: owner query for nonexistent token");
        return owner;

     }
     function transferFrom(address from, address to, uint256 tokenId) public{
        require(_isApprovedOrOwner(msg.sender, tokenId), "ERC721: transfer caller is not owner nor approved");
        require(_owners[tokenId] == from, "ERC721: transfer of token that is not own");
        require(to != address(0), "ERC721: transfer to the zero address");
        _balanceOf[from]-- ; 
        _balanceOf[to]++ ;
        _owners[tokenId] = to;
        emit Transfer(from, to, tokenId);
        emit Approval(from, to, tokenId);

     }
    function safeTransferFrom(address from, address to, uint256 tokenId) external{
        transferFrom(from, to, tokenId, "");
        require(to.code.length == 0 || IERC721Receiver(to).onERC721Received(msg.sender, from, tokenId, "") == IERC721Receiver.onERC721Received.selector, "unsafe recipient");
    }

    function safeTransferFrom(address from, address to, uint256 tokenId, bytes calldata data) external{
         transferFrom(from, to, tokenId, "");
        require(to.code.length == 0 || IERC721Receiver(to).onERC721Received(msg.sender, from, tokenId, data) == IERC721Receiver.onERC721Received.selector, "unsafe recipient");
    
    }
   
    function approve(address to, uint256 tokenId) external{
        address owner = _owners(tokenId); 
       
        require(msg.sender == owner || isApprovedForAll[owner][msg.sender], "ERC721: approve caller is not owner nor approved for all");
        _tokenApprovals[tokenId] = to;
        emit Approval(owner, to, tokenId);
    }
    function getApproved(uint256 tokenId) external view returns (address operator){
        require(_owners[tokenId] != address(0), "ERC721: approved query for nonexistent token");
        return _tokenApprovals[tokenId];
    }

    function _isApprovedOrOwner(address owner, address spender, uint256 tokenId) internal view returns (bool){
       return (spender == owner || _tokenApprovals(tokenId) == spender || isApprovedForAll[owner][spender]);
    }

    function setApprovalForAll(address operator, bool _approved) external{
        isApprovedForAll[msg.sender][operator] = _approved;
        emit ApprovalForAll(msg.sender, operator, _approved);
    }

    function _mint(address to, uint256 tokenId) internal{
        require(to != address(0), "ERC721: mint to the zero address");
        require(_owners[tokenId] == address(0), "ERC721: token already minted");
        _balanceOf[to]++;
        _owners[tokenId] = to;
        emit Transfer(address(0), to, tokenId);
    }

    function _burn(uint256 tokenId) internal{
        address owner = _owners[tokenId];
        require(owner != address(0), "ERC721: burn of token that is not own");
        _balanceOf[owner]--;
        delete _owners[tokenId];
        delete _tokenApprovals[tokenId];
        emit Transfer(owner, address(0), tokenId);
    }
}

