// loader.config.js
const { loadEnvironmentConfig } = require('./environment.config');
const { loadPaymentConfig } = require('./payment.config');
const { loadAddressConfig } = require('./address.config');
const { loadProductConfig } = require('./product.config');  // Import the new product config

// Get the environment from process.env
let environment = process.env.TEST_ENV;

//////////////////////////////////////////////////
environment = 'test'; //SET YOUR ENVIRONMENT HERE
//////////////////////////////////////////////////


// Main function to load configuration based on the environment
function loadConfig() {
  // Load environment, payment, and account-related config
  const environmentConfig = loadEnvironmentConfig(environment);
  const paymentConfig = loadPaymentConfig(environment);
  const addressConfig = loadAddressConfig(environment);

  // Load product config (includes both product details and product names)
  const { 
    products, 
    productNames, 
    productThumbnails, 
    productCategories, 
    productPrices, 
    productQuantities, 
    productTotals, 
    productManualTotals 
  } = loadProductConfig(environment);

  // Return the combined configuration
  return {
    //environment & login details
    environment,
    baseUrl: environmentConfig.baseUrl,
    username: environmentConfig.username,
    password: environmentConfig.password,
    //payment details
    cardName: paymentConfig.cardName,
    cardNumber: paymentConfig.cardNumber,
    cvc: paymentConfig.cvc,
    expirationMM: paymentConfig.expirationMM,
    expirationYYYY: paymentConfig.expirationYYYY,
    //address details
    name: addressConfig.name,
    addressLine1: addressConfig.addressLine1,
    addressLine2: addressConfig.addressLine2,
    addressLine3: addressConfig.addressLine3,
    addressLine4: addressConfig.addressLine4,
    country: addressConfig.country,
    phoneNumber: addressConfig.phoneNumber,
    // Product details
    products,                // Full product data
    productNames,            // Product names
    productThumbnails,       // Product thumbnails
    productCategories,       // Product categories
    productPrices,           // Product prices
    productQuantities,       // Product quantities
    productTotals,           // Product totals
    productManualTotals,     // Product manual totals
  };
}

module.exports = { loadConfig };