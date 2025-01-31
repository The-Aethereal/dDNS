// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

library DomainValidator {
    error InvalidDomain();
    error InvalidTLD();

    function validate(string memory domain) internal pure {
        if (bytes(domain).length < 3) revert InvalidDomain();
        if (!_validHostname(domain)) revert InvalidDomain();
    }

    function validateTLD(string memory tld) internal pure {
        if (bytes(tld).length < 2) revert InvalidTLD();
        if (!_validHostname(tld)) revert InvalidTLD();
    }

    function _validHostname(string memory str) private pure returns (bool) {
        bytes memory b = bytes(str);
        if (b.length > 63) return false;
        
        for (uint i; i < b.length; i++) {
            bytes1 char = b[i];
            if (
                !(char >= 0x30 && char <= 0x39) && // 0-9
                !(char >= 0x41 && char <= 0x5A) && // A-Z
                !(char >= 0x61 && char <= 0x7A) && // a-z
                char != 0x2D // -
            ) {
                return false;
            }
        }
        return true;
    }
}
