const path = require('path');

// Get the absolute path to the loader.config.js file
const configPath = path.resolve(__dirname, 'config', 'loader.config.js');

// Load the configuration module
const config = require(configPath);

// Output the environment in the correct format for GitHub Actions
console.log(`TEST_ENV=${config.environment}`);
