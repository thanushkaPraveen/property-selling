// migrations/2_deploy_contracts.js
const Property = artifacts.require("Property"); // Import the Property contract artifact

module.exports = function (deployer) {
  deployer.deploy(Property); // Deploy the Property contract
};