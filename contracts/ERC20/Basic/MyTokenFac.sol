// SPDX-License-Identifier: MIT

pragma solidity ^0.8.21;

/**
 * @title MyTokenFac
 * @dev A factory contract for creating ERC20-like tokens with customizable properties.
 * Developed by YAHYA BEGUARE.
 */
contract MyTokenFac {
    // Token properties
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;

    // Balances for each account
    mapping(address => uint256) public balanceOf;

    // Allowance for each owner => spender pair
    mapping(address => mapping(address => uint256)) public allowed;

    // Events for Transfer and Approval
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    /**
     * @dev Constructor that sets the token's name, symbol, decimals, and total supply.
     * The total supply is assigned to the creator's balance.
     * @param _name The name of the token.
     * @param _symbol The symbol of the token.
     * @param _decimals The number of decimals the token will have.
     * @param _totalSupply The total supply of the token (in base units).
     */
    constructor(string memory _name, string memory _symbol, uint8 _decimals, uint256 _totalSupply) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        totalSupply = _totalSupply * (10 ** uint256(decimals));
        balanceOf[msg.sender] = totalSupply;
    }

    /**
     * @dev Modifier to ensure the address is not zero.
     * @param _address The address to validate.
     */
    modifier validAddress(address _address) {
        require(_address != address(0), "Invalid address");
        _;
    }

    /**
     * @dev Transfers tokens from the caller's account to a specified address.
     * Emits a Transfer event.
     * @param _to The address to transfer to.
     * @param value The amount of tokens to transfer.
     */
    function transfer(address _to, uint256 value) public validAddress(_to) returns (bool) {
        require(balanceOf[msg.sender] >= value, "Insufficient balance");
        balanceOf[msg.sender] -= value;
        balanceOf[_to] += value;
        emit Transfer(msg.sender, _to, value);
        return true;
    }

    /**
     * @dev Approves the specified address to spend a certain amount of tokens on behalf of the caller.
     * Emits an Approval event.
     * @param _spender The address which will spend the funds.
     * @param value The amount of tokens to approve.
     */
    function approve(address _spender, uint256 value) public validAddress(_spender) returns (bool) {
        allowed[msg.sender][_spender] = value; 
        emit Approval(msg.sender, _spender, value);
        return true;
    }

    /**
     * @dev Transfers tokens on behalf of another address using the allowance mechanism.
     * Emits a Transfer event.
     * @param _from The address to transfer from.
     * @param _to The address to transfer to.
     * @param value The amount of tokens to transfer.
     */
    function transferFrom(address _from, address _to, uint256 value) public validAddress(_to) returns (bool) {
        require(balanceOf[_from] >= value, "Insufficient balance");
        require(allowed[_from][msg.sender] >= value, "Insufficient allowance");
        balanceOf[_from] -= value;
        balanceOf[_to] += value;
        allowed[_from][msg.sender] -= value;
        emit Transfer(_from, _to, value);
        return true;
    }

    /**
     * @dev Returns the amount the spender is still allowed to withdraw from the owner's account.
     * @param _spender The address which will spend the funds.
     * @param _owner The address which owns the funds.
     * @return remaining The remaining amount the spender is allowed to spend.
     */
    function allowance(address _spender, address _owner) public view returns (uint256 remaining) {
        return allowed[_owner][_spender];
    }
}
