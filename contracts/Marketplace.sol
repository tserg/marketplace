pragma solidity ^0.4.23;

contract Marketplace {

  /* set owner */
  address owner;


  uint storeId;
  uint itemId;

  mapping (address => Status) public userStatus;
  mapping (uint => Store) public stores;
  mapping (address => uint[]) public storeowners;

  enum State {ForSale, Sold}
  enum Status {Admin, Storeowner, Shopper}

  struct Store {
    address storeowner;
    Item[] items;
  }

  struct Item {
    uint itemId;
    uint price;
    State state;

  }

  event ShopOpened(address storeOwner, uint storeId);
  event ShopClosed(address storeOwner, uint storeId);

  event ItemListed(uint storeId, uint itemId);
  event ItemSold(uint storeId, uint itemId);
  event ItemUnlisted(uint storeId, uint itemId);

  modifier verifyOwner { require(msg.sender == owner); _;}
  modifier verifyStoreowner { require(userStatus[msg.sender] == Status.Storeowner); _;}
  modifier verifyAdmin { require(userStatus[msg.sender] == Status.Admin); _;}

  constructor() public {
    owner = msg.sender;
    storeId = 0;
    itemId = 0;
    userStatus[msg.sender] = Status.Admin;
  }

  function setAdmin(address addr) private verifyAdmin {
    userStatus[addr] = Status.Admin;

  }

  function addStoreowner(address addr) private verifyAdmin {
    userStatus[addr] = Status.Storeowner;
  }

  function openShop() private verifyStoreowner {

    stores[storeId] = Store({storeowner: msg.sender, items: []});

    currentStores = storeowners[msg.sender];
    currentStores.push(storeId);
    storeowners[msg.sender] = currentStores;

    storeId += 1;

  }

  function closeShop() private verifyStoreowner {

  }



}
