// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

interface IDDNSService {
    function makeCommitment(string calldata domain, string calldata topLevel) external payable;
    function register(string calldata domain, string calldata topLevel, bytes15 ip, bytes32 commitment) external payable;
    function renew(string calldata domain, string calldata topLevel) external payable;
    function updateIP(string calldata domain, string calldata topLevel, bytes15 newIP) external;
    function transferOwnership(string calldata domain, string calldata topLevel, address newOwner) external;
    function getPrice(string calldata domain) external view returns (uint256);
    function getDomainDetails(string calldata domain, string calldata topLevel) external view returns (address owner, bytes15 ip, uint256 expires);
}
