App = {
  web3Provider: null,
  contracts: {},
  // This will store the property data loaded from properties.json
  // It's useful to have it accessible globally if you need to display
  // property details alongside their sold status.
  propertiesData: [],

  init: async function() {
    // Load properties data from properties.json and populate the UI
    // IMPORTANT: Ensure your properties.json exists in the src/ directory
    // and has fields like 'id', 'name', 'picture', 'address', 'bedrooms', 'bathrooms', 'area', 'price'
    $.getJSON('../properties.json', function(data) {
      App.propertiesData = data; // Store the loaded data
      var propertiesRow = $('#propertiesRow'); // Updated ID from petsRow
      var propertyTemplate = $('#propertyTemplate'); // Updated ID from petTemplate

      for (let i = 0; i < App.propertiesData.length; i ++) {
        // Populate the property template with data for each property
        propertyTemplate.find('.panel-title').text(App.propertiesData[i].name);
        propertyTemplate.find('img').attr('src', App.propertiesData[i].picture);
        propertyTemplate.find('.property-address').text(App.propertiesData[i].address); // New field
        propertyTemplate.find('.property-bedrooms').text(App.propertiesData[i].bedrooms); // New field
        propertyTemplate.find('.property-bathrooms').text(App.propertiesData[i].bathrooms); // New field
        propertyTemplate.find('.property-area').text(App.propertiesData[i].area); // New field
        // Display price from JSON (for UI only, contract price is authoritative for transactions)
        propertyTemplate.find('.property-price').text(App.propertiesData[i].price + ' ETH');
        propertyTemplate.find('.btn-buy').attr('data-id', App.propertiesData[i].id); // Updated class and data-id

        propertiesRow.append(propertyTemplate.html());
      }
    });

    // Initialize Web3 provider (MetaMask, Web3.js fallback)
    await App.initWeb3();
    // Initialize smart contract (load artifact, set provider, mark sold properties)
    await App.initContract(); // This will now load Property.json
    // Bind events to UI elements (e.g., "Buy Property" buttons)
    App.bindEvents();
  },

  // Initializes the Web3 provider for connecting to the Ethereum blockchain.
  // It prioritizes modern dapp browsers (MetaMask), falls back to legacy browsers,
  // and finally to a local Ganache node if no injected provider is found.
  initWeb3: async function() {
      // Check for modern dapp browsers (e.g., MetaMask)
      if (window.ethereum) {
          App.web3Provider = window.ethereum;
          try {
              // Request account access from the user. This will trigger MetaMask's connection prompt.
              await window.ethereum.request({ method: "eth_requestAccounts" });
          } catch (error) {
              // User denied account access or another error occurred during connection.
              console.error("User denied account access or an error occurred during Web3 initialization:", error);
              // In a production app, you might display a user-friendly message here.
          }
      }
      // Check for legacy dapp browsers (e.g., older MetaMask versions or Mist)
      else if (window.web3) {
          App.web3Provider = window.web3.currentProvider;
      }
      // If no injected web3 instance is detected, fall back to a local Ganache node.
      else {
          console.warn("No web3 provider detected. Falling back to http://localhost:7545. Please consider installing MetaMask for full functionality!");
          App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      }
      // Initialize the Web3.js object with the determined provider.
      web3 = new Web3(App.web3Provider);
  },

  // Initializes the smart contract by loading its artifact (ABI and deployed addresses).
  // It returns a Promise to ensure that contract initialization is complete before proceeding.
  initContract: function() {
      return new Promise((resolve, reject) => {
          // Load the Property.json artifact file, which contains contract ABI and network info.
          // This is updated from Adoption.json
          $.getJSON('Property.json', function(data) {
              var PropertyArtifact = data; // Changed artifact variable name
              // Create a new TruffleContract instance for the Property contract.
              App.contracts.Property = TruffleContract(PropertyArtifact); // Changed contract name
              // Set the Web3 provider for the contract, allowing it to interact with the blockchain.
              App.contracts.Property.setProvider(App.web3Provider); // Changed contract name
              // After setting up the contract, call markSold to update the UI based on
              // already sold properties. Resolve the promise once markSold completes.
              App.markSold().then(resolve).catch(reject); // Changed to markSold
          }).fail(function(jqxhr, textStatus, error) {
              // If loading Property.json fails, log the error and reject the promise.
              console.error("Failed to load Property.json:", textStatus, error);
              reject(new Error("Failed to load Property.json: " + textStatus + ", " + error));
          });
      });
  },

  // Binds events to the UI elements.
  bindEvents: function() {
    // Attach a click event listener to all elements with the class 'btn-buy'.
    // When a "Buy Property" button is clicked, the App.handleBuyProperty function will be executed.
    $(document).on('click', '.btn-buy', App.handleBuyProperty); // Updated class and function name
  },

  // Function to mark sold properties in the UI by disabling their "Buy" buttons and changing text.
  // It fetches the list of property owners from the deployed smart contract.
  markSold: function() {
      var propertyInstance; // Variable to hold the deployed contract instance.

      // Get the deployed instance of the Property contract.
      // This returns a promise that resolves with the contract instance.
      return App.contracts.Property.deployed().then(function(instance) { // Changed contract name
          propertyInstance = instance;
          // Call the 'getPropertyOwners' method on the smart contract.
          // '.call()' is used for view functions and doesn't send a transaction (no gas cost).
          return propertyInstance.getPropertyOwners.call(); // Changed method name from getAdopters
      }).then(function(owners) { // Changed 'adopters' to 'owners'
          // Loop through the array of owner addresses returned by the contract.
          for (let i = 0; i < owners.length; i++) {
              // Check if the address at the current index is not the default empty address (0x0...).
              // An empty address signifies that the property at this index has not been sold.
              if (owners[i] !== '0x0000000000000000000000000000000000000000') {
                  // If the property is sold, update its corresponding UI panel:
                  // Find the "Buy Property" button within the property panel using its index.
                  // Change the button's text to 'Sold!' and disable it to prevent re-purchase.
                  $('.panel-property').eq(i).find('button').text('Sold!').attr('disabled', true); // Updated class and text
              }
          }
      }).catch(function(error) {
          // Catch any errors that occur during the process of marking sold properties (e.g., contract not deployed).
          console.error("Error marking sold properties:", error.message); // Updated message
          throw error; // Re-throw the error to propagate it up the promise chain (e.g., to initContract).
      });
  },

  // Function to handle the property purchase process (updated from handleAdopt)
  handleBuyProperty: async function(event) {
      event.preventDefault(); // Prevent the default form submission or button click behavior.

      // Get the property ID from the 'data-id' attribute of the clicked button.
      var propertyId = parseInt($(event.target).data('id'));
      console.log("Attempting to buy property with ID:", propertyId);

      try {
          // Get the user's Ethereum accounts from the connected Web3 provider (e.g., MetaMask).
          const accounts = await web3.eth.getAccounts();
          if (!accounts || accounts.length === 0) {
              console.error("No Ethereum accounts found. Please unlock your wallet and ensure it's connected to the DApp.");
              // You might display a modal or alert to the user here.
              return; // Exit the function if no accounts are available.
          }
          const account = accounts[0]; // Use the first available account for the transaction.
          console.log("Using account for purchase:", account);

          // Basic check to ensure the contract object is initialized.
          if (!App.contracts.Property) { // Changed contract name
              console.error("Property contract not initialized. Please check App.initContract() execution.");
              return;
          }

          // Get the deployed instance of the Property smart contract.
          const propertyInstance = await App.contracts.Property.deployed(); // Changed contract name
          console.log("Property contract deployed instance obtained.");

          // --- CRITICAL CHANGE: Fetch the price from the contract and send it ---
          // Call the getPropertyPrice method on the smart contract to get the required price in Wei
          // Removed .call() as it's not needed for truffle-contract view functions
          const propertyPriceWei = await propertyInstance.getPropertyPrice(propertyId);
          console.log(`Property ${propertyId} price (Wei): ${propertyPriceWei}`);
          // Convert Wei to Ether for display in console
          console.log(`Property ${propertyId} price (ETH): ${web3.utils.fromWei(propertyPriceWei, 'ether')}`);

          // Call the 'buyProperty' method on the smart contract with the propertyId
          // and the current account, sending the required Ether as 'value'.
          const result = await propertyInstance.buyProperty(propertyId, {
              from: account,
              value: propertyPriceWei // Send the exact price in Wei required by the contract
          });
          console.log("Property purchase transaction successful:", result);

          // Once the purchase transaction is successful, re-mark sold properties in the UI
          await App.markSold(); // Changed to markSold
          console.log("UI updated after property purchase.");

      } catch (error) {
          // Catch any errors that occur during the purchase process (e.g., transaction rejection, network issues, insufficient funds).
          console.error("Error during property purchase process:", error); // Log the full error object.
          if (error.message) {
              console.error("Detailed error message:", error.message); // Log the specific error message.
          }
          // In a real application, you'd show a user-friendly error message (e.g., "Purchase failed: user rejected transaction" or "Insufficient funds").
      }
  }
};

// When the window loads, initialize the DApp.
$(function() {
  $(window).load(function() {
    App.init();
  });
});