const { test: base, expect } = require('@playwright/test');
const { HomePage } = require('./pages/homePage');
const { LoginPage } = require('./pages/loginPage');
const { CartPage } = require('./pages/cartPage');
const { CheckoutPage } = require('./pages/checkoutPage');
const { PaymentPage } = require('./pages/paymentPage');
const { OrderPlacedPage } = require('./pages/orderPlacedPage'); // Ensure this is correctly imported
const { loadConfig } = require('./config/loader.config');

// Load config globally (if needed for your tests)
const config = loadConfig();
const {
  baseUrl, username, password, 
  cardName, cardNumber, cvc, expirationMM, expirationYYYY,
  productNames, productThumbnails, productCategories, productPrices, productQuantities, productTotals, productManualTotals,
  name, addressLine1, addressLine2, addressLine3, addressLine4, country, phoneNumber
} = config;

const test = base.extend({
  // This fixture will be shared across all tests
  contextAndPage: async ({ browser }, use) => {
    if (!username || !password) {
      throw new Error('Username or Password is undefined');
    }

    // Create the context and page once
    const context = await browser.newContext();
    const page = await context.newPage();

    // Set viewport size and emulate media
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ media: 'screen' });

    // Navigate to the base URL and login
    await page.goto(baseUrl);
    const homepage = new HomePage(page);
    await homepage.navigateToPage('login');
    await homepage.loginExistingUser(username, password);

    // Share the context and page across tests
    await use({ context, page });
  },

  // Other page fixtures (no change here)
  homepage: async ({ page }, use) => {
    const homepage = new HomePage(page);
    await use(homepage);
  },
  
  loginpage: async ({ page }, use) => {
    const loginpage = new LoginPage(page);
    await use(loginpage);
  },

  cartpage: async ({ page }, use) => {
    const cartpage = new CartPage(page);
    await use(cartpage);
  },

  checkoutpage: async ({ page }, use) => {
    const checkoutpage = new CheckoutPage(page);
    await use(checkoutpage);
  },

  paymentpage: async ({ page }, use) => {
    const paymentpage = new PaymentPage(page);
    await use(paymentpage);
  },

  orderplacedpage: async ({ page }, use) => {
    const orderplacedpage = new OrderPlacedPage(page); // Correct instantiation
    await use(orderplacedpage);
  },

  // Other configuration fixtures
  baseUrl: async ({}, use) => {
    await use(baseUrl);
  },

  username: async ({}, use) => {
    await use(username);
  },

  password: async ({}, use) => {
    await use(password);
  },

  cardName: async ({}, use) => {
    await use(cardName);
  },

  cardNumber: async ({}, use) => {
    await use(cardNumber);
  },

  cvc: async ({}, use) => {
    await use(cvc);
  },

  expirationMM: async ({}, use) => {
    await use(expirationMM);
  },

  expirationYYYY: async ({}, use) => {
    await use(expirationYYYY);
  },

  // Optional: If you have more data to pass to the tests, you can add them here as needed
  productNames: async ({}, use) => {
    await use(productNames);
  },

  productThumbnails: async ({}, use) => {
    await use(productThumbnails);
  },

  productCategories: async ({}, use) => {
    await use(productCategories);
  },

  productPrices: async ({}, use) => {
    await use(productPrices);
  },

  productQuantities: async ({}, use) => {
    await use(productQuantities);
  },

  productTotals: async ({}, use) => {
    await use(productTotals);
  },

  productManualTotals: async ({}, use) => {
    await use(productManualTotals);
  },

  name: async ({}, use) => {
    await use(name);
  },

  addressLine1: async ({}, use) => {
    await use(addressLine1);
  },

  addressLine2: async ({}, use) => {
    await use(addressLine2);
  },

  addressLine3: async ({}, use) => {
    await use(addressLine3);
  },

  addressLine4: async ({}, use) => {
    await use(addressLine4);
  },

  country: async ({}, use) => {
    await use(country);
  },

  phoneNumber: async ({}, use) => {
    await use(phoneNumber);
  }
});

module.exports = { test, expect };
