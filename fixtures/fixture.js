// fixtures/fixture.js
const { loadConfig } = require('../config/loader.config');
const { HomePage } = require('../pages/homePage');
const { LoginPage } = require('../pages/loginPage');
const { CartPage } = require('../pages/cartPage');

// Load configuration
const config = loadConfig();  

const { baseUrl, username, password, productNames } = config;  // Destructure the loaded config

if (!baseUrl) {
  throw new Error('Base URL is undefined. Please check your configuration.');
}

// This fixture will handle the login action
export const loginFixture = async ({ page }) => {
  const homepage = new HomePage(page);
  const loginpage = new LoginPage(page);

  // Debugging statement to check baseUrl
  if (!baseUrl) {
    throw new Error('Base URL is undefined. Please check your configuration.');
  }

  console.log('Base URL:', baseUrl); // Ensure baseUrl is correct

  // Navigate to the homepage and perform login
  await page.goto(baseUrl);
  await homepage.navigateToPage('login');
  await loginpage.login(username, password);

  // Ensure that login was successful
  const loggedInMessage = await loginpage.getuserName();
  const expectedMessage = `Logged in as ${username}`;
  if (loggedInMessage !== expectedMessage) {
    throw new Error(`Login failed! Expected: ${expectedMessage}, but got: ${loggedInMessage}`);
  }

  // Return the homepage object so it can be used in subsequent steps
  return homepage;
};

// This fixture will handle adding a product to the cart
export const addProductToCartFixture = async ({ page }) => {
  const homepage = new HomePage(page);
  const cartpage = new CartPage(page);

  // Add products to the cart
  await homepage.addProductToCart(productNames);

  // Ensure that the cart page is loaded
  await page.goto('/view_cart');
  await cartpage.getCartDetails();  // Verify the cart details are correct

  // Return the cart page object for use in further assertions
  return cartpage;
};
