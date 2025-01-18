# dDNS
A decentralized DNS (dDNS) service built on Ethereum, allowing users to register, transfer, resolve, and reverse resolve domain names to Ethereum addresses using Solidity, Foundry, and React.


## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Smart Contract](#smart-contract)
- [Frontend](#frontend)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Introduction

The Decentralized DNS (dDNS) Service is a decentralized application (DApp) built on the Ethereum blockchain. It allows users to register, transfer, resolve, and reverse resolve domain names to Ethereum addresses. This project is built using Solidity for the smart contract, Foundry for smart contract testing, Anvil for a local Ethereum node, and MetaMask for frontend interaction.

## Features

- **Register Domain**: Users can register a domain name to their Ethereum address.
- **Transfer Domain**: Users can transfer domain ownership to another Ethereum address.
- **Resolve Domain**: Users can resolve a domain name to its associated Ethereum address.
- **Reverse Resolve**: Users can reverse resolve an Ethereum address to its associated domain name.

## Prerequisites

- **Node.js**: Ensure you have Node.js installed. You can download it from [nodejs.org](https://nodejs.org/).
- **Foundry**: Install Foundry by running the following command:
  ```sh
  curl -L https://foundry.paradigm.xyz | bash
  source ~/.profile

    MetaMask: Install MetaMask as a browser extension from the Chrome Web Store or Firefox Add-ons.
    Git: Ensure you have Git installed. You can download it from git-scm.com.

Installation
Backend (Smart Contract)

    Clone the repository:

    git clone https://github.com/your-username/dDNS.git
    cd dDNS

    Install dependencies:

    forge install

    Compile the smart contract:

    forge build

    Deploy the smart contract:
        Set up your environment variables in a .env file:

        touch .env

        Add your private key:

        PRIVATE_KEY=your_private_key

        Deploy the contract using the deployment script:

        forge script script/deploy.s.sol --rpc-url http://127.0.0.1:8545 --broadcast

Frontend

    Navigate to the frontend directory:

    cd ddns-frontend

    Install dependencies:

    npm install

    Set up your environment variables:
        Create a .env file in the root directory of the frontend project:

        touch .env

        Add the contract address:

        REACT_APP_CONTRACT_ADDRESS=YOUR_CONTRACT_ADDRESS

    Start the frontend:

    npm start

Usage

    Connect your MetaMask wallet: Open the DApp in your browser and click the "Connect Wallet" button to connect your MetaMask wallet.
    Register a Domain: Enter a domain name and click "Register Domain".
    Transfer a Domain: Enter the domain name and the new owner's Ethereum address, then click "Transfer Domain".
    Resolve a Domain: Enter a domain name and click "Resolve Domain" to get the associated Ethereum address.
    Reverse Resolve: Click "Reverse Resolve" to get the domain name associated with your connected Ethereum address.

Smart Contract

The smart contract is written in Solidity and is located in the src/dDNS.sol file. It provides the following functions:

    registerDomain(string memory domain): Registers a domain to the caller's address.
    transferDomain(string memory domain, address newOwner): Transfers ownership of a domain to a new address.
    resolveDomain(string memory domain): Resolves a domain to its associated address.
    reverseResolve(address addr): Reverse resolves an address to its associated domain.

Frontend

The frontend is built using React and is located in the ddns-frontend directory. It interacts with the smart contract using the ethers library and web3modal for wallet connection.
Testing

    Run tests for the smart contract:

    forge test

    Run tests for the frontend: You can use Jest or any other testing framework for React components.

Deployment

    Deploy the smart contract as described in the Installation section.
    Deploy the frontend: You can deploy the frontend to a static hosting service like Vercel, Netlify, or GitHub Pages.

License

This project is licensed under the MIT License. See the LICENSE file for details.
Acknowledgments

    Foundry for smart contract development and testing.
    MetaMask for wallet integration.
    Ethers.js for interacting with the Ethereum blockchain.
    Web3Modal for wallet connection.
    Create React App for setting up the frontend.


### Additional Notes

- **README.md**: Ensure you replace placeholders like `YOUR_CONTRACT_ADDRESS` and `your_private_key` with actual values.
- **License**: If you don't have a `LICENSE` file, you can create one using a service like [Choose a License](https://choosealicense.com/).
