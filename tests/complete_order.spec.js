const test = require('../fixtures/fixture');
const { expect } = require('@playwright/test');
const { loadConfig } = require('../config/loader.config');


let context;

const config = loadConfig();
const {
  baseUrl, accounts
} = config;

test.describe('E2E - Online Ordering', () => {

    // Setup before tests
  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
  });

  test.beforeEach(async ({ loginWithValidCredentials, addProductToCart, proceedToCheckout, proceedToPayment }, testInfo) => {
    const account = accounts[testInfo.workerIndex % accounts.length];  // Assign account based on worker index
    testInfo.account = account;  // Store the account information in testInfo
    await loginWithValidCredentials;
    await addProductToCart;
    await proceedToCheckout;
    await proceedToPayment;
  });

  
 // Test 10: Able to proceed to Complete Order
 test('Able to proceed to Payment and Complete Order', async ({ proceedToCompleteOrder, orderplacedpage }) => {
  await proceedToCompleteOrder;
  await expect(await orderplacedpage.getPageURL()).toMatch('/payment_done');
  const successMessage = 'Congratulations! Your order has been confirmed!';
  const actualMessage = await orderplacedpage.getSuccessMessage();
  await expect.soft(actualMessage).toBe(successMessage);
  // await expect(actualMessage).toBe('failed');
});

// Test 11: Verify homepage after completing the order
test('Verify homepage is displayed after click continue at Complete Order', async ({ proceedToCompleteOrder,verifyHomepageAfterOrder, homepage }) => {
  await proceedToCompleteOrder;
  await verifyHomepageAfterOrder;
  await expect(await homepage.getPageURL()).toMatch(baseUrl);

  });
});