const { readLoginConfig } = require('./utils');  // Import the readLoginConfig function from utils.js

function getEnvironmentConfig() {
  // Determine the environment, default to 'test' if not provided
  const environment = process.env.TEST_ENV || 'test';

  let config;
  try {
    config = readLoginConfig(environment);  // Read the login config based on environment
  } catch (error) {
    throw new Error(`Failed to load environment config: ${error.message}`);
  }

  // Return the environment-specific configuration
  return {
    environment,
    baseUrl: config.baseUrl,
    username: config.username,
    password: config.password,
    nameOnCard: config.nameOnCard,
    cardNumber: config.cardNumber,
    cvc: config.cvc,
    expirationMM: config.expirationMM,
    expirationYYYY: config.expirationYYYY,
  };
}

module.exports = { getEnvironmentConfig };
