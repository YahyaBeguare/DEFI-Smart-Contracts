// SPDX-License-Identifier: MIT

pragma solidity ^0.8.21;

import "./IERC20.sol";	
/**
 * @title ZeroToken
 * @dev Implementation of an ERC20 token with minting and burning functionalities.
 * Developed by YAHYA BEGUARE.
 */
contract ZeroToken is IERC20 {
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 private _totalSupply;
    address public owner;

    // Mapping of account balances
    mapping (address => uint256) private balances;

    // Mapping of allowances: owner => (spender => amount)
    mapping (address => mapping(address => uint256)) private allowed;


    // Modifier to restrict certain functions to the contract owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

     /**
     * @dev Constructor sets the token name, symbol, decimals, and initial supply.
     * The initial supply is allocated to the deployer's address.
     * The ownership of the contract is also set to the deployer's address.
     */
    constructor(string memory _name, string memory _symbol, uint8 _decimals, uint256 initialSupply) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        _totalSupply = initialSupply * (10 ** uint256(decimals));
        balances[msg.sender] = _totalSupply;
        owner = msg.sender;
    }

    /**
     * @dev Returns the total token supply.
     */
    function totalSupply() external view override returns (uint256) {
        return _totalSupply;
    }
    /**
     * @dev Returns the account balance of a specific address.
     * @param account The address to query the balance of.
     */
    function balanceOf(address account) external view override returns (uint256) {
        return balances[account];
    }

    /**
     * @dev Transfers tokens to a specified address.
     * Emits a Transfer event.
     * @param recipient The address to transfer to.
     * @param amount The amount to transfer.
     */
    function transfer(address recipient, uint256 amount) external override returns (bool) {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        balances[recipient] += amount;
        emit Transfer(msg.sender, recipient, amount);
        return true; 
    }

    /**
     * @dev Returns the amount that the spender is allowed to withdraw from the owner's account.
     * @param _owner The address that owns the funds.
     * @param _spender The address that will spend the funds.
     */
    function allowance(address _owner, address _spender) external view override returns (uint256) {
        return allowed[_owner][_spender];
    }

    /**
     * @dev Approves a spender to transfer tokens from the caller's account.
     * Emits an Approval event.
     * @param spender The address which will spend the funds.
     * @param amount The amount of tokens to be spent.
     */
    function approve(address spender, uint256 amount) external override returns (bool) {
        require(spender != address(0), "Invalid spender address");
        allowed[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    /**
     * @dev Transfers tokens on behalf of another address.
     * Emits a Transfer event.
     * @param sender The address which is providing the tokens.
     * @param recipient The address which is receiving the tokens.
     * @param amount The amount of tokens to transfer.
     */
    function transferFrom(address sender, address recipient, uint256 amount) external override returns (bool) {
        require(balances[sender] >= amount, "Insufficient balance");
        require(allowed[sender][msg.sender] >= amount, "Insufficient allowance");
        balances[sender] -= amount;
        balances[recipient] += amount;
        allowed[sender][msg.sender] -= amount;
        emit Transfer(sender, recipient, amount);
        return true;
    }
    
    /**
     * @dev Mints new tokens, increasing the total supply.
     * Only the owner can call this function.
     * Emits a Transfer event.
     * @param account The address to receive the minted tokens.
     * @param amount The amount of tokens to mint.
     */
    function mint(address account, uint256 amount) external override onlyOwner returns (bool) {
        require(account != address(0), "Invalid account address");
        balances[account] += amount;
        _totalSupply += amount;
        emit Transfer(address(0), account, amount);
        return true;
    } 

    /**
     * @dev Burns tokens from an account, reducing the total supply.
     * Only callable internally.
     * Emits a Transfer event.
     * @param account The address whose tokens will be burned.
     * @param amount The amount of tokens to burn.
     */
    function _burn(address account, uint256 amount) internal returns (bool) {
        require(balances[account] >= amount, "Insufficient balance");
        balances[account] -= amount;
        _totalSupply -= amount;
        emit Transfer(account, address(0), amount);
        return true;
    }

    /**
     * @dev Public function to burn tokens from the caller's account.
     * @param amount The amount of tokens to burn.
     */
    function burn(uint256 amount) external override returns (bool) {
        return _burn(msg.sender, amount);
    }
    
    /**
     * @dev Burns tokens from another account with allowance.
     * Emits a Transfer event.
     * @param account The address whose tokens will be burned.
     * @param amount The amount of tokens to burn.
     */
    function burnFrom(address account, uint256 amount) external override returns (bool) {
        require(allowed[account][msg.sender] >= amount, "Insufficient allowance");
        allowed[account][msg.sender] -= amount;
        return _burn(account, amount);
    }
}
