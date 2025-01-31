import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './DDNSService.css';

const contractABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "AccessControlBadConfirmation",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			},
			{
				"internalType": "bytes32",
				"name": "neededRole",
				"type": "bytes32"
			}
		],
		"name": "AccessControlUnauthorizedAccount",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "InvalidDomain",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "InvalidTLD",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "string",
				"name": "domain",
				"type": "string"
			},
			{
				"indexed": true,
				"internalType": "string",
				"name": "topLevel",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "bytes15",
				"name": "ip",
				"type": "bytes15"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "expires",
				"type": "uint256"
			}
		],
		"name": "DomainRegistered",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "string",
				"name": "domain",
				"type": "string"
			},
			{
				"indexed": true,
				"internalType": "string",
				"name": "topLevel",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "newExpiry",
				"type": "uint256"
			}
		],
		"name": "DomainRenewed",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "grantRole",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "domain",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "topLevel",
				"type": "string"
			}
		],
		"name": "makeCommitment",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "pause",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "Paused",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "domain",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "topLevel",
				"type": "string"
			},
			{
				"internalType": "bytes15",
				"name": "ip",
				"type": "bytes15"
			},
			{
				"internalType": "bytes32",
				"name": "commitment",
				"type": "bytes32"
			}
		],
		"name": "register",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "domain",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "topLevel",
				"type": "string"
			}
		],
		"name": "renew",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"internalType": "address",
				"name": "callerConfirmation",
				"type": "address"
			}
		],
		"name": "renounceRole",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "revokeRole",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "previousAdminRole",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "newAdminRole",
				"type": "bytes32"
			}
		],
		"name": "RoleAdminChanged",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "account",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "RoleGranted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "account",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "RoleRevoked",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "newPrice",
				"type": "uint256"
			}
		],
		"name": "setBasePrice",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "domain",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "topLevel",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "unpause",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "Unpaused",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "domain",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "topLevel",
				"type": "string"
			},
			{
				"internalType": "bytes15",
				"name": "newIP",
				"type": "bytes15"
			}
		],
		"name": "updateIP",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "basePrice",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "DEFAULT_ADMIN_ROLE",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "DOMAIN_NAME_EXPENSIVE_LENGTH",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "DOMAIN_NAME_MIN_LENGTH",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "domain",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "topLevel",
				"type": "string"
			}
		],
		"name": "getDomainDetails",
		"outputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "bytes15",
				"name": "ip",
				"type": "bytes15"
			},
			{
				"internalType": "uint256",
				"name": "expires",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "domain",
				"type": "string"
			}
		],
		"name": "getPrice",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			}
		],
		"name": "getRoleAdmin",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "gracePeriod",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "hasRole",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "OPERATOR_ROLE",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "paused",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "registrationPeriod",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "shortNamePremium",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes4",
				"name": "interfaceId",
				"type": "bytes4"
			}
		],
		"name": "supportsInterface",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
const contractAddress = '0xb5f89f5314c56ae00bbe87ec2e08ddce7d8b30a9'; // Your deployed contract address

const DDNSService = () => {
  const [contract, setContract] = useState(null);
  const [domains, setDomains] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState('');
  const [provider, setProvider] = useState(null);
  const [currentPrice, setCurrentPrice] = useState('0');

  // Form states
  const [domainName, setDomainName] = useState('');
  const [tld, setTld] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [newOwner, setNewOwner] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [newTLD, setNewTLD] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [contractOwner, setContractOwner] = useState('');

  // Constants from contract
  const [constants, setConstants] = useState({
    minLength: 0,
    expiration: 0,
    baseCost: 0,
    shortAddon: 0
  });

  const loadDomains = async (contractInstance) => {
	try {
	  const receiptKeys = await contractInstance.getReceiptList();
	  const domains = await Promise.all(
		receiptKeys.map(async (key) => {
		  const receipt = await contractInstance.getReceipt(key);
		  return { key, ...receipt };
		})
	  );
	  setDomains(domains);
	} catch (err) {
	  setError(`Error loading domains: ${err.message}`);
	}
  };
  
  const loadReceipts = async (contractInstance) => {
	try {
	  const receiptKeys = await contractInstance.getReceiptList();
	  const receipts = await Promise.all(
		receiptKeys.map(async (key) => {
		  try {
			return await contractInstance.getReceipt(key);
		  } catch (err) {
			console.error("Failed to load receipt:", key, err);
			return null;
		  }
		})
	  );
	  setReceipts(receipts.filter(r => r !== null));
	} catch (err) {
	  setError(`Error loading receipts: ${err.message}`);
	}
  };
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        setError('Please install MetaMask!');
        return;
      }
      
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      setAccount(accounts[0]);
      
      const newProvider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(newProvider);

      window.ethereum.on('accountsChanged', (newAccounts) => {
        setAccount(newAccounts[0] || '');
        if (newAccounts.length === 0) {
          setProvider(null);
          setContract(null);
        }
      });

    } catch (err) {
      setError(`Connection failed: ${err.message}`);
    }
  };

  const ipToBytes15 = (ipString) => {
	// Convert IPv4 to 4 bytes
	const ipv4Bytes = ethers.utils.arrayify(
	  ethers.utils.hexlify(
		new Uint8Array(ipString.split('.').map(Number))
	  )
	);
	
	// Pad to 15 bytes (12 null bytes after IPv4)
	const paddedBytes = new Uint8Array(15);
	paddedBytes.set(ipv4Bytes);
	return ethers.utils.hexlify(paddedBytes);
  };

  const isValidIPv4 = (ip) => {
	const pattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/;
	return pattern.test(ip);
  };

  useEffect(() => {
	const init = async () => {
	  if (!provider || !account) return;
  
	  try {
		const signer = provider.getSigner();
		const contractInstance = new ethers.Contract(
		  contractAddress,
		  contractABI,
		  signer
		);
  
		// Load core contract data
		await loadConstants(contractInstance);
		await loadContractOwner(contractInstance);
		setContract(contractInstance);
		
		// Load dynamic data
		await Promise.all([
		  loadDomains(contractInstance),
		  loadReceipts(contractInstance),
		  loadEvents(contractInstance)
		]);
  
		// Price tracking listener
		const updatePrice = async () => {
		  if (domainName) {
			try {
			  const price = await contractInstance.getPrice(domainName);
			  setCurrentPrice(ethers.utils.formatEther(price));
			} catch (err) {
			  console.error("Price check error:", err);
			}
		  }
		};
  
		// Initial price check
		await updatePrice();
		
		// Event listeners with error handling
		const onRegistered = () => {
		  loadDomains(contractInstance);
		  updatePrice();
		};
  
		contractInstance.on('DomainRegistered', onRegistered);
		contractInstance.on('DomainRenewed', onRegistered);
  
		// Cleanup
		return () => {
		  contractInstance.off('DomainRegistered', onRegistered);
		  contractInstance.off('DomainRenewed', onRegistered);
		};
  
	  } catch (err) {
		setError(`Initialization error: ${err.message}`);
	  }
	};
  
	init();
	
	return () => {
	  if (contract) {
		contract.removeAllListeners();
	  }
	};
  }, [provider, account]); // ✅ Maintain core dependencies
  
  // Separate effect for price updates on domain name change
  useEffect(() => {
	if (contract && domainName) {
	  const fetchPrice = async () => {
		try {
		  const price = await contract.getPrice(domainName);
		  setCurrentPrice(ethers.utils.formatEther(price));
		} catch (err) {
		  console.error("Price update error:", err);
		}
	  };
	  
	  const debounceTimer = setTimeout(fetchPrice, 300);
	  return () => clearTimeout(debounceTimer);
	}
  }, [domainName, contract]); // ✅ Track domain name changes
  
  // Modified loading functions to accept contract instance
  const loadConstants = async (contractInstance) => {
	try {
	  const minLength = await contractInstance.DOMAIN_NAME_MIN_LENGTH();
	  const expiration = await contractInstance.DOMAIN_EXPIRATION_DATE();
	  const baseCost = await contractInstance.DOMAIN_NAME_COST();
	  const shortAddon = await contractInstance.DOMAIN_NAME_COST_SHORT_ADDITION();
	  
	  setConstants({
		minLength: minLength.toNumber(),
		expiration: expiration.toNumber(),
		baseCost: ethers.utils.formatEther(baseCost),
		shortAddon: ethers.utils.formatEther(shortAddon)
	  });
	} catch (err) {
	  setError(`Error loading constants: ${err.message}`);
	}
  };
  
  const loadContractOwner = async (contractInstance) => {
	try {
	  const owner = await contractInstance.owner();
	  setContractOwner(owner);
	} catch (err) {
	  setError(`Error loading owner: ${err.message}`);
	}
  };
  
  const loadEvents = async (contractInstance) => {
	try {
		const filter = contractInstance.filters.DomainRegistered(); 
		const logs = await contractInstance.queryFilter(filter);
	  const parsedEvents = logs.map(log => ({
		type: 'Registration',
		name: log.args.domain,
		tld: log.args.topLevel, 
		timestamp: new Date(log.getBlock().timestamp * 1000).toLocaleString()
	  }));
	  setEvents(parsedEvents);
	} catch (err) {
	  setError(`Error loading events: ${err.message}`);
	}
  };

  const executeContractMethod = async (method, args, value = '0') => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const estimatedGas = await method(...args).estimateGas({
        value: ethers.utils.parseEther(value)
      });

      const overrides = {
        value: ethers.utils.parseEther(value),
        gasLimit: estimatedGas.add(100000) // ✅ Add 10% buffer
      };
      
      const tx = await method(...args, overrides);
      await tx.wait();
      setSuccess('Transaction successful!');
      await loadDomains();
      await loadReceipts();
      await loadEvents();
    } catch (err) {
      setError(err.data?.message || err.message); // ✅ Better error parsing
    } finally {
      setLoading(false);
    }
  };

  // Enhanced Domain Registration Section
  const renderRegistrationSection = () => (
	
    <div className="card">
      <h3>🔗 Register New Domain</h3>
      <div className="form-group">
        <label>Domain Name (min {constants.minLength} chars)</label>
        <input
          placeholder="example"
          onChange={e => setDomainName(e.target.value)}
          maxLength={32}
        />
      </div>
      
      <div className="form-group">
        <label>Top Level Domain (TLD)</label>
        <input
          placeholder="web3"
          onChange={e => setTld(e.target.value)}
          maxLength={12}
        />
      </div>

      <div className="form-group">
        <label>IP Address (IPv4)</label>
        <input
          placeholder="192.168.1.1"
          onChange={e => setIpAddress(e.target.value)}
          maxLength={15}
        />
      </div>

      <button 
  onClick={async () => {
    if (!isValidIPv4(ipAddress)) {
      setError('Invalid IPv4 address');
      return;
    }
    
    try {
      const ipBytes = ipToBytes15(ipAddress);
      await executeContractMethod(
        contract.register,
        [
          domainName,
          tld,
          ipBytes,
          ethers.utils.id(Date.now().toString())
        ],
        currentPrice
      );
    } catch (err) {
      setError(`IP conversion failed: ${err.message}`);
    }
  }}
  disabled={loading || !contract?.register}
>
  {loading ? 'Processing...' : `Register Domain (${currentPrice} ETH)`}
</button>
    </div>
  );

  // Enhanced Domain Management Section
  const renderDomainManagement = () => (
    <div className="card">
      <h3>🛠 Domain Management</h3>
      <input
        placeholder="Search domains..."
        onChange={e => setSearchTerm(e.target.value)}
        className="search-bar"
      />

<div className="domain-list">
        {domains.filter(d => 
          d.name.includes(searchTerm) // ✅ CORRECTION: Direct string search
        ).map(domain => (
          <div key={domain.key} className="domain-card">
            <div className="domain-header">
              <h4>
                {domain.name}.{domain.topLevel} {/* ✅ CORRECTION: Direct access */}
              </h4>
              <span className={`status ${domain.expires > Date.now()/1000 ? 'active' : 'expired'}`}>
                {domain.expires > Date.now()/1000 ? 'Active' : 'Expired'}
              </span>
            </div>

            <div className="domain-info">
			  <p>📡 IP: {domain.ip}</p>
              <p>⏳ Expires: {new Date(domain.expires * 1000).toLocaleDateString()}</p>
              <p>👤 Owner: {domain.owner}</p>
            </div>

			<div className="domain-actions">
              <button onClick={() => executeContractMethod(
                contract.renew,
                [domain.name, domain.topLevel],
    '1'
  )}
>
  Renew (1 ETH)
</button>

              <input
                placeholder="New IP"
                onChange={e => setIpAddress(e.target.value)}
                maxLength={15}
              />
              <button onClick={() => executeContractMethod(
                contract.updateIP,
                [
                  ethers.utils.formatBytes32String(domainName),
                  ethers.utils.formatBytes32String(tld),
                  ethers.utils.formatBytes32String(ipAddress)
                ]
              )}>
                Update IP
              </button>

              <input
                placeholder="New Owner Address"
                onChange={e => setNewOwner(e.target.value)}
              />
              <button onClick={() => executeContractMethod(
                contract.transferOwnership,
                [
                  ethers.utils.formatBytes32String(domainName),
                  ethers.utils.formatBytes32String(tld),
                  newOwner
                ]
              )}>
                Transfer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Admin Section
  const isAdmin = contractOwner === account;
  const renderAdminSection = () => (
    <div className="card">
      <h3>🔑 Admin Controls</h3>
      <div className="admin-actions">
        <button onClick={() => executeContractMethod(contract.emergencyWithdraw, [])}>
          Emergency Withdraw
        </button>
        
        <button onClick={() => executeContractMethod(contract.withdraw, [])}>
          Withdraw Funds
        </button>

        <input
          placeholder="New Owner Address"
          onChange={e => setNewOwner(e.target.value)}
        />
         <button onClick={() => executeContractMethod(
          contract.transferOwnership,
          [domainName, tld, newOwner] // ✅ CORRECT parameters
        )}>
          Transfer Domain Ownership
        </button>
      </div>
    </div>
  );

  // Contract Info Section
  const renderContractInfo = () => (
    <div className="card">
      <h3>📜 Contract Information</h3>
      <div className="info-grid">
        <div className="info-item">
          <span>Owner:</span>
          <span>{contractOwner}</span>
        </div>
        <div className="info-item">
          <span>Base Price:</span>
          <span>{constants.baseCost} ETH</span>
        </div>
        <div className="info-item">
          <span>Short Domain Addon:</span>
          <span>{constants.shortAddon} ETH</span>
        </div>
        <div className="info-item">
          <span>Registration Period:</span>
          <span>{(constants.expiration / 86400 / 365).toFixed(1)} years</span>
        </div>
      </div>
    </div>
  );

  return (
	<div className="container">
	<header>
	  <h1>🌐 Decentralized DNS Manager</h1>
	  <div className="wallet-section">
		{account ? (
		  <div className="connected-account">
			Connected: {`${account.slice(0, 6)}...${account.slice(-4)}`}
		  </div>
		) : (
		  <button onClick={connectWallet} className="connect-button">
			🔗 Connect Wallet
		  </button>
		)}
	  </div>
  	{/* Error/Success messages */}
	</header>

      <div className="dashboard">
        {renderContractInfo()}
        {renderRegistrationSection()}
        {renderDomainManagement()}
		{isAdmin && renderAdminSection()}      
	 </div>

      <div className="card">
        <h3>📨 Recent Activity</h3>
        <div className="event-log">
          {events.map((event, index) => (
            <div key={index} className="event">
              <span className="event-type">{event.type}</span>
              <span className="event-details">
                {event.name}.{event.tld} @ {event.timestamp}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DDNSService;