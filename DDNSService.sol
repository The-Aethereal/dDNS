// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./common/Ownable.sol";
import "./common/Destructible.sol";
import "./libs/SafeMath.sol";

contract DDNSService is Destructible {
    using SafeMath for uint256;

    struct DomainDetails {
        bytes name;
        bytes12 topLevel;
        address owner;
        bytes15 ip;
        uint expires;
    }

    struct Receipt {
        uint amountPaidWei;
        uint timestamp;
        uint expires;
    }

    uint public constant DOMAIN_NAME_COST = 1 ether;
    uint public constant DOMAIN_NAME_COST_SHORT_ADDITION = 1 ether;
    uint public constant DOMAIN_EXPIRATION_DATE = 365 days;
    uint8 public constant DOMAIN_NAME_MIN_LENGTH = 5;
    uint8 public constant DOMAIN_NAME_EXPENSIVE_LENGTH = 8;
    uint8 public constant TOP_LEVEL_DOMAIN_MIN_LENGTH = 1;
    bytes1 public constant BYTES_DEFAULT_VALUE = bytes1(0x00);

    mapping(bytes32 => DomainDetails) public domainNames;
    mapping(address => bytes32[]) public paymentReceipts;
    mapping(bytes32 => Receipt) public receiptDetails;

    modifier isAvailable(bytes memory domain, bytes12 topLevel) {
        bytes32 domainHash = getDomainHash(domain, topLevel);
        require(
            domainNames[domainHash].expires < block.timestamp,
            "Domain name is not available."
        );
        _;
    }

    modifier collectDomainNamePayment(bytes memory domain) {
        uint domainPrice = getPrice(domain);
        require(msg.value >= domainPrice, "Insufficient amount.");
        _;
    }

    modifier isDomainOwner(bytes memory domain, bytes12 topLevel) {
        bytes32 domainHash = getDomainHash(domain, topLevel);
        require(
            domainNames[domainHash].owner == msg.sender,
            "Not domain owner."
        );
        _;
    }

    modifier isDomainNameLengthAllowed(bytes memory domain) {
        require(
            domain.length >= DOMAIN_NAME_MIN_LENGTH,
            "Domain name too short."
        );
        _;
    }

    modifier isTopLevelLengthAllowed(bytes12 topLevel) {
        require(
            topLevel.length >= TOP_LEVEL_DOMAIN_MIN_LENGTH,
            "TLD too short."
        );
        _;
    }

    event LogDomainNameRegistered(uint indexed timestamp, bytes domainName, bytes12 topLevel);
    event LogDomainNameRenewed(uint indexed timestamp, bytes domainName, bytes12 topLevel, address indexed owner);
    event LogDomainNameEdited(uint indexed timestamp, bytes domainName, bytes12 topLevel, bytes15 newIp);
    event LogDomainNameTransferred(uint indexed timestamp, bytes domainName, bytes12 topLevel, address indexed owner, address newOwner);
    event LogPurchaseChangeReturned(uint indexed timestamp, address indexed _owner, uint amount);
    event LogReceipt(uint indexed timestamp, bytes domainName, uint amountInWei, uint expires);

    constructor() {
        // Initialization logic if needed
    }

    function register(
        bytes memory domain,
        bytes12 topLevel,
        bytes15 ip
    ) public payable 
        isDomainNameLengthAllowed(domain)
        isTopLevelLengthAllowed(topLevel)
        isAvailable(domain, topLevel)
        collectDomainNamePayment(domain)
    {
        bytes32 domainHash = getDomainHash(domain, topLevel);
        
        domainNames[domainHash] = DomainDetails({
            name: domain,
            topLevel: topLevel,
            owner: msg.sender,
            ip: ip,
            expires: block.timestamp + DOMAIN_EXPIRATION_DATE
        });

        bytes32 receiptKey = getReceiptKey(domain, topLevel);
        paymentReceipts[msg.sender].push(receiptKey);
        
        receiptDetails[receiptKey] = Receipt({
            amountPaidWei: DOMAIN_NAME_COST,
            timestamp: block.timestamp,
            expires: block.timestamp + DOMAIN_EXPIRATION_DATE
        });

        emit LogReceipt(block.timestamp, domain, DOMAIN_NAME_COST, block.timestamp + DOMAIN_EXPIRATION_DATE);
        emit LogDomainNameRegistered(block.timestamp, domain, topLevel);
    }

    function renewDomainName(
        bytes memory domain,
        bytes12 topLevel
    ) public payable 
        isDomainOwner(domain, topLevel)
        collectDomainNamePayment(domain)
    {
        bytes32 domainHash = getDomainHash(domain, topLevel);
        domainNames[domainHash].expires += DOMAIN_EXPIRATION_DATE;

        bytes32 receiptKey = getReceiptKey(domain, topLevel);
        paymentReceipts[msg.sender].push(receiptKey);
        
        receiptDetails[receiptKey] = Receipt({
            amountPaidWei: DOMAIN_NAME_COST,
            timestamp: block.timestamp,
            expires: block.timestamp + DOMAIN_EXPIRATION_DATE
        });

        emit LogDomainNameRenewed(block.timestamp, domain, topLevel, msg.sender);
        emit LogReceipt(block.timestamp, domain, DOMAIN_NAME_COST, block.timestamp + DOMAIN_EXPIRATION_DATE);
    }

    function edit(
        bytes memory domain,
        bytes12 topLevel,
        bytes15 newIp
    ) public isDomainOwner(domain, topLevel) {
        bytes32 domainHash = getDomainHash(domain, topLevel);
        domainNames[domainHash].ip = newIp;
        emit LogDomainNameEdited(block.timestamp, domain, topLevel, newIp);
    }

    function transferDomain(
        bytes memory domain,
        bytes12 topLevel,
        address newOwner
    ) public isDomainOwner(domain, topLevel) {
        require(newOwner != address(0), "Invalid new owner");
        bytes32 domainHash = getDomainHash(domain, topLevel);
        domainNames[domainHash].owner = newOwner;
        emit LogDomainNameTransferred(block.timestamp, domain, topLevel, msg.sender, newOwner);
    }

    function getIP(
        bytes memory domain,
        bytes12 topLevel
    ) public view returns (bytes15) {
        return domainNames[getDomainHash(domain, topLevel)].ip;
    }

    function getPrice(bytes memory domain) public pure returns (uint) {
        return domain.length < DOMAIN_NAME_EXPENSIVE_LENGTH 
            ? DOMAIN_NAME_COST + DOMAIN_NAME_COST_SHORT_ADDITION 
            : DOMAIN_NAME_COST;
    }

    function getReceiptList() public view returns (bytes32[] memory) {
        return paymentReceipts[msg.sender];
    }

    function getReceipt(bytes32 receiptKey) public view returns (uint, uint, uint) {
        Receipt memory receipt = receiptDetails[receiptKey];
        return (receipt.amountPaidWei, receipt.timestamp, receipt.expires);
    }

    function getDomainHash(bytes memory domain, bytes12 topLevel) public pure returns(bytes32) {
        return keccak256(abi.encodePacked(domain, topLevel));
    }

    function getReceiptKey(bytes memory domain, bytes12 topLevel) public view returns(bytes32) {
        return keccak256(abi.encodePacked(domain, topLevel, msg.sender, block.timestamp));
    }

   function withdraw() public onlyOwner {
        uint balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        payable(owner()).transfer(balance);
    }
}
