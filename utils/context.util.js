import { HomePage } from '../pages/homePage';  // Import your page object for login
import { clearProductDetailsFile, clearAddressDetailsFile } from './excel.util';  // Your cleanup functions

// Function to create a new browser context and page
export const createPageContext = async ({ browser, baseUrl, username, password }) => {
  // Ensure username and password are defined
  if (!username || !password) {
    throw new Error('Username or Password is undefined');
  }

  // Create a new browser context
  const context = await browser.newContext();

  // Create a new page in the context
  const page = await context.newPage();

  // Set viewport size to simulate a maximized window (optional)
  await page.setViewportSize({ width: 1280, height: 800 });
  
  // Emulate media for desktop simulation
  await page.emulateMedia({ media: 'screen' });

  // Navigate to the base URL
  await page.goto(baseUrl);

  // Assuming HomePage is the page object with login functionality
  const homepage = new HomePage(page);

  // Navigate to login page and login using credentials
  await homepage.navigateToPage('login');
  await homepage.loginExistingUser(username, password);

  // Return context and page to be shared across tests
  return { context, page };
};

// Function to handle screenshot capture on test failure
export const captureScreenshotOnFailure = async ({ page, testInfo }) => {
  if (testInfo.status === 'failed') {
    const screenshotPath = `test-results/screenshots/${testInfo.title}.png`;
    await page.screenshot({ path: screenshotPath });
    console.error(`Test failed. Screenshot captured at ${screenshotPath}`);
  }
};

// Function to clean up resources at the end of the test suite
export const cleanupContext = async (browser, context) => {
  console.log('Performing cleanup...');

  // Cleanup any resources if necessary (Excel files, test data, etc.)
  try {
    await clearProductDetailsFile();
    await clearAddressDetailsFile();
    console.log('Cleared test data files.');
  } catch (error) {
    console.error('Error clearing test data files:', error);
  }

  // Close the context and browser only if necessary
  try {
    if (context) {
      console.log('Closing browser context...');
      await context.close();
    } else {
      console.log('No context found, skipping context close.');
    }

    if (browser) {
      console.log('Closing browser...');
      await browser.close();  // Ensure the browser is properly closed
    } else {
      console.log('No browser found, skipping browser close.');
    }
  } catch (error) {
    console.error('Error during cleanup (closing context/browser):', error);
  }

};
