# Marketplace

This is a simple marketplace application for users to list items for sale and buy items. Any payment is transferred between buyer and seller directly.

## Setting up

Install lite-server.

> npm install lite-server --save-dev

Install the directory and navigate to it in your command line.

Launch your development blockchain in a separate window. The default is Ganache.

> ganache-cli

Copy and paste the mnemonic into your browser, and copy the address. Replace the address in truffle.js with the copied address.

> // replace this address
> from: "0xedB773989F2687fD4c621b4B5c34E6722575b5F3"

Now, you can compile the contracts, migrate them to your development blockchain, and run the tests.

> truffle compile
> truffle migrate
> truffle test

To interact with the front end:

> npm run dev
