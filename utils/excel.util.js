const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const copyFile = promisify(fs.copyFile);
const moment = require('moment');  // We'll use moment.js to generate a timestamp for filenames

// Centralize the paths for both the login and product Excel files
const configFilePath = path.resolve(__dirname, '../test-data/accounttestdata.xlsx'); // Path to the login Excel file
const productFilePath = path.resolve(__dirname, '../test-data/producttestdata.xlsx'); // Path to the product Excel file
const productAddedFilePath = path.resolve(__dirname, '../test-data/productdetails.xlsx');  // Path to the new file where added product data will be written



// Function to read login config from Excel and include new fields
function readAccountConfig(filePath, environment) {
  const workbook = xlsx.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(sheet);

  // Find the config data for the specific environment
  const config = data.filter(row => row.Environment && row.Environment.trim().toLowerCase() === environment.trim().toLowerCase());

  if (config.length === 0) {
    console.error(`Configuration not found for environment: ${environment}`);
    throw new Error(`Configuration not found for environment: ${environment}`);
  }

  // Return the config object with all necessary data fields including new ones
  return config.map(cfg => ({
    environment: cfg.Environment,
    baseUrl: cfg.BaseUrl,
    login: cfg.Login,
    username: cfg.Username,
    password: cfg.Password,
    cardName: cfg['Name On Card'],
    cardNumber: String(cfg['Card Number']),
    cvc: cfg.CVC,
    expirationMM: cfg['Expiration MM'],
    expirationYYYY: cfg['Expiration YYYY'],
    name: cfg.Name,
    addressLine1: cfg['Address Line 1'],
    addressLine2: cfg['Address Line 2'],
    addressLine3: cfg['Address Line 3'],
    addressLine4: cfg['Address Line 4'],
    country: cfg.Country,
    phoneNumber: cfg['Phone Number']
  }));
}


// utils.js
// Define the path to the Excel file (adjust the path as needed)

function readProductData(environment) {
  // console.log('Reading product data for environment:', environment);  // Debug log

  // Read the Excel file
  const workbook = xlsx.readFile(productFilePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  // Convert Excel sheet to JSON data
  const data = xlsx.utils.sheet_to_json(sheet);

  // Filter data by the environment
  const filteredData = data.filter(item => item.Environment.toLowerCase() === environment.toLowerCase());

  // console.log('Filtered Product Data for environment:', environment, filteredData);  // Debug log

  return filteredData;  // Return all product data for the selected environment
}


// Export the functions
module.exports = { 
  readAccountConfig: (environment) => readAccountConfig(configFilePath, environment), 
  readProductData
};