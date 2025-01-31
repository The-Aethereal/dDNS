// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./Ownable.sol";

/**
 * @title Destructible
 * @dev Contract that allows owner to recover funds
 */
contract Destructible is Ownable {
    /**
     * @dev Emergency function to recover funds and disable contract
     */
    function emergencyWithdraw() external onlyOwner {
        uint balance = address(this).balance;
        payable(owner()).transfer(balance);
        // Add any additional cleanup logic here
        revert("Emergency withdrawal executed");
    }
}
