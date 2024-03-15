// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

contract Token is ERC20, Ownable {
    /**
     * @dev Sets the values for {name} {symbol} and transfers ownership to msg.sender
     *
     * NOTE: {name} and {symbol} values are immutable: they can only be set once during
     * construction.
     */
    constructor(string memory name_, string memory symbol_) ERC20(name_, symbol_) Ownable(_msgSender()) {}

    /**
     * @dev Creates an `amount` of tokens and assigns them to `to` address, by transferring it from address(0).
     * Can only be called by the current owner.
     *
     * @param amount - amount of tokens to be minted
     * @param to - address to mint tokens to
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
