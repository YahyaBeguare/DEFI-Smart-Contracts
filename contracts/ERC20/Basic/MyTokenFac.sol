// SPDX-License-Identifier: MIT

pragma solidity ^0.8.21;


contract MyTokenFac {

string public name ;
string public symbol;   
uint8 public decimals;

constructor(string memory _name , string memory _symbol,  uint8 _decimals, uint256 _totalSupply) {
    name = _name;
    symbol = _symbol;
    decimals = _decimals;
    balanceOf[msg.sender] = _totalSupply;
    
}


mapping(address => uint256) public balanceOf;
mapping(address => mapping(address => uint256)) public allowed;

event Transfer(address indexed from, address indexed to, uint256 value);
event Approval(address indexed owner, address indexed spender, uint256 value);

modifier validAddress(address _address) {
    require(_address != address(0), "Invalid address");
    _;
}


// transfer funds to a specified address
 

function transfer(address _to, uint256 value) public validAddress( _to) returns(bool) {
    require(balanceOf[msg.sender]>= value, "Insufficient balance");
    balanceOf[msg.sender] -= value;
    balanceOf[_to] += value;
    emit Transfer(msg.sender, _to, value);
    return true;
    
}

// approve the passed address to spend the specified amount of tokens on behalf of msg.sender .
function approve(address _spender, uint256 value) public validAddress(_spender) returns(bool) {
    
    allowed[msg.sender][_spender] = value; 
    emit Approval(msg.sender, _spender, value);
    return true;
}

// transfer of an allowed value from the owner to the approved spender .
function transferFrom(address _from, address _to, uint256 value) public  validAddress(_to) returns(bool) {
    require(balanceOf[_from] >= value, "Insufficient balance");
    require(allowed[_from][msg.sender] >= value, "Insufficient allowance");
    balanceOf[_from] -= value;
    balanceOf[_to] += value;
    allowed[_from][msg.sender] -= value;
    emit Transfer(_from, _to, value);
    return true;

}

// returns the amount that the spender still allowed to withdraw from the owner
function allowance(address _spender, address _owner) public view returns(uint256 remaining){
    return allowed[_owner][_spender] ;
    
}
}