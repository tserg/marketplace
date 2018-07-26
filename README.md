# Marketplace

This is a simple marketplace application for users to list items for sale and buy items. Any payment is transferred between buyer and seller directly.

There are four possible roles for a user:
1. Contract owner
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

Launch your development blockchain from a terminal. The default is Ganache.

```
ganache-cli
```

Copy and paste the mnemonic into your browser, and copy the address. Replace the address in truffle.js with the copied address.

```
// replace this address
from: "0xedB773989F2687fD4c621b4B5c34E6722575b5F3"
```

Install the directory and navigate to it in a separate terminal.

```
cd marketplace
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

## Built With

* Truffle

## Authors

* Tse Rong Gary
