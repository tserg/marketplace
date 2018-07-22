The following design patterns were used:

1. Restricting Access

The following modifiers were used to restrict access:
- verifyOwner: to restrict kill(), addAdmin() and toggleContractActive() functions to owner
- verifyAdmin: to restrict addStoreowner() function to admins
- verifyAdminOrStoreowner: to restrict openStore() and listItem() functions to admins and storeowners

2. Fail early and fail loud

The following functions check the condition required for execution as early as possible
- listItem(): checks whether person listing is storeowner
- addStoreowner(): checks whether address to be added is already an admin

3. Mortal

The contract can be destroyed using the kill() function and access is restricted to the owner.
