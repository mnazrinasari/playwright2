const xlsx = require('xlsx');
const path = require('path');

const configFilePath = path.resolve(__dirname, '../test-data/accounttestdata.csv'); // Path to your Excel file

function getPaymentConfig(environment) {
  const workbook = xlsx.readFile(configFilePath);
  const sheet = workbook.Sheets['data'];  // Assuming the sheet name is 'data'
  const data = xlsx.utils.sheet_to_json(sheet);

  // Find the row for the requested environment
  const config = data.find(row => row.Environment.toLowerCase() === environment.toLowerCase());

  // If no matching environment found, throw an error
  if (!config) {
    throw new Error(`Payment information not found for environment: ${environment}`);
  }

  // Return payment-related configuration based on the found row
  return {
    nameOnCard: config['Name On Card'],
    cardNumber: config['Card Number'].toString(), // Convert to string to handle large numbers
    cvc: config['CVC'],
    expirationMM: config['Expiration MM'],
    expirationYYYY: config['Expiration YYYY']
  };
}

module.exports = { getPaymentConfig };
