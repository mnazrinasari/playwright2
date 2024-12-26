import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/homePage'; // Assuming you have a HomePage class
import { getEnvironmentConfig } from '../environment.config'; // Import the config file
import { readProductData } from '../utils'; // Import the readProductData function from utils.js

// Get the environment-specific config (base URL, username, password)
let config;
try {
  config = getEnvironmentConfig(); // Read the config based on environment
} catch (error) {
  console.error(error.message);
  process.exit(1); // Exit if the environment config can't be found
}

// Extract values from the config
const { environment, baseUrl, username, password } = config;

// Get the product data for the environment
let productData;
productData = readProductData(environment); // Retrieve product data based on environment
const productName = productData.map(product => product.Name);


// Test suite using the config values
test.describe('Login Tests', () => {
  let page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();

    // Ensure that username and password are valid
    if (!username || !password) {
      throw new Error('Username or Password is undefined');
    }

    await page.goto(baseUrl); // Navigate to the base URL dynamically set from config
  });

  test('Login with valid credentials', async () => {
    const homepage = new HomePage(page);
    await homepage.navigateToPage('login');
    await homepage.loginExistingUser(username, password);

    // Check the login success message
    const userNameElement = await page.locator('a b');
    await userNameElement.waitFor({ state: 'attached' });
    const retrievedUserName = await userNameElement.textContent();

    const expectedLoggedInMessage = `Logged in as ${username}`;
    const actualLoggedInMessage = `Logged in as ${retrievedUserName}`;
    expect(expectedLoggedInMessage).toBe(actualLoggedInMessage);
  });

  test('Add product to cart', async () => {
    const homepage = new HomePage(page);
    await homepage.addProductToCart(productName);
  });

  test.afterAll(async () => {
    await page.close(); // Close the browser page after tests
  });
});
