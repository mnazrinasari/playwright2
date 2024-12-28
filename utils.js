const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const copyFile = promisify(fs.copyFile);
const moment = require('moment');  // We'll use moment.js to generate a timestamp for filenames

// Centralize the paths for both the login and product Excel files
const configFilePath = path.resolve(__dirname, './test-data/accounttestdata.xlsx'); // Path to the login Excel file
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


// Path to your Excel file
const filePath = path.resolve(__dirname, './test-data/productdetails.xlsx'); // Adjust path if necessary

function readPageProductData() {
  try {
    // Read the Excel file
    const workbook = xlsx.readFile(productAddedFilePath);
    const sheetName = 'Products'; // Specify your sheet name if needed
    const sheet = workbook.Sheets[sheetName];

    // Convert the sheet to JSON format
    const data = xlsx.utils.sheet_to_json(sheet);

    // Log the data to verify it's being read correctly
    // console.log('Data from Excel:', data);

    return data;  // Return data as an array of objects
  } catch (error) {
    console.error('Error reading Excel file:', error);
    return [];  // Return an empty array in case of failure
  }
}

// Function to get the product data for a specific page (Homepage, Cart, Checkout, etc.)
function getPageProductDataForAssertion(pageName) {
  // Read data from the Excel file
  const allData = readPageProductData();

  // Log the data to verify the structure
  // console.log('All data from Excel:', allData);

  // Check if data is valid (i.e., an array)
  if (!Array.isArray(allData) || allData.length === 0) {
    console.error('No valid data found for the page:', pageName);
    return [];
  }

  // Filter data for the specified page
  const filteredData = allData.filter(item => {
    // Check if item.Page is defined and is a string
    if (item.Page && typeof item.Page === 'string') {
      return item.Page.toLowerCase() === pageName.toLowerCase();
    }
    // If item.Page is not valid, return false to exclude it
    console.warn('Skipping item due to missing or invalid "Page" field:', item);
    return false;
  });

  // Structure the filtered data so it's easier to access for assertions
  let pageData = [];

  // If there is data for the specified page, format it accordingly
  if (filteredData.length > 0) {
    pageData = filteredData.map(item => ({
      thumbnail: item.Thumbnail,
      name: item.Name,
      category: item.Category,
      price: item.Price,        // Convert price to number
      quantity: Number(item.Quantity),  // Coßnvert quantity to number
      total: Number(item.Total),        // Convert total to number
      manualTotal: Number(item.ManualTotal)  // Convert manualTotal to number
    }));
  
  } else {
    console.warn(`No products found for page: ${pageName}`);
  }

  return pageData;
}


// Function to get the address data for a specific type (e.g., 'billing' or 'delivery')
function getAddressDataByType(addressType) {
  const addressData = readAddressData();

  // Filter the data by address type (e.g., 'billing' or 'delivery')
  const filteredData = addressData.filter(item => item.addressType && item.addressType.toLowerCase() === addressType.toLowerCase());

  if (filteredData.length === 0) {
    console.error(`No address data found for type: ${addressType}`);
    return null;
  }

  return filteredData[0]; // Return the first match for the given address type
}


function readAddressData() {
  try {
    // Read the Excel file
    const workbook = xlsx.readFile(addressDetailsFilePath);
    const sheetName = 'Addresses'; // Assuming the sheet name is 'Addresses'
    const sheet = workbook.Sheets[sheetName];

    // Convert the sheet to JSON (array of objects)
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });  // Read the sheet as an array of arrays (rows)

    // Log the raw data to verify it's being read correctly
    // console.log('Raw Address Data:', data);

    // Map the data (skip the first row which contains headers)
    const addressData = data.slice(1); // Data starts from the second row (excluding the headers)

    // Hardcoded mapping to specific fields like 'name', 'address1', 'address2', etc.
    const mappedData = addressData.map(row => {
      return {
        addressType: row[0],               // Address Type (delivery, billing)
        name: row[1],                       // Name
        address1: row[2],                   // Address Line 1
        address2: row[3],                   // Address Line 2
        address3: row[4],                   // Address Line 3
        address4: row[5],                   // Trim and normalize Address Line 4
        country: row[6],                    // Country
        phoneNumber: row[7]                 // Phone Number
      };
    });

    // Return the mapped address data
    return mappedData;
  } catch (error) {
    console.error('Error reading address data from Excel:', error);
    return [];  // Return an empty array in case of failure
  }
}





// Export the functions
module.exports = { 
  readLoginConfig: (environment) => readLoginConfig(configFilePath, environment), 
  readProductData,
  writeProductDataToExcel,  // Export the function to write product data
  writeAddressDataToExcel,  // Export the function to write address data
  clearProductDetailsFile,
  clearAddressDetailsFile,  // Export the function to clear product details file
  createAddressBackup,   // Export the function to create address backup
  clearAddressDetailsFile,  // Export the function to clear address details file
  getPageProductDataForAssertion,
  getAddressDataByType
};