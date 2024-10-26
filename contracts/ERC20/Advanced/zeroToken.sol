// SPDX-License-Identifier: MIT

pragma solidity ^0.8.21;

import "./IERC20.sol";	

contract zeroToken is IERC20 {
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 private _totalSupply;
    address public owner;

    mapping (address => uint256) private balances;
    mapping (address => mapping(address => uint256)) private allowed;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    constructor(string memory _name, string memory _symbol, uint8 _decimals, uint256 initialSupply) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        balances[msg.sender] = initialSupply;
        _totalSupply = initialSupply;
        owner = msg.sender;
    }

    function totalSupply() external view override returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) external view override returns (uint256) {
        return balances[account];
    }

    function transfer(address recipient, uint256 amount) external override returns (bool) {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        balances[recipient] += amount;
        emit Transfer(msg.sender, recipient, amount);
        return true; 
    }

    function allowance(address _owner, address _spender) external view override returns (uint256) {
        return allowed[_owner][_spender];
    }

    function approve(address spender, uint256 amount) external override returns (bool) {
        require(spender != address(0), "Invalid spender address");
        allowed[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address sender, address recipient, uint256 amount) external override returns (bool) {
        require(balances[sender] >= amount, "Insufficient balance");
        require(allowed[sender][msg.sender] >= amount, "Insufficient allowance");
        balances[sender] -= amount;
        balances[recipient] += amount;
        allowed[sender][msg.sender] -= amount;
        emit Transfer(sender, recipient, amount);
        return true;
    }
    
    function mint(address account, uint256 amount) external override onlyOwner returns (bool) {
        require(account != address(0), "Invalid account address");
        balances[account] += amount;
        _totalSupply += amount;
        emit Transfer(address(0), account, amount);
        return true;
    } 

    function _burn(address account, uint256 amount) internal returns (bool) {
        require(balances[account] >= amount, "Insufficient balance");
        balances[account] -= amount;
        _totalSupply -= amount;
        emit Transfer(account, address(0), amount);
        return true;
    }

    function burn(uint256 amount) external override returns (bool) {
        return _burn(msg.sender, amount);
    }
    
    function burnFrom(address account, uint256 amount) external override returns (bool) {
        require(allowed[account][msg.sender] >= amount, "Insufficient allowance");
        allowed[account][msg.sender] -= amount;
        return _burn(account, amount);
    }
}
