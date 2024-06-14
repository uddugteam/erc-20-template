// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

contract LimitedToken is ERC20, Ownable {
    // _maxTotalSupply is a limit for token emission.
    uint256 private _maxTotalSupply;

    /**
     * @dev Sets the values for {name} {symbol} and transfers ownership to msg.sender.
     * Sets the _maxTotalSupply value as the token emission limit.
     *
     * NOTE: {name} and {symbol} values are immutable: they can only be set once during
     * construction.
     */
    constructor(
        string memory name_,
        string memory symbol_,
        uint256 maxTotalSupply_
    ) ERC20(name_, symbol_) Ownable(msg.sender) {
        _maxTotalSupply = maxTotalSupply_;
    }

    /**
     * @dev Creates an `amount` of tokens and assigns them to `to` address, by transferring it from address(0).
     * Can only be called by the current owner. Reverts if the resulting totalSupply exceeds maxTotalSupply.
     *
     * Emits a {Transfer} event with `from` set to the zero address.
     */
    function mint(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= _maxTotalSupply, "ERC20: emission limit exceeded");
        _mint(to, amount);
    }

    /**
     * @dev Returns maxTotalSupply value.
     */
    function maxTotalSupply() external view returns (uint256) {
        return _maxTotalSupply;
    }
}
