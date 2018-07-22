pragma solidity ^0.4.23;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Marketplace.sol";

contract TestMarketplace {

  Marketplace marketplace = Marketplace(DeployedAddresses.Marketplace());
  Marketplace m = new Marketplace();


  // test calling initial storeId
  function testNoShopId() public {

    uint expected = 0;

    Assert.equal(marketplace.storeId(), expected, "There should no stores");

  }

  // test calling the openStore function from an address that is not a storeowner


}
