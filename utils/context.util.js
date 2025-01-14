// import { HomePage } from '../pages/homePage';  // Import your page object for login
// import { clearProductDetailsFile, clearAddressDetailsFile } from './excel.util';  // Your cleanup functions


// // Function to handle screenshot capture on test failure
// export const captureScreenshotOnFailure = async ({ page, testInfo }) => {
//   if (testInfo.status === 'failed') {
//     const screenshotPath = `test-results/screenshots/${testInfo.title}.png`;
//     await page.screenshot({ path: screenshotPath });
//     console.error(`Test failed. Screenshot captured at ${screenshotPath}`);
//   }
// };

// // Function to clean up resources at the end of the test suite
// export const cleanupContext = async (browser, context) => {
//   console.log('Performing cleanup...');

//   // Cleanup any resources if necessary (Excel files, test data, etc.)
//   try {
//     await clearProductDetailsFile();
//     console.log('Cleared test data files.');
//   } catch (error) {
//     console.error('Error clearing test data files:', error);
//   }

//   // Close the context and browser only if necessary
//   try {
//     if (context) {
//       console.log('Closing browser context...');
//       await context.close();
//     } else {
//       console.log('No context found, skipping context close.');
//     }

//     if (browser) {
//       console.log('Closing browser...');
//       await browser.close();  // Ensure the browser is properly closed
//     } else {
//       console.log('No browser found, skipping browser close.');
//     }
//   } catch (error) {
//     console.error('Error during cleanup (closing context/browser):', error);
//   }

// };
