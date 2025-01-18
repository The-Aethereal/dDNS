// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/dDNS.sol";

contract dDNSTest is Test {
    dDNS dDNSContract;

    function setUp() public {
        dDNSContract = new dDNS();
    }

    function testRegisterDomain() public {
        string memory domain = "example.eth";
        dDNSContract.registerDomain(domain);
        assertEq(dDNSContract.resolveDomain(domain), address(this));
    }

    function testTransferDomain() public {
        string memory domain = "example.eth";
        dDNSContract.registerDomain(domain);
        address newOwner = address(1);
        dDNSContract.transferDomain(domain, newOwner);
        assertEq(dDNSContract.resolveDomain(domain), newOwner);
    }

    function testReverseResolve() public {
        string memory domain = "example.eth";
        dDNSContract.registerDomain(domain);
        assertEq(dDNSContract.reverseResolve(address(this)), domain);
    }
}