const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const copyFile = promisify(fs.copyFile);
const moment = require('moment');  // We'll use moment.js to generate a timestamp for filenames

// Centralize the paths for both the login and product Excel files
const configFilePath = path.resolve(__dirname, './logintestdata.xlsx'); // Path to the login Excel file
const productFilePath = path.resolve(__dirname, './producttestdata.xlsx'); // Path to the product Excel file
const productAddedFilePath = path.resolve(__dirname, './productdetails.xlsx');  // Path to the new file where added product data will be written

// Function to read login config from Excel and include new fields
function readLoginConfig(filePath, environment) {
  const workbook = xlsx.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(sheet);

  // console.log('Excel Data:', data); // Log the content of the Excel file to check

  // Find the config data for the specific environment
  const config = data.find(row => row.Environment && row.Environment.trim().toLowerCase() === environment.trim().toLowerCase());

  if (!config) {
    console.error(`Configuration not found for environment: ${environment}`);
    throw new Error(`Configuration not found for environment: ${environment}`);
  }

  // Return the config object with all necessary data fields including new ones
  return {
    baseUrl: config.BaseUrl,
    username: config.Username,
    password: config.Password,
    nameOnCard: config['Name On Card'],       // New field
    cardNumber: config['Card Number'],         // New field
    cvc: config.CVC,                           // New field
    expirationMM: config['Expiration MM'],     // New field
    expirationYYYY: config['Expiration YYYY'], // New field
  };
}

// Function to read product data from Excel based on the environment
function readProductData(filePath, environment) {
  const workbook = xlsx.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(sheet);

  // console.log('Product Data:', data);  // Log the product data for debugging

  // Filter products based on environment
  const filteredProducts = data.filter(row => row.Environment && row.Environment.trim().toLowerCase() === environment.trim().toLowerCase());

  if (filteredProducts.length === 0) {
    throw new Error(`No product data found for environment: ${environment}`);
  }

  return filteredProducts;  // Returning the array of products
}

// Function to write product data to Excel
function writeProductDataToExcel(productData) {
  // Check if the file already exists
  let workbook;
  try {
    workbook = xlsx.readFile(productAddedFilePath);
  } catch (err) {
    // If the file doesn't exist, create a new one
    workbook = xlsx.utils.book_new();
  }

  // Convert the product data to a sheet
  const newSheet = xlsx.utils.json_to_sheet(productData);

  // Add the new sheet to the workbook or create a new one
  if (!workbook.Sheets['Products']) {
    xlsx.utils.book_append_sheet(workbook, newSheet, 'Products');
  } else {
    const existingSheet = workbook.Sheets['Products'];
    const existingData = xlsx.utils.sheet_to_json(existingSheet);
    const mergedData = [...existingData, ...productData];
    const mergedSheet = xlsx.utils.json_to_sheet(mergedData);
    workbook.Sheets['Products'] = mergedSheet;
  }

  // Write the workbook to the file
  xlsx.writeFile(workbook, productAddedFilePath);
  console.log("Product data written to Excel successfully.");
}

// Function to create a backup of the Excel file
async function createBackup() {
  try {
    const timestamp = moment().format('YYYYMMDD_HHmmss');  // Use moment.js to get a timestamp
    const backupPath = path.resolve(__dirname, `./productdetails_backup_${timestamp}.xlsx`);

    // Make a copy of the original Excel file
    await copyFile(productAddedFilePath, backupPath);
    console.log(`Backup created: ${backupPath}`);
  } catch (error) {
    console.error('Error creating backup:', error);
  }
}

// Function to clear the Excel file after all tests are completed
async function clearProductDetailsFile() {
  // Try to read the existing file, if it exists
  try {
    const workbook = xlsx.readFile(productAddedFilePath);

    // Create a backup of the file before clearing
    await createBackup();

    // Clear the existing data in the sheet
    workbook.Sheets['Products'] = xlsx.utils.json_to_sheet([]); // Empty the data
    xlsx.writeFile(workbook, productAddedFilePath);
    console.log('Product details file cleared successfully.');
  } catch (error) {
    console.error('Error clearing the Excel file:', error);
  }
}

// Export the functions
module.exports = { 
  readLoginConfig: (environment) => readLoginConfig(configFilePath, environment), 
  readProductData: (environment) => readProductData(productFilePath, environment),
  writeProductDataToExcel,  // Export the function to write product data
  clearProductDetailsFile   // Export the function to clear product details file
};
