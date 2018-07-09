pragma solidity ^0.4.23;

contract Marketplace {

  // set owner
  address owner;

  /*
    storeId: total number of stores opened
    itemId: total number of items listed
  */
  uint storeId;
  uint itemId;

  /*
    userStatus: privileges granted to addresses
    storeOwnerList: stores owned by each address
    storeList: storeId mapped to Store
    itemList: itemId mapped to Item

  */
  mapping (address => Status) public userStatus;
  mapping (address => uint[]) public storeownerList;
  mapping (uint => Store) public storeList;
  mapping (uint => Item) public itemList;

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

  event AdminAdded(address newAdmin);
  event StoreownerAdded(address storeOwner);

  event StoreOpened(address storeowner, uint storeId);
  event StoreClosed(address storeowner, uint storeId);

  event ItemListed(uint storeId, uint itemId);
  event ItemSold(uint storeId, uint itemId);
  event ItemUnlisted(uint storeId, uint itemId);

  modifier verifyOwner { require(msg.sender == owner); _;}
  modifier verifyStoreowner { require(userStatus[msg.sender] == Status.Storeowner); _;}
  modifier verifyAdmin { require(userStatus[msg.sender] == Status.Admin); _;}
  modifier verifyAdminOrStoreowner { require(userStatus[msg.sender] == Status.Admin || userStatus[msg.sender] == Status.Storeowner); _;}

  modifier forSale (uint _sku) {require(itemList[_sku].state == State.ForSale); _;}

  modifier paidEnough(uint _price) {require(msg.value >= _price); _;}
  modifier checkValue(uint _sku) {
    _;
    uint _price = itemList[_sku].price;
    uint amountToRefund = msg.value - _price;
    itemList[_sku].buyer.transfer(amountToRefund);
  }

  constructor() public {
    owner = msg.sender;
    storeId = 0;
    itemId = 0;

    // initialise contract creator as admin
    userStatus[msg.sender] = Status.Admin;
  }

  /*
    @dev: sets an address as Admin
    @param addr Address to be set as Admin
  */
  function setAdmin(address _address) public verifyAdmin {
    userStatus[_address] = Status.Admin;
    emit AdminAdded(_address);
  }

  /*
    @dev: sets an address as storeOwner
    @param addr Address to be set as Storeowner
  */
  function addStoreowner(address _address) public verifyAdmin {
    // ensure user is not already an AdminAdded
    require(userStatus[_address] != Status.Admin);

    userStatus[_address] = Status.Storeowner;
    emit StoreownerAdded(_address);
  }

  function openStore() public verifyAdminOrStoreowner {

    Store memory newStore;
    newStore.storeowner = msg.sender;
    storeList[storeId] = newStore;
    storeownerList[msg.sender].push(storeId);

    emit StoreOpened(msg.sender, storeId);

    storeId += 1;

  }

  function listItem(uint _storeId, string _name, uint _price)
    public
    verifyAdminOrStoreowner
  {
    require(storeList[_storeId].storeowner == msg.sender);
    emit ItemListed(_storeId, itemId);
    itemList[itemId] = Item({place: _storeId, sku: itemId, name: _name,  price: _price, state: State.ForSale,
      seller: msg.sender, buyer: 0});
    itemId += 1;
  }

  function buyItem(uint sku)
    public
    payable
    forSale(sku)
    paidEnough(itemList[sku].price)
    checkValue(sku)
  {
    itemList[sku].buyer = msg.sender;
    itemList[sku].seller.transfer(itemList[sku].price);
    itemList[sku].state = State.Sold;
    emit ItemSold(itemList[sku].place, sku);
  }

  function fetchItem(uint _sku)
    public
    view
    returns (uint place, uint sku, string name, uint price, uint state, address seller, address buyer)
  {
    place = itemList[_sku].place;
    sku = itemList[_sku].sku;
    name = itemList[_sku].name;
    price = itemList[_sku].price;
    state = uint(itemList[_sku].state);
    seller = itemList[_sku].seller;
    buyer = itemList[_sku].buyer;
    return (place, sku, name, price, state, seller, buyer);
  }

  function fetchStoresByAddress(address _address)
    public
    view
    returns (uint[] stores)
  {
    stores = storeownerList[_address];
  }

  function fetchCurrentStoreId()
    public
    view
    returns (uint)
  {
    return storeId;
  }

  function fetchCurrentItemId()
    public
    view
    returns (uint)
  {
    return itemId;
  }


  /*
  function closeStore() private verifyStoreowner {

  }


  */


}
