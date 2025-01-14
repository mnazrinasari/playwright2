const { readAccountConfig } = require('../utils/excel.util'); // Import the readpaymentInfoConfig function from utils

// Function to load account information for the given environment
function loadEnvironmentConfig(environment) {
  // Get account information based on the environment (filtered from the Excel file)
  const environmentInfo = readAccountConfig(environment);

  // Ensure environmentInfo is an array
  if (!Array.isArray(environmentInfo)) {
    throw new Error('Expected environmentInfo to be an array');
  }

  // Return the account-related data
  return environmentInfo.map(info => ({
    environment: info.environment,
    baseUrl: info.baseUrl,
    login: info.login,
    username: info.username,
    password: info.password,
  }));
}

module.exports = { loadEnvironmentConfig };

