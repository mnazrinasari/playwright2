const { test, expect } = require('@playwright/test');
const { HomePage } = require('../pages/homePage');
const CartPage = require('../pages/cartPage');
const CheckoutPage = require('../pages/checkoutPage');
const PaymentPage = require('../pages/paymentPage');
const OrderPlacedPage = require('../pages/orderPlacedPage');
const { loadConfig } = require('../config/loader.config');
const { createPageContext, captureScreenshotOnFailure, cleanupContext } = require('../context');  // Import context functions
const {  getPageProductDataForAssertion, getAddressDataByType } = require('../utils');



const config = loadConfig();  // The loader config will automatically choose the environment based on TEST_ENV or default to 'test'
const {
  baseUrl, username, password, 
  nameOnCard, cardNumber, cvc, expirationMM, expirationYYYY, 
  productNames, productThumbnails, productCategories, productPrices, productQuantities, productTotals, productManualTotals, 
  name, addressLine1, addressLine2, addressLine3, addressLine4, country, phoneNumber
} = config;  // Destructure config to get product data

test.describe('Login Tests', () => {
  let page;
  let context;
  let browser;

  // Create a new browser context and page using the helper function before each test
  test.beforeAll(async ({ browser: testBrowser }) => {
    // Pass the browser object directly to createPageContext
    const setup = await createPageContext({ browser: testBrowser, baseUrl, username, password });
    browser = setup.browser;
    context = setup.context;
    page = setup.page;
  });

  test.afterAll(async () => {
    await cleanupContext(browser, context);  // Cleanup the resources
  });

  test.afterEach(async ({ page }, testInfo) => {
    await captureScreenshotOnFailure({ page, testInfo });  // Capture screenshot on failure
  });

  test('Login with valid credentials', async () => {
    const userNameElement = await page.locator('a b');
    await userNameElement.waitFor({ state: 'attached' });
    const retrievedUserName = await userNameElement.textContent();

    const expectedLoggedInMessage = `Logged in as ${username}`;
    const actualLoggedInMessage = `Logged in as ${retrievedUserName}`;
    expect(actualLoggedInMessage).toBe(expectedLoggedInMessage);
  });

  test('Add product to cart', async () => {
    const homepage = new HomePage(page);
    const cartpage = new CartPage(page);

    await homepage.addProductToCart(productNames);  // Using the first product name
    await cartpage.getCartDetails();
  });

  test.skip('Validate product data on Homepage', async () => {
    const homepageData = await getPageProductDataForAssertion('Homepage');
    expect(homepageData).toBeDefined();
    expect(Array.isArray(homepageData)).toBe(true);

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

  test('Validate product data on Cart', async () => {
    const homepageData = await getPageProductDataForAssertion('Cart');
    expect(homepageData).toBeDefined();
    expect(Array.isArray(homepageData)).toBe(true);

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

  test('Proceed Checkout', async () => {
    const cartpage = new CartPage(page);
    const checkoutpage = new CheckoutPage(page);

    await cartpage.proceedtoCheckout();
    await checkoutpage.getCheckoutDetails();
    const delivery = await checkoutpage.getAddressDetails('delivery');
    console.log(delivery);
    await checkoutpage.getAddressDetails('billing');
  });

  test('Validate delivery address details', async () => {
    // Get the delivery address data from the Excel file or another data source
    const addressData = getAddressDataByType('delivery');
    
    // Assert that delivery address data exists
    expect(addressData).toBeDefined();
  
    // Assert individual fields for the delivery address
    expect(addressData.name).toBe(name);
    expect(addressData.address1).toBe(addressLine1);
    expect(addressData.address2).toBe(addressLine2);
    expect(addressData.address3).toBe(addressLine3);
    expect(addressData.address4).toBe(addressLine4);
    expect(addressData.country).toBe(country);
    expect(addressData.phoneNumber).toBe(phoneNumber);
  });

  test('Validate billing address details', async () => {
    // Get the delivery address data from the Excel file or another data source
    const addressData = getAddressDataByType('billing');
    
    // Assert that delivery address data exists
    expect(addressData).toBeDefined();
  
    // Assert individual fields for the delivery address
    expect(addressData.name).toBe(name);
    expect(addressData.address1).toBe(addressLine1);
    expect(addressData.address2).toBe(addressLine2);
    expect(addressData.address3).toBe(addressLine3);
    expect(addressData.address4).toBe(addressLine4);
    expect(addressData.country).toBe(country);
    expect(addressData.phoneNumber).toBe(phoneNumber);
  });

  test('Validate product data on Checkout', async () => {
    const homepageData = await getPageProductDataForAssertion('Checkout');
    expect(homepageData).toBeDefined();
    expect(Array.isArray(homepageData)).toBe(true);

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

  test('Proceed Payment', async () => {
    const checkoutpage = new CheckoutPage(page);
    const paymentpage = new PaymentPage(page);

    await checkoutpage.proceedtoPayment();
    await paymentpage.enterPaymentDetails(
      nameOnCard,
      cardNumber,
      cvc,
      expirationMM,
      expirationYYYY
    );
  });

  test('Proceed Complete Order', async () => {
    const paymentpage = new PaymentPage(page);
    const orderplacedpage = new OrderPlacedPage(page);

    await paymentpage.proceedtoOrder();
    await orderplacedpage.proceedContinue();
  });
});
