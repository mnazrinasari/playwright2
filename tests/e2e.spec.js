const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/loginPage');
const { HomePage } = require('../pages/homePage');
const CartPage = require('../pages/cartPage');
const CheckoutPage = require('../pages/checkoutPage');
const PaymentPage = require('../pages/paymentPage');
const OrderPlacedPage = require('../pages/orderPlacedPage');
const { loadConfig } = require('../config/loader.config');
const { createPageContext, captureScreenshotOnFailure, cleanupContext } = require('../utils/context.util');
const {  getPageProductDataForAssertion, getAddressDataByType } = require('../utils/excel.util');



const config = loadConfig();  // The loader config will automatically choose the environment based on TEST_ENV or default to 'test'
const {
  baseUrl, username, password, 
  cardName, cardNumber, cvc, expirationMM, expirationYYYY, 
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

  test('Able to login with valid credentials', async () => {
    const loginpage = new LoginPage(page);
    expect(await loginPage.getPageURL()).toMatch(/login/);
    expect(loginpage.getPageURL());
    const retrievedUserName = await loginpage.getuserName();
    const expectedLoggedInMessage = `Logged in as ${username}`;
    const actualLoggedInMessage = `Logged in as ${retrievedUserName}`;
    expect(actualLoggedInMessage).toBe(expectedLoggedInMessage);
  });

  test('Able to add product to cart', async () => {
    const homepage = new HomePage(page);
    const cartpage = new CartPage(page);

    await homepage.addProductToCart(productNames);  // Using the first product name
    await cartpage.getCartDetails();
  });

  test('Validate product data on Homepage', async () => {
    const homepageData = await getPageProductDataForAssertion('Homepage');

    for (let index = 0; index < homepageData.length; index++) {
      const product = homepageData[index];
      // expect.soft(product.thumbnail).toEqual(productThumbnails[index]);
      expect.soft(product.name).toEqual(productNames[index]);
      expect.soft(product.category).toEqual("");
      expect.soft(product.price).toEqual(productPrices[index]);
      expect.soft(product.quantity).toEqual(productQuantities[index]);
      expect.soft(product.total).toEqual(productTotals[index]);
      expect.soft(product.manualTotal).toEqual(productManualTotals[index]);
    }
  });

  test('Validate product data on Cart', async () => {
    const homepageData = await getPageProductDataForAssertion('Shopping Cart');
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

  test('Test able to Proceed Checkout', async () => {
    const cartpage = new CartPage(page);
    const checkoutpage = new CheckoutPage(page);

    await cartpage.proceedtoCheckout();
    await checkoutpage.getCheckoutDetails();
    await checkoutpage.getAddressDetails('delivery');
    await checkoutpage.getAddressDetails('billing');
  });

  test('Validate delivery address details', async () => {
    // Get the delivery address data from the Excel file or another data source
    const addressData = getAddressDataByType('delivery');
  
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

    // Assert individual fields for the delivery address
    expect.soft(addressData.name).toBe(name);
    expect.soft(addressData.address1).toBe(addressLine1);
    expect.soft(addressData.address2).toBe(addressLine2);
    expect.soft(addressData.address3).toBe(addressLine3);
    expect.soft(addressData.address4).toBe(addressLine4);
    expect.soft(addressData.country).toBe(country);
    expect.soft(addressData.phoneNumber).toBe(phoneNumber);
  });

  test('Validate product data on Checkout', async () => {
    const checkoutpage = new CheckoutPage(page);
    const homepageData = await getPageProductDataForAssertion('Checkout');
    expect(homepageData).toBeDefined();
    expect(Array.isArray(homepageData)).toBe(true);
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

  test('Able to proceed to Payment', async () => {
    const checkoutpage = new CheckoutPage(page);
    const paymentpage = new PaymentPage(page);

    await checkoutpage.proceedtoPayment();
    await paymentpage.enterPaymentDetails(
      cardName,
      cardNumber,
      cvc,
      expirationMM,
      expirationYYYY
    );
  });

  test('Able to proceed to Complete Order', async () => {
    const paymentpage = new PaymentPage(page);
    const orderplacedpage = new OrderPlacedPage(page);

    await paymentpage.proceedtoOrder();
    const successMessage = 'Congratulations! Your order has been confirmed!';
    const actualMessage = await orderplacedpage.getSuccessMessage();
    await expect.soft(actualMessage).toBe(successMessage);

  });

  test('Verify homepage is displayed after click continue at Complete Order', async () => {
    const orderplacedpage = new OrderPlacedPage(page);

    await orderplacedpage.proceedContinue();

  });
});



