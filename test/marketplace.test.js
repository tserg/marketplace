var Marketplace = artifacts.require('Marketplace')

contract('Marketplace', function(accounts) {

  const owner = accounts[0]
  const alice = accounts[1]
  const bob = accounts[2]
  const emptyAddress = "0x0000000000000000000000000000000000000000"

  it("should add an admin", async() => {

    const marketplace = await Marketplace.deployed()

    var eventEmitted = false

    var event = marketplace.AdminAdded()
    await event.watch((err,res) => {
      eventEmitted= true
    })

    await marketplace.addAdmin(alice, {from: owner})

    const result = await marketplace.userStatus.call(alice)

    assert.equal(result, 1, "the address of the admin was not added")
    assert.equal(eventEmitted, true, "adding an admin should emit a AdminAdded Event")
  })

  it("should add a storeowner", async() => {

    const marketplace = await Marketplace.deployed()

    var eventEmitted = false

    var event = marketplace.StoreownerAdded()
    await event.watch((err,res) => {
      eventEmitted = true
    })

    await marketplace.addStoreowner(bob, {from: alice})

    const result = await marketplace.userStatus.call(bob)

    assert.equal(result, 2, "the address of the storeowner was not added")
    assert.equal(eventEmitted, true, "adding a storeowner should emit a SoreownerAdded Event")
  })

  it("should open a store", async() => {

    const marketplace = await Marketplace.deployed()

    var eventEmitted = false

    var event = marketplace.StoreOpened()
    await event.watch((err, res) => {
      eventEmitted = true
    })

    await marketplace.openStore({from: alice})
    const result1_1 = await marketplace.storeId.call()
    const result1_2 = await marketplace.fetchStoreowner.call(0)

    await marketplace.openStore({from: bob})
    const result2_1 = await marketplace.storeId.call()
    const result2_2 = await marketplace.fetchStoreowner.call(1)


    assert.equal(result1_1, 1, "the store was not opened")
    assert.equal(result1_2, alice, "the address of the storeowner is wrong")
    assert.equal(result2_1, 2, "not all stores were opened")
    assert.equal(result2_2, bob, "the address of a storeowner is wrong")
    assert.equal(eventEmitted, true, "opening a store should emit a Store Opened Event")

  })

  it("should list an item", async() => {

    const marketplace = await Marketplace.deployed()

    var eventEmitted = false

    var event = marketplace.ItemListed()
    await event.watch((err, res) => {
      eventEmitted = true
    })

    await marketplace.listItem(0, "boots", 2, {from: alice})
    const result1_1 = await marketplace.itemId.call()
    const result1_2 = await marketplace.fetchItem(0)

    assert.equal(result1_1, 1, "the item was not added")
    assert.equal(result1_2[0], 0, "the shop of the listed item is incorrect")
    assert.equal(result1_2[2], "boots", "the name of the listed item is incorrect")
    assert.equal(result1_2[3], 2, "the price of the listed item is incorrect")
    assert.equal(result1_2[4], 0, "the status of the item is incorrect")
    assert.equal(result1_2[5], alice, "the seller of the listed item is incorrect")
    assert.equal(result1_2[6], emptyAddress, "the buyer of the listed item should be empty")
    assert.equal(eventEmitted, true, "listing an item should emit a Item Listed Event")

  })

  it("should buy an item", async() => {

    const marketplace = await Marketplace.deployed()

    var eventEmitted = false

    var event = marketplace.ItemSold()
    await event.watch((err, res) => {
      eventEmitted = true
    })

    var amount = web3.toWei(2, "ether")

    await marketplace.buyItem(0, {from: bob, value: amount})
    const result1_1 = await marketplace.fetchItem(0)

    assert.equal(result1_1[6], bob, "the buyer of the item is incorrect")
    assert.equal(eventEmitted, true, "buying an item should emit a Item Sold Event")


  })

});
