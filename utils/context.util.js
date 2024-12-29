import { HomePage } from '../pages/homePage';  // Assuming you have this page object
import { clearProductDetailsFile, clearAddressDetailsFile } from './excel.util';  // Your cleanup functions

// Function to create a new browser context and page
export const createPageContext = async ({ browser, baseUrl, username, password }) => {
  const context = await browser.newContext();
  const page = await context.newPage();

  // Set the viewport size to simulate a maximized window (1920x1080 resolution as an example)
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.emulateMedia({ media: 'screen' }); 

  // Set up page state, like logging in
  const homepage = new HomePage(page);  // Assuming you have this page object
  if (!username || !password) {
    throw new Error('Username or Password is undefined');
  }
  
  // Navigate to the home page, login, etc.
  await page.goto(baseUrl);
  await homepage.navigateToPage('login');
  await homepage.loginExistingUser(username, password);

  return { browser, context, page };
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
  await clearProductDetailsFile();
  await clearAddressDetailsFile();

  if (context) {
    console.log('Closing browser context...');
    await context.close();
  }
  if (browser) {
    await browser.close();  // Ensure to close the browser as well
  }
};
