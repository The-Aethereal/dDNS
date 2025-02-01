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
const contractAddress = '0xff109210c4fefbf0486cd0c9305cd69ea79452b0'; 
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
  const [manualGasLimit, setManualGasLimit] = useState(3000000); 
  const [useManualGas, setUseManualGas] = useState(false);
  const [gasHistory, setGasHistory] = useState([]);
  const [commitment, setCommitment] = useState(null);
  const [domainName, setDomainName] = useState('');
  const [tld, setTld] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [newOwner, setNewOwner] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [newTLD, setNewTLD] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [contractOwner, setContractOwner] = useState('');


  const [constants, setConstants] = useState({
    minLength: 0,
    expiration: 0,
    baseCost: 0,
    shortAddon: 0
  });

  const bytes15ToIP = (bytes15) => {
    try {
      const bytes = ethers.utils.arrayify(bytes15);
      return bytes.slice(0, 4).join('.');
    } catch {
      return 'Invalid IP';
    }
  };

  const loadUserDomains = async (contractInstance) => {
    try {
      const filter = contractInstance.filters.DomainRegistered(account);
      const logs = await contractInstance.queryFilter(filter);
      
      const domains = await Promise.all(
        logs.map(async log => {
          const { domain, topLevel } = log.args;
          const details = await contractInstance.getDomainDetails(domain, topLevel);
          return {
            name: domain,
            topLevel: topLevel,
            owner: details.owner,
            ip: details.ip,
            expires: details.expires.toNumber()
          };
        })
      );
      
      setDomains(domains.filter(d => d.owner === account));
    } catch (err) {
      setError(`Error loading domains: ${err.message}`);
    }
  };


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

	const ipv4Bytes = ethers.utils.arrayify(
	  ethers.utils.hexlify(
		new Uint8Array(ipString.split('.').map(Number))
	  )
	);
	
	const paddedBytes = new Uint8Array(15);
	paddedBytes.set(ipv4Bytes);
	return ethers.utils.hexlify(paddedBytes);
  };

  const isValidIPv4 = (ip) => {
	const pattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/;
	return pattern.test(ip);
  };

  const calculateAverageGas = () => {
	if (gasHistory.length === 0) return manualGasLimit;
	const sum = gasHistory.reduce((a, b) => a + b, 0);
	return Math.floor(sum / gasHistory.length) * 1.2; 
  };
  
  const updateGasHistory = (gasUsed) => {
	setGasHistory(prev => [...prev.slice(-9), gasUsed]); 
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
  
		await loadConstants(contractInstance);
		await loadContractOwner(contractInstance);
		setContract(contractInstance);
		await loadUserDomains(contractInstance);
		await loadEvents(contractInstance);
  
		const onDomainEvent = () => loadUserDomains(contractInstance);
		contractInstance.on('DomainRegistered', onDomainEvent);
		contractInstance.on('DomainRenewed', onDomainEvent);
  
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
  
		await updatePrice();
  
		return () => {
		  contractInstance.off('DomainRegistered', onDomainEvent);
		  contractInstance.off('DomainRenewed', onDomainEvent);
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
  }, [provider, account]);


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
  }, [domainName, contract]);
  
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
	try {
	  const overrides = {
		value: ethers.utils.parseEther(value),
		gasLimit: 500000 
	  };
  
	  console.log('Transaction parameters:', {
		method: method.name,
		args,
		overrides
	  });
  
	  const tx = await method(...args, overrides);
	  const receipt = await tx.wait();
	  return receipt;
	} catch (err) {
	  console.error('Transaction error:', err);
	  throw err;
	}
  };
  
  const generateCommitment = async (domain, tld) => {
	const packed = ethers.utils.defaultAbiCoder.encode(
	  ['string', 'string', 'address'],
	  [domain, tld, account]
	);
	return ethers.utils.keccak256(packed);
  };

  const verifyCommitment = async (commitment) => {
	const exists = await contract._commitments(commitment);
	if (!exists) throw new Error('Commitment not registered');
  };

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

	  <button onClick={async () => {
  try {
    // 1. Generate commitment
    const newCommitment = await generateCommitment(domainName, tld);
    
    // 2. Send makeCommitment transaction
    const makeTx = await contract.makeCommitment(domainName, tld, {
      value: ethers.utils.parseEther(currentPrice)
    });
    
    // 3. Wait for transaction confirmation
    await makeTx.wait(1); // Wait for 1 confirmation
    
    // 4. Verify commitment was stored
    await verifyCommitment(newCommitment);
    
    // 5. Proceed with registration
    const ipBytes = ipToBytes15(ipAddress);
    const registerTx = await contract.register(
      domainName,
      tld,
      ipBytes,
      newCommitment, {
        gasLimit: 500000, // Set manual gas limit
        value: ethers.utils.parseEther(currentPrice)
      }
    );
    
    await registerTx.wait();
    setSuccess('Registration successful!');
    
  } catch (err) {
    setError(`Registration failed: ${err.message}`);
  }
}}>

  {loading ? 'Processing...' : `Register Domain (${currentPrice} ETH)`}


</button>
    </div>
  );

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
		  `${d.name}.${d.topLevel}`.includes(searchTerm)
		).map(domain => (
		  <div key={`${domain.name}.${domain.topLevel}`} className="domain-card">
            <div className="domain-header">
              <h4>{domain.name}.{domain.topLevel}</h4>
              <span className={`status ${domain.expires > Date.now()/1000 ? 'active' : 'expired'}`}>
                {domain.expires > Date.now()/1000 ? 'Active' : 'Expired'}
              </span>
            </div>
            <div className="domain-info">
              <p>📡 IP: {bytes15ToIP(domain.ip)}</p>
              <p>⏳ Expires: {new Date(domain.expires * 1000).toLocaleDateString()}</p>
              <p>👤 Owner: {domain.owner}</p>
            </div>
			<div className="domain-actions">
            <button onClick={async () => {
              try {
                await executeContractMethod(
                  contract.renew,
                  [domain.name, domain.topLevel],
                  ethers.utils.parseEther(currentPrice).toString()
                );
                loadUserDomains(contract);
              } catch (err) {
                setError(`Renewal failed: ${err.message}`);
              }
            }}>
              Renew ({currentPrice} ETH)
            </button>

            <input
              placeholder="New IP"
              onChange={e => setIpAddress(e.target.value)}
              maxLength={15}
            />
            <button onClick={async () => {
              try {
                const ipBytes = ipToBytes15(ipAddress);
                await executeContractMethod(
                  contract.updateIP,
                  [domain.name, domain.topLevel, ipBytes]
                );
                loadUserDomains(contract);
              } catch (err) {
                setError(`IP update failed: ${err.message}`);
              }
            }}>
              Update IP
            </button>

            <input
              placeholder="New Owner Address"
              onChange={e => setNewOwner(e.target.value)}
            />
            <button onClick={async () => {
              try {
                await executeContractMethod(
                  contract.transferOwnership,
                  [domain.name, domain.topLevel, newOwner]
                );
                loadUserDomains(contract);
              } catch (err) {
                setError(`Transfer failed: ${err.message}`);
              }
            }}>
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
          [domainName, tld, newOwner]
        )}>
          Transfer Domain Ownership
        </button>

		<div className="gas-controls">
        <h4>Gas Management</h4>
        <label>
          <input 
            type="checkbox" 
            checked={useManualGas}
            onChange={(e) => setUseManualGas(e.target.checked)}
          />
          Use Manual Gas Limits
        </label>
        
        <div className="form-group">
          <label>Manual Gas Limit (current: {manualGasLimit})</label>
          <input
            type="number"
            value={manualGasLimit}
            onChange={(e) => setManualGasLimit(Math.max(0, parseInt(e.target.value) || 0))}
          />
        </div>
        
        <button onClick={() => setManualGasLimit(calculateAverageGas())}>
          Set to Historical Average ({calculateAverageGas()})
        </button>
        
        <p>Last 10 transactions gas usage: {gasHistory.join(', ') || 'None'}</p>
      </div>

      </div>
    </div>
  );

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

}
export default DDNSService;