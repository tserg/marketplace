# Marketplace

This is a simple marketplace application for users to list items for sale and buy items. Any payment is transferred between buyer and seller directly.

There are four possible roles for a user:
1. Contract owner
  * Can toggle the status of contract (Active/Stopped)
  * Can kill the contract
  * Can add admins
  * Can add storeowners
  * Can open stores
2. Admin
  * Can add storeowners
  * Can open stores
3. Storeowner
  * Can open stores
4. User

## Prerequisites

Install truffle.

```
npm install -g truffle
```

Install Ganache CLI. Skip this if you are using another development blockchain.

```
npm install -g ganache-cli
```

Install lite-server.

```
npm install lite-server --save-dev
```

## Setting up

Launch Ganache CLI (or your development blockchain) from a terminal, and import the accounts into MetaMask.

```
ganache-cli
```

Install the directory and navigate to it in a separate terminal.

```
cd marketplace
```

Open truffle.js and replace the address in line 25 with the Ganache CLI address you wish to designate as the contract owner.

```
// replace this address
from: "0x50959cB3CE5F74D895eD55D6fFEdc4394BBdD3e1"
```

Compile the contracts, migrate them to your development blockchain, and run the tests. Note that default blockchain is ganache-cli with port 8545.

```
truffle compile
truffle migrate
truffle test
```

To interact with the front end:

```
npm run dev
```

## Interacting with the front-end

Please refresh the page after each transaction (if it does not do so automatically).

## Built With

* Truffle

## Authors

* Tse Rong Gary
