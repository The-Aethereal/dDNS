// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../src/dDNS.sol";

contract DeploydDNS is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        dDNS dDNSContract = new dDNS();

        vm.stopBroadcast();
        console.log("dDNS deployed to:", address(dDNSContract));
    }
}