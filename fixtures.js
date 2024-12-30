// const { test } = require('@playwright/test');
// const { loadConfig } = require('./config/loader.config');
// const { createPageContext, cleanupContext } = require('./utils/context.util');
// const LoginPage = require('./pages/loginPage');
// const HomePage = require('./pages/homePage');
// const CartPage = require('./pages/cartPage');
// const CheckoutPage = require('./pages/checkoutPage');
// const PaymentPage = require('./pages/paymentPage');
// const OrderPlacedPage = require('./pages/orderPlacedPage');

// // Load config globally
// const config = loadConfig();
// const {
//   baseUrl, username, password, 
//   cardName, cardNumber, cvc, expirationMM, expirationYYYY, 
//   productNames, productThumbnails, productCategories, productPrices, productQuantities, productTotals, productManualTotals, 
//   name, addressLine1, addressLine2, addressLine3, addressLine4, country, phoneNumber
// } = config;

// test.extend({
//   async pageObjects({ browser }, use) {
//     // Setup page context
//     const { page, context, browser: testBrowser } = await createPageContext({ browser, baseUrl, username, password });

//     // Create page objects
//     const homepage = new HomePage(page);
//     const loginpage = new LoginPage(page);
//     const cartpage = new CartPage(page);
//     const checkoutpage = new CheckoutPage(page);
//     const paymentpage = new PaymentPage(page);
//     const orderplacedpage = new OrderPlacedPage(page);

//     // Pass the page objects and other parameters to the tests
//     await use({
//       page,
//       context,
//       browser: testBrowser,
//       homepage,
//       loginpage,
//       cartpage,
//       checkoutpage,
//       paymentpage,
//       orderplacedpage, // Pass the orderplacedpage fixture here
//       baseUrl,
//       productNames,
//       productThumbnails,
//       productCategories,
//       productPrices,
//       productQuantities,
//       productTotals,
//       productManualTotals,
//       name,
//       addressLine1,
//       addressLine2,
//       addressLine3,
//       addressLine4,
//       country,
//       phoneNumber,
//       cardName,
//       cardNumber,
//       cvc,
//       expirationMM,
//       expirationYYYY
//     });

//     console.log('Passing fixtures to tests', {
//         homepage,
//         loginpage,
//         cartpage,
//         checkoutpage,
//         paymentpage,
//         orderplacedpage,
//       });
      

//     // Cleanup context and page after tests
//     await cleanupContext(testBrowser, context);
//   }
// });

// module.exports = { test }; // Export the extended 'test' object
