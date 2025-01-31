// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/**
 * @title SafeMath
 * @dev Library for overflow/underflow-protected math operations
 */
library SafeMath {
    /**
     * @dev Multiplies two numbers, throws on overflow
     */
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        return a * b;
    }

    /**
     * @dev Integer division, truncates quotient
     */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        return a / b;
    }
    
    /**
     * @dev Subtracts two numbers, throws on underflow
     */
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        return a - b;
    }
    
    /**
     * @dev Adds two numbers, throws on overflow
     */
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        return a + b;
    }
}
