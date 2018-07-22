1. User input

The following functions check for user input:
- listItem() checks for whether name is an empty string and whether the price is a positive number.

2. Powerful contract administrators

Except for the contract owner, administrators are only allowed to add storeowners. Administrators are not allowed to kill the contract using kill(), pause the contract using toggleContractActive() or to add another admin using addAdmin().

3. Powerful contract creator

To prevent any potential misuse of funds, any ETH paid is transferred directly between users.

4. tx.origin problem

msg.sender is used instead of tx.origin

5. Gas limits

No loops were used in the smart contracts.
