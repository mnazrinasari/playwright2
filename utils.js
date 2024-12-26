const xlsx = require('xlsx');
const path = require('path');

// Centralize the paths for both the login and product Excel files
const configFilePath = path.resolve(__dirname, './logintestdata.xlsx'); // Path to the login Excel file
const productFilePath = path.resolve(__dirname, './producttestdata.xlsx'); // Path to the product Excel file

// Function to read login config from Excel (this stays the same)
function readLoginConfig(filePath, environment) {
  const workbook = xlsx.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(sheet);
  
  const config = data.find(row => row.Environment && row.Environment.trim().toLowerCase() === environment.trim().toLowerCase());
  
  if (!config) {
    throw new Error(`Configuration not found for environment: ${environment}`);
  }
  
  return {
    baseUrl: config.BaseUrl,
    username: config.Username,
    password: config.Password,
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

// Export the functions with the paths centralized
module.exports = { 
  readLoginConfig: (environment) => readLoginConfig(configFilePath, environment), 
  readProductData: (environment) => readProductData(productFilePath, environment)
};
