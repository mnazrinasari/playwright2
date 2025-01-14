const { readAccountConfig } = require('../utils/excel.util'); // Import the readaddressInfoConfig function from utils

// Function to load account information for the given environment
function loadAddressConfig(environment) {
  // Get account information based on the environment (filtered from the Excel file)
  const addressInfo = readAccountConfig(environment);

  // Return the account-related data
  return addressInfo.map(info => ({
    name: info.name,
    addressLine1: info.addressLine1,
    addressLine2: info.addressLine2,
    addressLine3: info.addressLine3,
    addressLine4: info.addressLine4,
    country: info.country,
    phoneNumber: String(info.phoneNumber)
  }));
}

module.exports = { loadAddressConfig };
