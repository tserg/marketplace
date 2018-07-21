pragma solidity ^0.4.23;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Marketplace.sol";

contract TestMarketplace {

  Marketplace marketplace = Marketplace(DeployedAddresses.Marketplace());
  Marketplace m = new Marketplace();

  function testNoShopId() public {

    uint expected = 0;

    Assert.equal(marketplace.storeId(), expected, "There should no stores");

  }

  function testOpenStore() public {

    bool res = helperOpenStore(address(m));

    Assert.isFalse(res, "There should be one store");

  }

  function testAddStoreowner() public {

    helperAddStoreowner(address(m));

    uint expected = 1;

    Assert.equal(expected, marketplace.storeId(), "There should be one admin added");
  }

  function helperOpenStore(address _address)
    public
    returns (bool r)
  {
    r = address(_address).call(bytes4(keccak256("openStore")));
  }

  function helperAddStoreowner(address _address)
    public
  {
    address(_address).call(bytes4(keccak256("addStoreowner(_address)", address(_address))));
  }

}
