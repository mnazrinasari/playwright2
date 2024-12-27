const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const copyFile = promisify(fs.copyFile);
const moment = require('moment');  // We'll use moment.js to generate a timestamp for filenames

// Centralize the paths for both the login and product Excel files
const configFilePath = path.resolve(__dirname, './test-data/logintestdata.xlsx'); // Path to the login Excel file
const productFilePath = path.resolve(__dirname, './test-data/producttestdata.xlsx'); // Path to the product Excel file
const productAddedFilePath = path.resolve(__dirname, './test-data/productdetails.xlsx');  // Path to the new file where added product data will be written
const addressDetailsFilePath = path.resolve(__dirname, './test-data/addressdetails.xlsx'); // New path for storing address data

// Function to read login config from Excel and include new fields
function readLoginConfig(filePath, environment) {
  const workbook = xlsx.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(sheet);

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
  // console.log("Product data written to Excel successfully.");
}

function writeAddressDataToExcel(addressType, addressData) {
  let workbook;
  try {
      workbook = xlsx.readFile(addressDetailsFilePath);
  } catch (err) {
      workbook = xlsx.utils.book_new(); // If the file doesn't exist, create a new one
  }

  // Define headers for address data
  const headers = ['Address Type', 'Name', 'Address Line 1', 'Address Line 2', 'Address Line 3', 'Address Line 4','Country', 'Phone Number'];

  // Prepare the data for insertion with the 'Address Type' column
  const sheetData = [
      [addressType, ...addressData],  // Address data with type (delivery or billing)
  ];

  // Check if the 'Addresses' sheet already exists
  if (workbook.Sheets['Addresses']) {
      const existingSheet = workbook.Sheets['Addresses'];
      const existingData = xlsx.utils.sheet_to_json(existingSheet, { header: 1 });  // Read data as rows
      
      // If headers are already present, skip adding them again
      if (existingData.length > 0 && existingData[0][0] === 'Address Type') {
          // Merge new data (skip headers)
          const mergedData = [...existingData, ...sheetData];
          const mergedSheet = xlsx.utils.aoa_to_sheet(mergedData);  // Convert array of arrays back to sheet format
          workbook.Sheets['Addresses'] = mergedSheet;  // Replace existing sheet with updated data
      } else {
          // If no data or headers are missing, create new sheet with headers
          const newSheet = xlsx.utils.aoa_to_sheet([headers, ...sheetData]);
          workbook.Sheets['Addresses'] = newSheet;  // Replace existing sheet with new sheet
      }
  } else {
      // If sheet does not exist, create a new one
      const newSheet = xlsx.utils.aoa_to_sheet([headers, ...sheetData]);
      xlsx.utils.book_append_sheet(workbook, newSheet, 'Addresses');  // Add the new sheet
  }

  // Write the workbook back to the file
  xlsx.writeFile(workbook, addressDetailsFilePath);
  // console.log(`${addressType} address data written to Excel successfully.`);
}





// Function to create a backup of the Excel file
async function createBackup() {
  try {
    const timestamp = moment().format('YYYYMMDD_HHmmss');  // Use moment.js to get a timestamp
    const backupPath = path.resolve(__dirname, `./test-data/backup/productdetails_backup_${timestamp}.xlsx`);

    // Make a copy of the original Excel file
    await copyFile(productAddedFilePath, backupPath);
    // console.log(`Backup created: ${backupPath}`);
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
    // console.log('Product details file cleared successfully.');
  } catch (error) {
    console.error('Error clearing the Excel file:', error);
  }
}

// Function to create a backup of the address details Excel file
async function createAddressBackup() {
  try {
    const timestamp = moment().format('YYYYMMDD_HHmmss');  // Use moment.js to get a timestamp
    const backupPath = path.resolve(__dirname, `./test-data/backup/addressdetails_backup_${timestamp}.xlsx`);

    // Make a copy of the original Excel file
    await copyFile(addressDetailsFilePath, backupPath);
    // console.log(`Backup created for address details: ${backupPath}`);
  } catch (error) {
    console.error('Error creating address details backup:', error);
  }
}

// Function to clear the address details file (addressdetails.xlsx)
// Function to clear the address details file (addressdetails.xlsx)
async function clearAddressDetailsFile() {
  try {
    // Read the workbook
    const workbook = xlsx.readFile(addressDetailsFilePath);

    // Create a backup of the file before clearing
    await createAddressBackup();  // Ensure backup is completed asynchronously

    // Check if 'delivery' and 'billing' sheets exist and clear their content
    if (workbook.Sheets['delivery']) {
      workbook.Sheets['delivery'] = xlsx.utils.json_to_sheet([]);  // Empty the 'delivery' sheet data
    }

    if (workbook.Sheets['billing']) {
      workbook.Sheets['billing'] = xlsx.utils.json_to_sheet([]);  // Empty the 'billing' sheet data
    }

    // If the 'Addresses' sheet exists, we can clear that too
    if (workbook.Sheets['Addresses']) {
      workbook.Sheets['Addresses'] = xlsx.utils.json_to_sheet([]); // Empty the 'Addresses' sheet data
    }

    // Write the modified workbook back to the file
    xlsx.writeFile(workbook, addressDetailsFilePath);
    // console.log('Address details file cleared successfully.');

  } catch (error) {
    console.error('Error clearing the address details file:', error);
  }
}



// Export the functions
module.exports = { 
  readLoginConfig: (environment) => readLoginConfig(configFilePath, environment), 
  readProductData: (environment) => readProductData(productFilePath, environment),
  writeProductDataToExcel,  // Export the function to write product data
  writeAddressDataToExcel,  // Export the function to write address data
  clearProductDetailsFile,
  clearAddressDetailsFile,  // Export the function to clear product details file
  createAddressBackup,   // Export the function to create address backup
  clearAddressDetailsFile  // Export the function to clear address details file
};