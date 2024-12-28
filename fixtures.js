const { test: baseTest } = require('@playwright/test');
const { HomePage } = require('./pages/homePage');
const CartPage = require('./pages/cartPage');
const CheckoutPage = require('./pages/checkoutPage');
const PaymentPage = require('./pages/paymentPage');
const OrderPlacedPage = require('./pages/orderPlacedPage');
const { loadConfig } = require('./config/loader.config');

// Load the configuration once
const config = loadConfig();

const test = baseTest.extend({
  homepage: async ({ page }) => new HomePage(page),
  cartpage: async ({ page }) => new CartPage(page),
  checkoutpage: async ({ page }) => new CheckoutPage(page),
  paymentpage: async ({ page }) => new PaymentPage(page),
  orderplacedpage: async ({ page }) => new OrderPlacedPage(page),
  // You can also pass other values, like product data, if needed
  productNames: config.productNames,
  products: config.products,
  productThumbnails: config.productThumbnails,
  productCategories: config.productCategories,
  productPrices: config.productPrices,
  productQuantities: config.productQuantities,
  productTotals: config.productTotals,
  productManualTotals: config.productManualTotals
});

module.exports = { test };
