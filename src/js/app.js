App = {
  Web3Provider: null,
  contracts: {},

  initWeb3: function() {

    //Is there an injected web3 instance?
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {

    // If no injected web3 instance is detected, fall back to Ganache
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
    }
    web3 = new Web3(App.web3Provider);

    // Display current wallet
    var account = web3.eth.accounts[0];
    console.log("Hello");
    document.getElementById("account").innerHTML = account;

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
    console.log("hello2");
    $(document).on('click', '.btn-open-store', App.handleOpenStore);
    $(document).on('click', '.btn-list-item', App.handleListItem);
  },

  handleOpenStore: function(event) {
    console.log("hello3");
    event.preventDefault();

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
    event.preventDefault();

    var marketplaceInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Marketplace.deployed().then(function(instance) {
        marketplaceInstance = instance;

        return marketplaceInstance.listItem($("#list-item-store-id").val(), $("#list-item-name").val(), $("#list-item-price").val(), {from: account});
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  getStoreId: function(storeId, accounts) {
    console.log("hello4");

    var marketplaceInstance;

    App.contracts.Marketplace.deployed().then(function(instance) {
      marketplaceInstance = instance;

      return marketplaceInstance.fetchCurrentStoreId.call();
    }).then(function(storeId) {
      document.getElementById("store-id").innerHTML = storeId;
    }).catch(function(err){
      console.log(err.message);
    });

    return App.getItemId();
  },

  getItemId: function(itemId, accounts) {
    var marketplaceInstance;

    App.contracts.Marketplace.deployed().then(function(instance) {
      marketplaceInstance = instance;

      return marketplaceInstance.fetchCurrentItemId.call();
    }).then(function(itemId) {
      document.getElementById("item-id").innerHTML = itemId;
    }).catch(function(err) {
      console.log(err.message);
    });
  }
};

$(function() {
  $(window).load(function() {
    App.initWeb3();
  });
});
