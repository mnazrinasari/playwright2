const { test: base, expect } = require('@playwright/test');
const { HomePage } = require('../pages/homePage');
const { LoginPage } = require('../pages/loginPage');
const { CartPage } = require('../pages/cartPage');
const { CheckoutPage } = require('../pages/checkoutPage');
const { PaymentPage } = require('../pages/paymentPage');
const { OrderPlacedPage } = require('../pages/orderPlacedPage');
const { loadConfig } = require('../config/loader.config');
const { captureScreenshotOnFailure, cleanupContext } = require('../utils/context.util');
const { getPageProductDataForAssertion, getAddressDataByType } = require('../utils/excel.util');

const config = loadConfig();
const {
    accounts, payments, addresses,
    productNames, productThumbnails, productCategories, productPrices, productQuantities, productTotals, productManualTotals 
    } = config;



const test = base.extend({
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
        const orderplacedpage = new OrderPlacedPage(page);
        await use(orderplacedpage);
    },
    loginWithValidCredentials: async ({ page, homepage }, use, testInfo) => {
      const account = accounts[testInfo.workerIndex % accounts.length];  // Assign account based on worker index
      testInfo.account = account;  // Store the account information in testInfo
      await page.goto(account.baseUrl);
      await homepage.navigateToPage('login');
      await homepage.loginExistingUser(account.login, account.password);
      await use();
    },
    addProductToCart: async ({ homepage, cartpage }, use) => {
        await homepage.addProductToCart(productNames);
        await cartpage.getCartDetails();
        await use();
    },
    deleteProductToCart: async ({ cartpage }, use) => {
        await cartpage.deleteProductToCart();
        await use();
    },
    validateProductDataOnHomepage: async ({ homepage }, use) => {
        const homepageData = await homepage.addProductToCart();
        await use(homepageData);
    },
    validateProductDataOnCart: async ({ cartpage }, use) => {
        const cartData = await cartpage.getCartDetails();
        await use(cartData);
    },
    proceedToCheckout: async ({ cartpage, checkoutpage }, use) => {
        await cartpage.proceedtoCheckout();
        await checkoutpage.getCheckoutDetails();
        await checkoutpage.getAddressDetails('delivery');
        await checkoutpage.getAddressDetails('billing');
        await use();
    },
    navigateToCartFromCheckout: async ({checkoutpage}, use) => {
      await checkoutpage.navigateToCartFromCheckout();
      await use();
    },
    validateDeliveryAddress: async ({checkoutpage}, use) => {
        const addressData = await checkoutpage.getAddressDetails('delivery');
        await use(addressData);
    },
    validateBillingAddress: async ({checkoutpage}, use) => {
        const addressData = await checkoutpage.getAddressDetails('billing');
        await use(addressData);
    },
    validateProductDataOnCheckout: async ({ checkoutpage }, use) => {
        const checkoutData = await checkoutpage.getCheckoutDetails();
        await use(checkoutData);
    },
    proceedToPayment: async ({ checkoutpage, paymentpage }, use, testInfo) => {
        await checkoutpage.proceedtoPayment();
        const payment = payments[testInfo.workerIndex % payments.length];  // Assign account based on worker index
        testInfo.payment = payment; 
        await paymentpage.enterPaymentDetails(payment.cardName, payment.cardNumber, payment.cvc, payment.expirationMM, payment.expirationYYYY);
        await use();
    },
    navigateToCartFromPayment: async ({paymentpage}, use) => {
      await paymentpage.navigateToCartFromPayment();
      await use();
    },
    proceedToCompleteOrder: async ({ paymentpage }, use) => {
        await paymentpage.proceedtoOrder();
        await use();
    },
    verifyHomepageAfterOrder: async ({ orderplacedpage }, use) => {
        await orderplacedpage.proceedContinue();
        await use();
    }
});

// test.afterAll(async ({ browser, context }) => {
//     await cleanupContext(browser, context);
// });

// test.afterEach(async ({ page }, testInfo) => {
//     await captureScreenshotOnFailure({ page, testInfo });
// });

module.exports = test;
