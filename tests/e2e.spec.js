const { test, expect } = require('@playwright/test');
const { HomePage } = require('../pages/homePage');
const { LoginPage }= require('../pages/loginPage');
const { CartPage } = require('../pages/cartPage');
const { CheckoutPage } = require('../pages/checkoutPage');
const { PaymentPage } = require('../pages/paymentPage');
const { OrderPlacedPage } = require('../pages/orderPlacedPage');
const { loadConfig } = require('../config/loader.config');
const { createPageContext, captureScreenshotOnFailure, cleanupContext } = require('../utils/context.util');
const { getPageProductDataForAssertion, getAddressDataByType } = require('../utils/excel.util');

// Load configuration
const config = loadConfig();  
const {
  baseUrl, username, password, 
  cardName, cardNumber, cvc, expirationMM, expirationYYYY, 
  productNames, productThumbnails, productCategories, productPrices, productQuantities, productTotals, productManualTotals, 
  name, addressLine1, addressLine2, addressLine3, addressLine4, country, phoneNumber
} = config;

// Extend test with page context and page objects
test.describe('E2E - Online Ordering', () => {
  let page;
  let context;
  let browser;
  let homepage, loginpage, cartpage, checkoutpage, paymentpage, orderplacedpage;

  // Setup before tests - Initialize page objects once
  test.beforeAll(async ({ browser: testBrowser }) => {
    // Initialize the browser context
    const setup = await createPageContext({ browser: testBrowser, baseUrl, username, password });
    browser = setup.browser;
    context = setup.context;
    page = setup.page;

    // Initialize page objects once
    homepage = new HomePage(page);
    loginpage = new LoginPage(page);
    cartpage = new CartPage(page);
    checkoutpage = new CheckoutPage(page);
    paymentpage = new PaymentPage(page);
    orderplacedpage = new OrderPlacedPage(page);
  });

  // Cleanup after tests
  test.afterAll(async () => {
    await cleanupContext(browser, context);
  });

  // Screenshot on failure after each test
  test.afterEach(async ({ page }, testInfo) => {
    await captureScreenshotOnFailure({ page, testInfo });
  });

  // Test 1: Able to login with valid credentials
  test('Able to login with valid credentials', async () => {
    await expect(await homepage.getPageURL()).toMatch(baseUrl);
    const retrievedUserName = await loginpage.getuserName();
    const expectedLoggedInMessage = `Logged in as ${username}`;
    const actualLoggedInMessage = `Logged in as ${retrievedUserName}`;
    expect.soft(actualLoggedInMessage).toBe(expectedLoggedInMessage);
  });

  // Test 2: Able to add product to cart
  test('Able to add product to cart', async () => {
    await homepage.addProductToCart(productNames); 
    await expect(await cartpage.getPageURL()).toMatch('/view_cart');
    await cartpage.getCartDetails();
  });

  // Test 3: Validate product data on Homepage
  test('Validate product data on Homepage', async () => {
    const homepageData = await getPageProductDataForAssertion('Homepage');
    for (let index = 0; index < homepageData.length; index++) {
      const product = homepageData[index];
      expect.soft(product.name).toEqual(productNames[index]);
      expect.soft(product.category).toEqual("");
      expect.soft(product.price).toEqual(productPrices[index]);
      expect.soft(product.quantity).toEqual(productQuantities[index]);
      expect.soft(product.total).toEqual(productTotals[index]);
      expect.soft(product.manualTotal).toEqual(productManualTotals[index]);
    }
  });

  // Test 4: Validate product data on Cart
  test('Validate product data on Cart', async () => {
    const homepageData = await getPageProductDataForAssertion('Shopping Cart');
    expect.soft(Array.isArray(homepageData)).toBe(true);
    for (let index = 0; index < homepageData.length; index++) {
      const product = homepageData[index];
      expect.soft(product.thumbnail).toEqual(productThumbnails[index]);
      expect.soft(product.name).toEqual(productNames[index]);
      expect.soft(product.category).toEqual(productCategories[index]);
      expect.soft(product.price).toEqual(productPrices[index]);
      expect.soft(product.quantity).toEqual(productQuantities[index]);
      expect.soft(product.total).toEqual(productTotals[index]);
      expect.soft(product.manualTotal).toEqual(productManualTotals[index]);
    }
  });

  // Test 5: Able to Proceed Checkout
  test('Able to Proceed Checkout', async () => {
    await cartpage.proceedtoCheckout();
    await expect(await checkoutpage.getPageURL()).toMatch('/checkout');
    await checkoutpage.getCheckoutDetails();
    await checkoutpage.getAddressDetails('delivery');
    await checkoutpage.getAddressDetails('billing');
  });

  // Test 6: Validate delivery address details
  test('Validate delivery address details', async () => {
    const addressData = getAddressDataByType('delivery');
    expect(addressData.name).toBe(name);
    expect(addressData.address1).toBe(addressLine1);
    expect(addressData.address2).toBe(addressLine2);
    expect(addressData.address3).toBe(addressLine3);
    expect(addressData.address4).toBe(addressLine4);
    expect(addressData.country).toBe(country);
    expect(addressData.phoneNumber).toBe(phoneNumber);
  });

  // Test 7: Validate billing address details
  test('Validate billing address details', async () => {
    const addressData = getAddressDataByType('billing');
    expect.soft(addressData.name).toBe(name);
    expect.soft(addressData.address1).toBe(addressLine1);
    expect.soft(addressData.address2).toBe(addressLine2);
    expect.soft(addressData.address3).toBe(addressLine3);
    expect.soft(addressData.address4).toBe(addressLine4);
    expect.soft(addressData.country).toBe(country);
    expect.soft(addressData.phoneNumber).toBe(phoneNumber);
  });

  // Test 8: Validate product data on Checkout
  test('Validate product data on Checkout', async () => {
    const homepageData = await getPageProductDataForAssertion('Checkout');

    let productTotal = 0;
    for (let index = 0; index < homepageData.length; index++) {
      const product = homepageData[index];
      expect.soft(product.thumbnail).toEqual(productThumbnails[index]);
      expect.soft(product.name).toEqual(productNames[index]);
      expect.soft(product.category).toEqual(productCategories[index]);
      expect.soft(product.price).toEqual(productPrices[index]);
      expect.soft(product.quantity).toEqual(productQuantities[index]);
      expect.soft(product.total).toEqual(productTotals[index]);
      expect.soft(product.manualTotal).toEqual(productManualTotals[index]);
      productTotal += product.manualTotal;
    }
    const expectedCheckoutTotal = await checkoutpage.getCheckoutTotal();
    expect.soft(productTotal).toBe(expectedCheckoutTotal);
  });

  // Test 9: Able to proceed to Payment
  test('Able to proceed to Payment', async () => {
    await checkoutpage.proceedtoPayment();
    await expect(await paymentpage.getPageURL()).toMatch('/payment');
    await paymentpage.enterPaymentDetails(
      cardName,
      cardNumber,
      cvc,
      expirationMM,
      expirationYYYY
    );
  });

  // Test 10: Able to proceed to Complete Order
  test('Able to proceed to Complete Order', async () => {
    await paymentpage.proceedtoOrder();
    await expect(await orderplacedpage.getPageURL()).toMatch('/payment_done');
    const successMessage = 'Congratulations! Your order has been confirmed!';
    const actualMessage = await orderplacedpage.getSuccessMessage();
    await expect.soft(actualMessage).toBe(successMessage);
    // await expect(actualMessage).toBe('failed');


  });

  // Test 11: Verify homepage after completing the order
  test('Verify homepage is displayed after click continue at Complete Order', async () => {
    await orderplacedpage.proceedContinue();
    await expect(await homepage.getPageURL()).toMatch(baseUrl);

  });
});
