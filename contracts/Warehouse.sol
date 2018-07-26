pragma solidity ^0.4.23;

library Warehouse {

  /*
    State: status of item listed for ForSale
    Status: privileges granted to a user
  */

  enum State {ForSale, Sold}
  enum Status {Shopper, Admin, Storeowner}

  struct Store {
    address storeowner;
    uint[] items;
  }

  struct Item {
    uint place;
    uint sku;
    string name;
    uint price;
    State state;
    address seller;
    address buyer;
  }

  /** @dev Update item status to Sold
    * @param self The item that was sold
    */
  function updateItemSold(Item storage self)
    public
  {
    self.state = State.Sold;
  }

}
