const PolicyContract = artifacts.require("PolicyContract");

module.exports = function (deployer) {
  deployer.deploy(PolicyContract);
};