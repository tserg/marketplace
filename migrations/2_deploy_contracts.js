var Marketplace = artifacts.require("Marketplace");
var Warehouse = artifacts.require("Warehouse");

module.exports = function(deployer) {
  deployer.deploy(Warehouse);
  deployer.link(Warehouse, Marketplace);
  deployer.deploy(Marketplace);
}
