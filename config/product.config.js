// product.config.js
const { readProductData } = require('../utils'); // Import the readProductData function from utils

// Function to load product data for the given environment
function loadProductConfig(environment) {
  // Get product data based on the environment (this will be the filtered data from the Excel file)
  const products = readProductData(environment);

  // Extract specific fields from the product data and create arrays for each field
  const productNames = products.map(product => product.Name);
  const productThumbnails = products.map(product => product.Thumbnail);
  const productCategories = products.map(product => product.Category);
  const productPrices = products.map(product => product.Price);
  const productQuantities = products.map(product => product.Quantity);
  const productTotals = products.map(product => product.Total);
  const productManualTotals = products.map(product => product['Manual Total']);

  // Return the product data as separate arrays
  return {
    products,                // Full product data
    productNames,            // Product names (just the names of the products)
    productThumbnails,       // Product thumbnails
    productCategories,       // Product categories
    productPrices,           // Product prices
    productQuantities,       // Product quantities
    productTotals,           // Product totals
    productManualTotals,     // Product manual totals
  };
}

module.exports = { loadProductConfig };