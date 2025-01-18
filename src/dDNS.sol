// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract dDNS {
    mapping(string => address) public domains;
    mapping(address => string) public reverseDomains;

    event DomainRegistered(string indexed domain, address indexed owner);
    event DomainTransferred(string indexed domain, address indexed newOwner);

    function registerDomain(string memory domain) external {
        require(domains[domain] == address(0), "Domain already registered");
        domains[domain] = msg.sender;
        reverseDomains[msg.sender] = domain;
        emit DomainRegistered(domain, msg.sender);
    }

    function transferDomain(string memory domain, address newOwner) external {
        require(domains[domain] == msg.sender, "You are not the owner of the domain");
        domains[domain] = newOwner;
        reverseDomains[newOwner] = domain;
        emit DomainTransferred(domain, newOwner);
    }

    function resolveDomain(string memory domain) external view returns (address) {
        return domains[domain];
    }

    function reverseResolve(address addr) external view returns (string memory) {
        return reverseDomains[addr];
    }
}