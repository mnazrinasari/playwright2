// loader.config.js
const { getEnvironmentConfig } = require('./environment.config');
const { getPaymentConfig } = require('./payment.config');
const { getAccountInfoConfig } = require('./account.config');
const { loadProductConfig } = require('./product.config');  // Import the new product config

// Get the environment from process.env or default to 'test'
const environment = process.env.TEST_ENV || 'test';  // Default to 'test' if no environment is specified

// Main function to load configuration based on the environment
function loadConfig() {
  // Load environment, payment, and account-related config
  const environmentConfig = getEnvironmentConfig(environment);
  const paymentConfig = getPaymentConfig(environment);
  const accountInfoConfig = getAccountInfoConfig(environment);

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
    nameOnCard: paymentConfig.nameOnCard,
    cardNumber: paymentConfig.cardNumber,
    cvc: paymentConfig.cvc,
    expirationMM: paymentConfig.expirationMM,
    expirationYYYY: paymentConfig.expirationYYYY,
    //address details
    name: accountInfoConfig.name,
    addressLine1: accountInfoConfig.addressLine1,
    addressLine2: accountInfoConfig.addressLine2,
    addressLine3: accountInfoConfig.addressLine3,
    addressLine4: accountInfoConfig.addressLine4,
    country: accountInfoConfig.country,
    phoneNumber: accountInfoConfig.phoneNumber,
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