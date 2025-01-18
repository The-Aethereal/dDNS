import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import { dDNS } from '../artifacts/contracts/dDNS.sol/dDNS.json';

const dDNSAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

const providerOptions = {
    // Add your provider options here
};

const web3Modal = new Web3Modal({
    network: "mainnet", // optional
    cacheProvider: true, // optional
    providerOptions, // required
});

const dDNSAbi = dDNS.abi;

const DDNS = () => {
    const [provider, setProvider] = useState(null);
    const [account, setAccount] = useState(null);
    const [domain, setDomain] = useState('');
    const [newOwner, setNewOwner] = useState('');
    const [resolvedAddress, setResolvedAddress] = useState('');
    const [reverseDomain, setReverseDomain] = useState('');
    const [dDNSContract, setdDNS] = useState(null); // State to hold the contract instance

    const connectWallet = async () => {
        const provider = await web3Modal.connect();
        const ethersProvider = new ethers.providers.Web3Provider(provider);
        const accounts = await ethersProvider.listAccounts();
        setProvider(ethersProvider);
        setAccount(accounts[0]);
        const dDNSContract = new ethers.Contract(dDNSAddress, dDNSAbi, ethersProvider);
        setdDNS(dDNSContract);
    };

    const registerDomain = async () => {
        if (provider && account && dDNSContract) {
            const signer = provider.getSigner();
            const tx = await dDNSContract.connect(signer).registerDomain(domain);
            await tx.wait();
            setDomain('');
        }
    };

    const transferDomain = async () => {
        if (provider && account && dDNSContract) {
            const signer = provider.getSigner();
            const tx = await dDNSContract.connect(signer).transferDomain(domain, newOwner);
            await tx.wait();
            setDomain('');
            setNewOwner('');
        }
    };

    const resolveDomain = async () => {
        if (provider && domain && dDNSContract) {
            const address = await dDNSContract.resolveDomain(domain);
            setResolvedAddress(address);
        }
    };

    const reverseResolve = async () => {
        if (provider && account && dDNSContract) {
            const domain = await dDNSContract.reverseResolve(account);
            setReverseDomain(domain);
        }
    };

    useEffect(() => {
        if (provider) {
            provider.on('accountsChanged', (accounts) => setAccount(accounts[0]));
            provider.on('chainChanged', (chainId) => window.location.reload());
            provider.on('disconnect', () => {
                web3Modal.clearCachedProvider();
                setProvider(null);
                setAccount(null);
                setdDNS(null);
            });
        }
    }, [provider]);

    return (
        <div>
            <h1>dDNS Service</h1>
            <button onClick={connectWallet}>Connect Wallet</button>
            {account && (
                <div>
                    <h2>Account: {account}</h2>
                    <input
                        type="text"
                        placeholder="Enter domain"
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                    />
                    <button onClick={registerDomain}>Register Domain</button>
                    <input
                        type="text"
                        placeholder="Enter new owner address"
                        value={newOwner}
                        onChange={(e) => setNewOwner(e.target.value)}
                    />
                    <button onClick={transferDomain}>Transfer Domain</button>
                    <button onClick={resolveDomain}>Resolve Domain</button>
                    <p>Resolved Address: {resolvedAddress}</p>
                    <button onClick={reverseResolve}>Reverse Resolve</button>
                    <p>Reverse Domain: {reverseDomain}</p>
                </div>
            )}
        </div>
    );
};

export default DDNS;