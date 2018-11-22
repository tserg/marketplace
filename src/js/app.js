window.addEventListener('load', async () => {
// Modern dapp browsers...
  if (window.ethereum) {
      window.web3 = new Web3(ethereum);
      try {
          // Request account access if needed
          await ethereum.enable();
          App.initAccount();

      } catch (error) {
          console.log("Please enable access to Metamask");
      }
  }
  // Legacy dapp browsers...
  else if (window.web3) {
      window.web3 = new Web3(web3.currentProvider);
      // Acccounts always exposed
      App.initAccount();

  }
  // Non-dapp browsers...
  else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
  }
});

App = {
  Web3Provider: null,
  contracts: {},

  initAccount: function() {

    App.web3Provider = web3.currentProvider;
    // Display current wallet
    var account = web3.eth.accounts[0];

    var accountInterval = setInterval(function() {
      if (web3.eth.accounts[0] !== account) {
        account = web3.eth.accounts[0];
        window.location.reload(true);
      }
    }, 100);

    document.getElementById("account").innerHTML = account;

    // Display current wallet ETH balance
    var accountWeiBalance = web3.eth.getBalance(account, function(error, result) {
      if (!error) {
        console.log(JSON.stringify(result));

        var accountBalance = web3.fromWei(result.toNumber(), "ether");
        document.getElementById("account_balance").innerHTML = accountBalance;

      } else {
        console.log(error);
      }
    });

    // Display status of current wallet i.e. admin privileges

    return App.initContract();
  },


  initContract: function() {
    $.getJSON('Marketplace.json', function(data) {
      //Get the necessary contract artifact file and instantiate it with truffle-contract
      var MarketplaceArtifact = data;
      App.contracts.Marketplace = TruffleContract(MarketplaceArtifact);

      // Set the provider for this contracts
      App.contracts.Marketplace.setProvider(App.web3Provider);

      return App.getStoreId();

    });

    return App.bindEvents();

  },

  bindEvents: function() {
    $(document).on('click', '.btn-open-store', App.handleOpenStore);
    $(document).on('click', '.btn-list-item', App.handleListItem);

    // one allows onclick to be work only once
    $(document).one('click', '.btn-view-items', App.populateItemsPlaceholder);
    $(document).on('click', '.btn-item-buy', App.handleBuyItem);
  },

  handleOpenStore: function(event) {

    var marketplaceInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Marketplace.deployed().then(function(instance) {
        marketplaceInstance = instance;

        return marketplaceInstance.openStore({from: account});
      }).catch(function(err) {
        console.log(err.message);
      });
    });


  },

  handleListItem: function(event) {
    console.log("list item");

    var marketplaceInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Marketplace.deployed().then(function(instance) {
        marketplaceInstance = instance;

        return marketplaceInstance.listItem($("#list-item-store-id").val(), $("#list-item-name").val(), web3.toWei($("#list-item-price").val(), "ether"), {from: account});
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  getStoreId: function(storeId) {

    var marketplaceInstance;

    App.contracts.Marketplace.deployed().then(function(instance) {
      marketplaceInstance = instance;

      return marketplaceInstance.storeId.call();
    }).then(function(storeId) {
      console.log("Stores: " +storeId);
      document.getElementById("store-id").innerHTML = storeId;
    }).catch(function(err){
      console.log(err.message);
    });

    return App.getItemId();
  },

  getItemId: function(itemId) {
    var marketplaceInstance;

    App.contracts.Marketplace.deployed().then(function(instance) {
      marketplaceInstance = instance;

      return marketplaceInstance.itemId.call();
    }).then(function(itemId) {
      document.getElementById("item-id").innerHTML = itemId;
    }).catch(function(err) {
      console.log(err.message);
    });
    return App.getContractOwnerDashboard();
  },

  getContractOwnerDashboard: function(address) {
    var marketplaceInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Marketplace.deployed().then(function(instance) {
        marketplaceInstance = instance;

        return marketplaceInstance.owner.call();
      }).then(function(address) {

        if (account == address) {
          var contractOwnerDashboard = document.getElementById("contract-owner-dashboard");
          contractOwnerDashboard.style.display = "block";

          // create title for contractOwnerDashboardAddAdmin

          var contractOwnerDashboardTitle = document.createElement("h3");
          contractOwnerDashboardTitle.innerHTML = "Contract Owner Dashboard";

          contractOwnerDashboard.appendChild(contractOwnerDashboardTitle);

          // create div for inputting add admin function

          var contractOwnerDashboardAddAdmin = document.createElement("div");
          contractOwnerDashboardAddAdmin.class = "sub-dashboard";
          var contractOwnerDashboardAddAdminTitle = document.createElement("h4");
          contractOwnerDashboardAddAdminTitle.innerHTML = "Add an admin";

          // create span for address field

          var contractOwnerDashboardInputNewAdminArea = document.createElement("span");
          contractOwnerDashboardInputNewAdminArea.innerHTML = "Address: ";
          var contractOwnerDashboardInputNewAdmin = document.createElement("input");
          contractOwnerDashboardInputNewAdmin.type = "text";
          contractOwnerDashboardInputNewAdmin.size = "50";
          contractOwnerDashboardInputNewAdmin.setAttribute("id", "new-admin-address");

          // create span for button to add admin
          var contractOwnerDashboardInputNewAdminButtonPlaceholder = document.createElement("span");
          var contractOwnerDashboardInputNewAdminButton = document.createElement("button");
          contractOwnerDashboardInputNewAdminButton.type = "button";
          contractOwnerDashboardInputNewAdminButton.class = "btn-add-admin";
          contractOwnerDashboardInputNewAdminButton.innerHTML = "Add admin";
          contractOwnerDashboardInputNewAdminButton.addEventListener("click", function() {
            return App.handleAddAdmin();
          });

          // create div for emergency function

          var contractOwnerDashboardEmergency = document.createElement("div");
          contractOwnerDashboardEmergency.class = "sub-dashboard";
          var contractOwnerDashboardEmergencyTitle = document.createElement("h4");
          contractOwnerDashboardEmergencyTitle.innerHTML = "Toggle contract functions in case of emergency";

          // create span for emergency status

          var contractOwnerDashboardEmergencyStatus = document.createElement("span");
          contractOwnerDashboardEmergencyStatus.setAttribute("id", "emergency-status");
          contractOwnerDashboardEmergencyStatus.innerHTML = "Click here for current contract status";
          contractOwnerDashboardEmergencyStatus.addEventListener("click", function() {
            return App.handleGetEmergencyStatus();
          });

          // create span for emergency button
          var contractOwnerDashboardEmergencyButtonPlaceholder = document.createElement("span");
          var contractOwnerDashboardEmergencyButton = document.createElement("button");
          contractOwnerDashboardEmergencyButton.type = "button";
          contractOwnerDashboardEmergencyButton.class = "btn-emergency";
          contractOwnerDashboardEmergencyButton.innerHTML = "Toggle";
          contractOwnerDashboardEmergencyButton.addEventListener("click", function() {
            return App.handleEmergency();
          });

          // create div for kill contract function

          var contractOwnerDashboardKillContract = document.createElement("div");
          contractOwnerDashboardKillContract.class = "sub-dashboard";
          var contractOwnerDashboardKillContractTitle = document.createElement("h4");
          contractOwnerDashboardKillContractTitle.innerHTML = "Kill contract";

          // create span for emergency button
          var contractOwnerDashboardKillContractButtonPlaceholder = document.createElement("span");
          var contractOwnerDashboardKillContractButton = document.createElement("button");
          contractOwnerDashboardKillContractButton.type = "button";
          contractOwnerDashboardKillContractButton.class = "btn-kill-contract";
          contractOwnerDashboardKillContractButton.innerHTML = "Kill contract";
          contractOwnerDashboardKillContractButton.addEventListener("click", function() {
            return App.handleKillContract();
          });


          // append all elements

          contractOwnerDashboardInputNewAdminArea.appendChild(contractOwnerDashboardInputNewAdmin);
          contractOwnerDashboardInputNewAdminButtonPlaceholder.appendChild(contractOwnerDashboardInputNewAdminButton)

          contractOwnerDashboardAddAdmin.appendChild(contractOwnerDashboardAddAdminTitle);
          contractOwnerDashboardAddAdmin.appendChild(contractOwnerDashboardInputNewAdminArea);
          contractOwnerDashboardAddAdmin.appendChild(contractOwnerDashboardInputNewAdminButtonPlaceholder);

          contractOwnerDashboardEmergencyButtonPlaceholder.appendChild(contractOwnerDashboardEmergencyButton);
          contractOwnerDashboardEmergency.appendChild(contractOwnerDashboardEmergencyTitle);
          contractOwnerDashboardEmergency.appendChild(contractOwnerDashboardEmergencyStatus);
          contractOwnerDashboardEmergency.appendChild(contractOwnerDashboardEmergencyButtonPlaceholder);

          contractOwnerDashboard.appendChild(contractOwnerDashboardAddAdmin);
          contractOwnerDashboard.appendChild(contractOwnerDashboardEmergency);


          contractOwnerDashboardKillContractButtonPlaceholder.appendChild(contractOwnerDashboardKillContractButton);
          contractOwnerDashboardKillContract.appendChild(contractOwnerDashboardKillContractTitle);
          contractOwnerDashboardKillContract.appendChild(contractOwnerDashboardKillContractButtonPlaceholder);


          contractOwnerDashboard.appendChild(contractOwnerDashboardKillContract);


        }

      }).catch(function(err) {
        console.log(err.message);
      });
    });
    return App.getUserStatus();
  },




  getUserStatus: function(status) {
    var marketplaceInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Marketplace.deployed().then(function(instance) {
        marketplaceInstance = instance;

        return marketplaceInstance.userStatus.call(account);
      }).then(function(status) {

        if (status == 0) {
          document.getElementById("account_status").innerHTML = "Normal";
        } else {
          if (status == 1) {

            document.getElementById("account_status").innerHTML = "Admin";

            // get div for admin dashboard

            var adminDashboard = document.getElementById("admin-dashboard");
            adminDashboard.style.display = "block";

            // create adminDashboardTitle

            var adminDashboardTitle = document.createElement("h3");
            adminDashboardTitle.innerHTML = "Admin Dashboard";

            adminDashboard.appendChild(adminDashboardTitle);

            // create div for inputting add storeowner functions
            var adminDashboardAddStoreowner = document.createElement("div");
            adminDashboardAddStoreowner.class = "sub-dashboard";
            var adminDashboardAddStoreownerTitle = document.createElement("h4");
            adminDashboardAddStoreownerTitle.innerHTML = "Add a storeowner";

            // create span for address field

            var adminDashboardInputNewStoreownerArea = document.createElement("span");
            adminDashboardInputNewStoreownerArea.innerHTML = "Address: ";
            var adminDashboardInputNewStoreowner = document.createElement("input");
            adminDashboardInputNewStoreowner.type = "text";
            adminDashboardInputNewStoreowner.size = "50";
            adminDashboardInputNewStoreowner.setAttribute("id", "new-storeowner-address");

            // create span for button to add storeowner
            var adminDashboardInputNewStoreownerButtonPlaceholder = document.createElement("span");
            var adminDashboardInputNewStoreownerButton = document.createElement("button");
            adminDashboardInputNewStoreownerButton.type = "button";
            adminDashboardInputNewStoreownerButton.class = "btn-add-storeowner";
            adminDashboardInputNewStoreownerButton.innerHTML = "Add storeowner";
            adminDashboardInputNewStoreownerButton.addEventListener("click", function() {
              return App.handleAddStoreowner();
            })

            adminDashboardInputNewStoreownerArea.appendChild(adminDashboardInputNewStoreowner);
            adminDashboardInputNewStoreownerButtonPlaceholder.appendChild(adminDashboardInputNewStoreownerButton)

            adminDashboardAddStoreowner.appendChild(adminDashboardAddStoreownerTitle);
            adminDashboardAddStoreowner.appendChild(adminDashboardInputNewStoreownerArea);
            adminDashboardAddStoreowner.appendChild(adminDashboardInputNewStoreownerButtonPlaceholder);

            adminDashboard.appendChild(adminDashboardAddStoreowner);

          } else {
            document.getElementById("account_status").innerHTML = "Storeowner";

          }

          // get div for storeowner dashboard

          var storeownerDashboard = document.getElementById("storeowner-dashboard");
          storeownerDashboard.style.display = "block";

          // create storeownerDashboardTitle

          var storeownerDashboardTitle = document.createElement("h3");
          storeownerDashboardTitle.innerHTML = "Storeowner Dashboard";

          storeownerDashboard.appendChild(storeownerDashboardTitle);

          // create div for stores Opened

          var storeownerDashboardStoresOpened = document.createElement("div");
          storeownerDashboardStoresOpened.class = "sub-dashboard";

          // create span for toExponential
          var storeownerDashboardStoresOpenedText = document.createElement("span");
          storeownerDashboardStoresOpenedText.setAttribute("id", "stores-opened");
          storeownerDashboardStoresOpenedText.innerHTML = "Click me to view your stores.";

          storeownerDashboardStoresOpenedText.addEventListener("click", function() {
            storeownerDashboardStoresOpenedText.innerHTML = "Store Ids of your current stores: ";
            return App.handleGetStoresOpened();
          });


          storeownerDashboardStoresOpened.appendChild(storeownerDashboardStoresOpenedText);
          storeownerDashboard.appendChild(storeownerDashboardStoresOpened);


          // create div for open store function

          var storeownerDashboardOpenStore = document.createElement("div");
          storeownerDashboardOpenStore.class = "sub-dashboard";

          // create span for button to open new store
          var storeownerDashboardOpenNewStoreButtonPlaceholder = document.createElement("span");
          var storeownerDashboardOpenNewStoreButton = document.createElement("button");
          storeownerDashboardOpenNewStoreButton.type = "button";
          storeownerDashboardOpenNewStoreButton.class = "btn-open-store";
          storeownerDashboardOpenNewStoreButton.innerHTML = "Open a new store";
          storeownerDashboardOpenNewStoreButton.addEventListener("click", function() {
            return App.handleOpenStore();
          });

          storeownerDashboardOpenNewStoreButtonPlaceholder.appendChild(storeownerDashboardOpenNewStoreButton);
          storeownerDashboardOpenStore.appendChild(storeownerDashboardOpenNewStoreButtonPlaceholder);
          storeownerDashboard.appendChild(storeownerDashboardOpenStore);


          // create div for inputting list item function

          var storeownerDashboardListItem = document.createElement("div");
          storeownerDashboardListItem.class = "sub-dashboard";

          // create span for shop number field

          var storeownerDashboardListNewItemStoreArea = document.createElement("span");
          storeownerDashboardListNewItemStoreArea.innerHTML = "Store Id: ";
          var storeownerDashboardListNewItemStore = document.createElement("input");
          storeownerDashboardListNewItemStore.type = "text";
          storeownerDashboardListNewItemStore.size = "25";
          storeownerDashboardListNewItemStore.class = "list-item-fields";
          storeownerDashboardListNewItemStore.setAttribute("id", "list-item-store-id");

          storeownerDashboardListNewItemStoreArea.appendChild(storeownerDashboardListNewItemStore);

          // create span for item name field

          var storeownerDashboardListNewItemNameArea = document.createElement("span");
          storeownerDashboardListNewItemNameArea.innerHTML = "Name: ";
          var storeownerDashboardListNewItemName = document.createElement("input");
          storeownerDashboardListNewItemName.type = "text";
          storeownerDashboardListNewItemName.size = "25";
          storeownerDashboardListNewItemName.class = "list-item-fields";
          storeownerDashboardListNewItemName.setAttribute("id", "list-item-name");

          storeownerDashboardListNewItemNameArea.appendChild(storeownerDashboardListNewItemName);

          // create span for item price field

          var storeownerDashboardListNewItemPriceArea = document.createElement("span");
          storeownerDashboardListNewItemPriceArea.innerHTML = "Price: ";
          var storeownerDashboardListNewItemPrice = document.createElement("input");
          storeownerDashboardListNewItemPrice.type = "text";
          storeownerDashboardListNewItemPrice.size = "25";
          storeownerDashboardListNewItemPrice.class = "list-item-fields";
          storeownerDashboardListNewItemPrice.setAttribute("id", "list-item-price");

          storeownerDashboardListNewItemPriceArea.appendChild(storeownerDashboardListNewItemPrice);

          // create span for button to list item
          var storeownerDashboardListNewItemButtonPlaceholder = document.createElement("span");
          var storeownerDashboardListNewItemButton = document.createElement("button");
          storeownerDashboardListNewItemButton.type = "button";
          storeownerDashboardListNewItemButton.class = "btn-list-item";
          storeownerDashboardListNewItemButton.innerHTML = "List item";
          storeownerDashboardListNewItemButton.addEventListener("click", function() {
            return App.handleListItem();
          });

          storeownerDashboardListNewItemButtonPlaceholder.appendChild(storeownerDashboardListNewItemButton);

          storeownerDashboardListItem.appendChild(storeownerDashboardListNewItemStoreArea);
          storeownerDashboardListItem.appendChild(storeownerDashboardListNewItemNameArea);
          storeownerDashboardListItem.appendChild(storeownerDashboardListNewItemPriceArea);

          storeownerDashboardListItem.appendChild(storeownerDashboardListNewItemButtonPlaceholder);
          storeownerDashboard.appendChild(storeownerDashboardListItem);

        }


      }).catch(function(err) {
        console.log(err.message);
      });
    });
    return App.createItemsPlaceholder();
  },

  createItemsPlaceholder: function(itemId) {
    var marketplaceInstance;

    App.contracts.Marketplace.deployed().then(function(instance) {
      marketplaceInstance = instance;

      return marketplaceInstance.itemId.call();
    }).then(function(itemId) {

      var _itemId = itemId;

      for (var i = 1; i<=_itemId; i++) {

        var box = document.createElement("div");
        box.className = "item-box";

        box.setAttribute("id", "item-"+i);

        var parent = document.getElementById("master-box");
        parent.appendChild(box);

      };
    }).catch(function(err) {
      console.log(err.message);
    });

  },

  populateItemsPlaceholder: function(item) {
    var marketplaceInstance;
    var itemsCount;

    itemsCount = $("#master-box > div").length;

    if (itemsCount == 0) {
      document.getElementById("master-box").innerHTML = "There are no items listed for sale.";
    }

    for (var j = 1; j <= itemsCount; j++) {

      /* for asynchronous execution of function: to lock in value of j
        https://stackoverflow.com/questions/11488014/asynchronous-process-inside-a-javascript-for-loop
      */
      (function(cntr) {
        var currentBoxId = "item-" + j;
        var currentBox = document.getElementById(currentBoxId);

        App.contracts.Marketplace.deployed().then(function(instance) {
          marketplaceInstance = instance;

          return marketplaceInstance.itemList.call(cntr);
        }).then(function(item) {

          var currentItemShopId = document.createElement("span");
          currentItemShopId.className = "item-box-details";
          currentItemShopId.innerHTML = "Shop: " + (item[0]);

          var currentItemName = document.createElement("span");
          currentItemName.className = "item-box-details";
          currentItemName.innerHTML = "Name: " + item[2];

          var currentItemPrice = document.createElement("span");
          currentItemPrice.className = "item-box-details";
          currentItemPrice.innerHTML = "Price: " + web3.fromWei(item[3], "ether");
          currentItemPrice.setAttribute("id", "price-"+item[1]);

          var currentItemState = document.createElement("span");
          currentItemState.className = "item-box-details";

          var currentItemSeller = document.createElement("span");
          currentItemSeller.className = "item-box-details";
          currentItemSeller.innerHTML = "Seller: " + item[5];
          currentBox.appendChild(currentItemSeller);

          currentBox.appendChild(currentItemShopId);
          currentBox.appendChild(currentItemName);
          currentBox.appendChild(currentItemPrice);
          currentBox.appendChild(currentItemSeller);

          if (item[4] == 1) {
            currentItemState.innerHTML = "State: Sold";
            currentBox.appendChild(currentItemState);

            var currentItemBuyer = document.createElement("span");
            currentItemBuyer.className = "item-box-details";
            currentItemBuyer.innerHTML = "Buyer: " + item[6];
            currentBox.appendChild(currentItemBuyer);
          } else {
            currentItemState.innerHTML = "State: For Sale";
            currentBox.appendChild(currentItemState);

            var buyButton = document.createElement("button");
            buyButton.className = "btn-item-buy";
            buyButton.setAttribute("type", "button")
            buyButton.setAttribute("id", item[1]);
            buyButton.innerHTML = "Buy this item";
            currentBox.appendChild(buyButton);
          }

          var currentItemSeller = document.createElement("span");
          currentItemSeller.className = "item-box-details";
          currentItemSeller.innerHTML = "Seller: " + item[5];


        }).catch(function(err) {
          console.log(err.message);
        });
      })(j);
    };
  },

  handleBuyItem: function(event) {

    var _sku = parseInt(($(event.target).attr("id")));

    var purchasePrice = parseFloat($("#price-"+_sku).html().substring(7));

    var weiPurchasePrice = web3.toWei(purchasePrice, 'ether');

    var marketplaceInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Marketplace.deployed().then(function(instance) {
        marketplaceInstance = instance;

        return marketplaceInstance.buyItem(_sku, {from: account, value: weiPurchasePrice});
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  handleAddAdmin: function(event) {

    var marketplaceInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Marketplace.deployed().then(function(instance) {
        marketplaceInstance = instance;

        return marketplaceInstance.addAdmin($("#new-admin-address").val(), {from: account});
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  handleAddStoreowner: function(event) {

    var marketplaceInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Marketplace.deployed().then(function(instance) {
        marketplaceInstance = instance;

        return marketplaceInstance.addStoreowner($("#new-storeowner-address").val(), {from: account});
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  handleGetStoresOpened: function(event) {

    var marketplaceInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Marketplace.deployed().then(function(instance) {
        marketplaceInstance = instance;

        return marketplaceInstance.fetchStoresByAddress(account);
      }).then(function(addresses) {

        document.getElementById("stores-opened").innerHTML += addresses;

      }).catch(function(err) {
        console.log(err.message);
      });

    });
  },

  handleEmergency: function(event) {

    var marketplaceInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Marketplace.deployed().then(function(instance) {
        marketplaceInstance = instance;

        return marketplaceInstance.toggleContractActive();
      }).catch(function(err) {
        console.log(err.message);
      });

    });
  },

  handleGetEmergencyStatus: function(event) {

    var marketplaceInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Marketplace.deployed().then(function(instance) {
        marketplaceInstance = instance;

        return marketplaceInstance.stopped.call();
      }).then(function(result) {

        if (result == true) {
          document.getElementById("emergency-status").innerHTML = "Stopped";
        } else {
          document.getElementById("emergency-status").innerHTML = "Active";
        }

      }).catch(function(err) {
        console.log(err.message);
      });

    });
  },

  handleKillContract: function(event) {

    var marketplaceInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Marketplace.deployed().then(function(instance) {
        marketplaceInstance = instance;

        return marketplaceInstance.kill();
      }).catch(function(err) {
        console.log(err.message);
      });

    });
  }



};
