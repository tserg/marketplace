pragma solidity ^0.4.23;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Marketplace.sol";

contract TestMarketplace {
  Marketplace marketplace = Marketplace(DeployedAddresses.Marketplace());

  // Testing the addition of an admin

  function testOpenShop() public {
    marketplace.openStore();
    uint expected = 1;

    Assert.equal(marketplace.storeId(), expected, "Store ID should increase by 1");
  }
}
