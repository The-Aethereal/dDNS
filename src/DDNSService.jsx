import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './DDNSService.css';

const contractABI = [
	{
		"inputs": [
			{
				"internalType": "bytes",
				"name": "domain",
				"type": "bytes"
			},
			{
				"internalType": "bytes12",
				"name": "topLevel",
				"type": "bytes12"
			},
			{
				"internalType": "bytes15",
				"name": "newIp",
				"type": "bytes15"
			}
		],
		"name": "edit",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "emergencyWithdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "bytes",
				"name": "domainName",
				"type": "bytes"
			},
			{
				"indexed": false,
				"internalType": "bytes12",
				"name": "topLevel",
				"type": "bytes12"
			},
			{
				"indexed": false,
				"internalType": "bytes15",
				"name": "newIp",
				"type": "bytes15"
			}
		],
		"name": "LogDomainNameEdited",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "bytes",
				"name": "domainName",
				"type": "bytes"
			},
			{
				"indexed": false,
				"internalType": "bytes12",
				"name": "topLevel",
				"type": "bytes12"
			}
		],
		"name": "LogDomainNameRegistered",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "bytes",
				"name": "domainName",
				"type": "bytes"
			},
			{
				"indexed": false,
				"internalType": "bytes12",
				"name": "topLevel",
				"type": "bytes12"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "LogDomainNameRenewed",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "bytes",
				"name": "domainName",
				"type": "bytes"
			},
			{
				"indexed": false,
				"internalType": "bytes12",
				"name": "topLevel",
				"type": "bytes12"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "LogDomainNameTransferred",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "_owner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "LogPurchaseChangeReturned",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "bytes",
				"name": "domainName",
				"type": "bytes"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amountInWei",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "expires",
				"type": "uint256"
			}
		],
		"name": "LogReceipt",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			}
		],
		"name": "OwnershipRenounced",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "bytes",
				"name": "domain",
				"type": "bytes"
			},
			{
				"internalType": "bytes12",
				"name": "topLevel",
				"type": "bytes12"
			},
			{
				"internalType": "bytes15",
				"name": "ip",
				"type": "bytes15"
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
				"internalType": "bytes",
				"name": "domain",
				"type": "bytes"
			},
			{
				"internalType": "bytes12",
				"name": "topLevel",
				"type": "bytes12"
			}
		],
		"name": "renewDomainName",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes",
				"name": "domain",
				"type": "bytes"
			},
			{
				"internalType": "bytes12",
				"name": "topLevel",
				"type": "bytes12"
			},
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferDomain",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
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
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "BYTES_DEFAULT_VALUE",
		"outputs": [
			{
				"internalType": "bytes1",
				"name": "",
				"type": "bytes1"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "DOMAIN_EXPIRATION_DATE",
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
		"name": "DOMAIN_NAME_COST",
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
		"name": "DOMAIN_NAME_COST_SHORT_ADDITION",
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
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"name": "domainNames",
		"outputs": [
			{
				"internalType": "bytes",
				"name": "name",
				"type": "bytes"
			},
			{
				"internalType": "bytes12",
				"name": "topLevel",
				"type": "bytes12"
			},
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
				"internalType": "bytes",
				"name": "domain",
				"type": "bytes"
			},
			{
				"internalType": "bytes12",
				"name": "topLevel",
				"type": "bytes12"
			}
		],
		"name": "getDomainHash",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes",
				"name": "domain",
				"type": "bytes"
			},
			{
				"internalType": "bytes12",
				"name": "topLevel",
				"type": "bytes12"
			}
		],
		"name": "getIP",
		"outputs": [
			{
				"internalType": "bytes15",
				"name": "",
				"type": "bytes15"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes",
				"name": "domain",
				"type": "bytes"
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
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "receiptKey",
				"type": "bytes32"
			}
		],
		"name": "getReceipt",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
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
				"internalType": "bytes",
				"name": "domain",
				"type": "bytes"
			},
			{
				"internalType": "bytes12",
				"name": "topLevel",
				"type": "bytes12"
			}
		],
		"name": "getReceiptKey",
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
		"name": "getReceiptList",
		"outputs": [
			{
				"internalType": "bytes32[]",
				"name": "",
				"type": "bytes32[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "paymentReceipts",
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
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"name": "receiptDetails",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "amountPaidWei",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
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
		"inputs": [],
		"name": "TOP_LEVEL_DOMAIN_MIN_LENGTH",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
const contractAddress = '0x121bb9812f134fd1fc1c79880b2199959b8f62d2'; // Your deployed contract address

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

      // Listen for account changes
      window.ethereum.on('accountsChanged', (newAccounts) => {
        setAccount(newAccounts[0] || '');
      });

    } catch (err) {
      setError(`Connection failed: ${err.message}`);
    }
  };


  useEffect(() => {
	const init = async () => {
		if (!provider || !account) return;

	  try {
		if (window.ethereum) {
		  await window.ethereum.request({ method: 'eth_requestAccounts' });
		  const provider = new ethers.providers.Web3Provider(window.ethereum);
		  const signer = provider.getSigner();
		  const contractInstance = new ethers.Contract(
			contractAddress,
			contractABI,
			signer
		  );
  
		  // First load critical constants
		  await loadConstants(contractInstance);
		  await loadContractOwner(contractInstance);
  
		  // Then set contract state and setup listeners
		  setContract(contractInstance);
		  
		  // Load remaining data
		  await loadDomains(contractInstance);
		  await loadReceipts(contractInstance);
		  await loadEvents(contractInstance);
  
		  // Setup event listeners
		  contractInstance.on('LogDomainNameRegistered', () => loadDomains(contractInstance));
		  contractInstance.on('LogDomainNameRenewed', () => loadDomains(contractInstance));
		  contractInstance.on('LogDomainNameEdited', () => loadDomains(contractInstance));
		  contractInstance.on('LogDomainNameTransferred', () => loadDomains(contractInstance));
		}
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
	  const filter = contractInstance.filters.LogDomainNameRegistered();
	  const logs = await contractInstance.queryFilter(filter);
	  const parsedEvents = logs.map(log => ({
		type: 'Registration',
		name: ethers.utils.parseBytes32String(log.args.domainName),
		tld: ethers.utils.parseBytes32String(log.args.topLevel),
		timestamp: new Date(log.args.timestamp * 1000).toLocaleString()
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
      const overrides = {
        value: ethers.utils.parseEther(value),
        gasLimit: 500000
      };
      
      const tx = await method(...args, overrides);
      await tx.wait();
      setSuccess('Transaction successful!');
      await loadDomains();
      await loadReceipts();
      await loadEvents();
    } catch (err) {
      setError(err.reason || err.message);
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
        onClick={() => executeContractMethod(
          contract.register,
          [
            ethers.utils.formatBytes32String(domainName),
            ethers.utils.formatBytes32String(tld),
            ethers.utils.formatBytes32String(ipAddress)
          ],
          domainName.length < 8 ? '2' : '1'
        )}
		disabled={loading || !contract?.register}
		>
        {loading ? 'Processing...' : `Register Domain (${domainName.length < 8 ? '2' : '1'} ETH)`}
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
          ethers.utils.parseBytes32String(d.name).includes(searchTerm)
        ).map(domain => (
          <div key={domain.key} className="domain-card">
            <div className="domain-header">
              <h4>
                {ethers.utils.parseBytes32String(domain.name)}.
                {ethers.utils.parseBytes32String(domain.topLevel)}
              </h4>
              <span className={`status ${domain.expires > Date.now()/1000 ? 'active' : 'expired'}`}>
                {domain.expires > Date.now()/1000 ? 'Active' : 'Expired'}
              </span>
            </div>

            <div className="domain-info">
              <p>📡 IP: {ethers.utils.parseBytes32String(domain.ip)}</p>
              <p>⏳ Expires: {new Date(domain.expires * 1000).toLocaleDateString()}</p>
              <p>👤 Owner: {domain.owner}</p>
            </div>

            <div className="domain-actions">
			<button 
  onClick={() => contract?.renewDomainName && executeContractMethod(
    contract.renewDomainName,
    [
      ethers.utils.formatBytes32String(domainName),
      ethers.utils.formatBytes32String(tld)
    ],
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
                contract.edit,
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
                contract.transferDomain,
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
          [newOwner]
        )}>
          Transfer Contract Ownership
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
        Connected: {account.slice(0, 6)}...{account.slice(-4)}
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
        {contractOwner === window.ethereum?.selectedAddress && renderAdminSection()}
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