const { readAccountConfig } = require('../utils/excel.util'); // Import the readpaymentInfoConfig function from utils

// Function to load account information for the given environment
function loadEnvironmentConfig(environment) {
  // Get account information based on the environment (filtered from the Excel file)
  const environmentInfo = readAccountConfig(environment);

  // Return the account-related data
  return {
    environment: environmentInfo.environment,
    baseUrl: environmentInfo.baseUrl,
    username: environmentInfo.username,
    password: environmentInfo.password,
  };
}

module.exports = { loadEnvironmentConfig };
