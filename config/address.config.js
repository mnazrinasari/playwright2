const { readAccountConfig } = require('../utils/excel.util'); // Import the readaddressInfoConfig function from utils

// Function to load account information for the given environment
function loadAddressConfig(environment) {
  // Get account information based on the environment (filtered from the Excel file)
  const addressInfo = readAccountConfig(environment);

  // Return the account-related data
  return {
    name: addressInfo.name,
    addressLine1: addressInfo.addressLine1,
    addressLine2: addressInfo.addressLine2,
    addressLine3: addressInfo.addressLine3,
    addressLine4: addressInfo.addressLine4,
    country: addressInfo.country,
    phoneNumber: addressInfo.phoneNumber
  };
}

module.exports = { loadAddressConfig };
