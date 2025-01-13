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
  baseUrl, username, password, 
  cardName, cardNumber, cvc, expirationMM, expirationYYYY, 
  productNames, productThumbnails, productCategories, productPrices, productQuantities, productTotals, productManualTotals, 
  name, addressLine1, addressLine2, addressLine3, addressLine4, country, phoneNumber
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
    loginWithValidCredentials: async ({ page, homepage, loginpage }, use) => {
        await page.goto(baseUrl);
        await homepage.navigateToPage('login');
        await homepage.loginExistingUser(username, password);
        await use();
    },
    addProductToCart: async ({ homepage, cartpage }, use) => {
        await homepage.addProductToCart(productNames);
        await cartpage.getCartDetails();
        await use();
    },
    validateProductDataOnHomepage: async ({ page }, use) => {
        const homepageData = await getPageProductDataForAssertion('Homepage');
        await use(homepageData);
    },
    validateProductDataOnCart: async ({ page }, use) => {
        const cartData = await getPageProductDataForAssertion('Shopping Cart');
        await use(cartData);
    },
    proceedToCheckout: async ({ cartpage, checkoutpage }, use) => {
        await cartpage.proceedtoCheckout();
        await checkoutpage.getCheckoutDetails();
        await checkoutpage.getAddressDetails('delivery');
        await checkoutpage.getAddressDetails('billing');
        await use();
    },
    validateDeliveryAddress: async ({}, use) => {
        const addressData = getAddressDataByType('delivery');
        await use(addressData);
    },
    validateBillingAddress: async ({}, use) => {
        const addressData = getAddressDataByType('billing');
        await use(addressData);
    },
    validateProductDataOnCheckout: async ({ page }, use) => {
        const checkoutData = await getPageProductDataForAssertion('Checkout');
        await use(checkoutData);
    },
    proceedToPayment: async ({ checkoutpage, paymentpage }, use) => {
        await checkoutpage.proceedtoPayment();
        await paymentpage.enterPaymentDetails(cardName, cardNumber, cvc, expirationMM, expirationYYYY);
        await use();
    },
    proceedToCompleteOrder: async ({ paymentpage, orderplacedpage }, use) => {
        await paymentpage.proceedtoOrder();
        await use();
    },
    verifyHomepageAfterOrder: async ({ orderplacedpage, homepage }, use) => {
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
