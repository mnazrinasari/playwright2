const xlsx = require('xlsx');
const path = require('path');

// Path to your Excel file (make sure the path is correct)
const configFilePath = path.resolve(__dirname, '../test-data/accounttestdata.csv');

// Function to get environment-specific configuration
function getEnvironmentConfig(environment) {
  // Read the Excel file
  const workbook = xlsx.readFile(configFilePath);
  const sheet = workbook.Sheets['data'];  // Assuming the sheet name is 'data'
  const data = xlsx.utils.sheet_to_json(sheet);

  // Find the row for the requested environment
  const config = data.find(row => row.Environment.toLowerCase() === environment.toLowerCase());

  if (!config) {
    throw new Error(`Configuration not found for environment: ${environment}`);
  }

  // Return the relevant configuration for this environment
  return {
    environment: config.Environment,
    baseUrl: config.BaseUrl,
    username: config.Username,
    password: config.Password,
  };
}

// Export the function so it can be imported in other files
module.exports = { getEnvironmentConfig };
