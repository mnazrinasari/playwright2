const xlsx = require('xlsx');
const path = require('path');

// Path to your Excel file (ensure the path is correct)
const configFilePath = path.resolve(__dirname, '../test-data/accounttestdata.csv'); // Adjust path if needed

// Function to read account information based on the environment
function getAccountInfoConfig(environment) {
  const workbook = xlsx.readFile(configFilePath);
  const sheet = workbook.Sheets['data'];  // Assuming the sheet name is 'data'
  const data = xlsx.utils.sheet_to_json(sheet);

  // Find the row for the requested environment
  const config = data.find(row => row.Environment.toLowerCase() === environment.toLowerCase());

  // If no matching environment found, throw an error
  if (!config) {
    throw new Error(`Account information not found for environment: ${environment}`);
  }

  // Return account-related configuration based on the found row
  return {
    baseUrl: config.BaseUrl,
    username: config.Username,
    password: config.Password,
    name: config.Name,
    addressLine1: config['Address Line 1'],
    addressLine2: config['Address Line 2'],
    addressLine3: config['Address Line 3'],
    addressLine4: config['Address Line 4'],
    country: config.Country,
    phoneNumber: config['Phone Number']
  };
}

module.exports = { getAccountInfoConfig };
