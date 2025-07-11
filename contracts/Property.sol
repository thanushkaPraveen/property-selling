// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Property {
    // A public fixed-size array to store the address of the owner for each property.
    // Assuming 16 properties, similar to your pets.
    address[16] public propertyOwners;

    // A public fixed-size array to store the price of each property in Wei.
    // Wei is the smallest unit of Ether (1 Ether = 10^18 Wei).
    uint256[16] public propertyPrices;

    // The address that will receive the Ether when a property is sold.
    // In a real application, this might be a multi-sig wallet or a more complex system.
    // For simplicity, we'll set it to the contract deployer or a fixed address.
    address public contractOwner;

    // Event to log when a property is sold
    event PropertySold(
        uint256 indexed propertyId,
        address indexed buyer,
        uint256 pricePaid
    );

    // Constructor: Runs only once when the contract is deployed.
    // It sets the initial owner of the contract (who receives funds)
    // and initializes property prices.
    constructor() {
        contractOwner = msg.sender; // The deployer of the contract is the initial owner

        // Initialize prices for 16 properties (example prices in Ether)
        // Convert Ether to Wei: 1 ETH = 10^18 Wei
        propertyPrices[0] = 2 ether;  // Property 0 costs 2 ETH
        propertyPrices[1] = 1 ether;  // Property 1 costs 1 ETH
        propertyPrices[2] = 3 ether;  // Property 2 costs 3 ETH
        propertyPrices[3] = 1.5 ether; // Property 3 costs 1.5 ETH
        // ... you can set prices for all 16 properties
        // For properties not explicitly set, their price will be 0 by default.
        // You would typically have a more robust way to manage property listings and prices.
        propertyPrices[4] = 2.5 ether;
        propertyPrices[5] = 1.2 ether;
        propertyPrices[6] = 0.8 ether;
        propertyPrices[7] = 2.2 ether;
        propertyPrices[8] = 1.8 ether;
        propertyPrices[9] = 3.8 ether;
        propertyPrices[10] = 0.5 ether;
        propertyPrices[11] = 3.5 ether;
        propertyPrices[12] = 1.1 ether;
        propertyPrices[13] = 2.3 ether;
        propertyPrices[14] = 2.8 ether;
        propertyPrices[15] = 1.6 ether;
    }

    /**
     * @dev Allows a user to buy a property by its ID.
     * @param propertyId The unique identifier of the property to buy (0-15).
     * @return The ID of the bought property.
     */
    function buyProperty(uint256 propertyId) public payable returns (uint256) {
        // Ensure the provided propertyId is within the valid range (0 to 15).
        require(propertyId >= 0 && propertyId <= 15, "Property ID must be between 0 and 15.");

        // Ensure the property is not already owned.
        require(propertyOwners[propertyId] == address(0), "Property is already sold.");

        // Get the required price for this property.
        uint256 requiredPrice = propertyPrices[propertyId];

        // Ensure the sender has sent enough Ether.
        require(msg.value >= requiredPrice, "Not enough Ether sent for this property.");

        // Assign the address of the transaction sender (msg.sender) as the new owner.
        propertyOwners[propertyId] = msg.sender;

        // Transfer the exact required amount to the contract owner.
        // If msg.value > requiredPrice, the excess Ether is sent back to the buyer automatically
        // by the EVM if the function doesn't explicitly handle it.
        // For clarity, we'll explicitly handle sending the exact amount to the contract owner.
        payable(contractOwner).transfer(requiredPrice);

        // Emit an event to log the sale.
        emit PropertySold(propertyId, msg.sender, requiredPrice);

        // Return the propertyId to confirm the purchase.
        return propertyId;
    }

    /**
     * @dev Retrieves the owner of a specific property.
     * @param propertyId The ID of the property.
     * @return The address of the property owner.
     */
    function getPropertyOwner(uint256 propertyId) public view returns (address) {
        return propertyOwners[propertyId];
    }

    /**
     * @dev Retrieves the price of a specific property.
     * @param propertyId The ID of the property.
     * @return The price of the property in Wei.
     */
    function getPropertyPrice(uint256 propertyId) public view returns (uint256) {
        return propertyPrices[propertyId];
    }

    /**
     * @dev Retrieves the list of all property owners.
     * This is a view function, meaning it does not modify the contract's state
     * and can be called without incurring gas costs.
     * @return A fixed-size array containing the addresses of all property owners.
     * An address of 0x0...0 indicates that the property at that index is not sold.
     */
    function getPropertyOwners() public view returns (address[16] memory) {
        return propertyOwners;
    }

    /**
     * @dev Retrieves the list of all property prices.
     * This is a view function.
     * @return A fixed-size array containing the prices of all properties in Wei.
     */
    function getPropertyPrices() public view returns (uint256[16] memory) {
        return propertyPrices;
    }
}