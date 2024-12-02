// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {MyTokenFac} from "./MyTokenFac.sol";

contract MyTokenFactory{

    struct tokensArch{
        string name ;
        string _symbol;
         uint8 _decimals;
        uint256 _initialSupply;
        address tokenAddress;         
    }
    
    uint public tokenCount; 

    mapping (uint => tokensArch) public tokens;
 
   event tokencreated(string name, string _symbol, uint8 _decimals, uint256 _initialSupply, address tokenAddress);

    function mintTokenContract(string memory _name, string memory _symbol, uint8 _decimals, uint256 _initialSupply) public {
        MyTokenFac token = new MyTokenFac(_name, _symbol, _decimals, _initialSupply);
        tokens[tokenCount] = tokensArch(_name, _symbol, _decimals, _initialSupply, address(token)); 
        tokenCount++;       
    }

    function getTokenData(uint _index) public view returns(tokensArch memory){
        return tokens[_index];
    }

    function getTokenAddress(string memory _name) public view returns(address tokenAddress){
      for(uint i = 0; i < tokenCount; i++){
          if(keccak256(abi.encodePacked(tokens[i].name)) == keccak256(abi.encodePacked(_name))){
              return tokens[i].tokenAddress;
          }
      } 
    }
}