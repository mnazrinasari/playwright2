const test = require('../fixtures/fixture');
const { expect } = require('@playwright/test');
const { loadConfig } = require('../config/loader.config');

let context;




const config = loadConfig();
const {
  baseUrl, accounts, 
  productNames, productThumbnails, productCategories, productPrices, productQuantities, productTotals, productManualTotals, addresses
} = config;

test.describe('E2E - Online Ordering', () => {

  // Setup before tests
  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
  });


  test.beforeEach(async ({ loginWithValidCredentials, addProductToCart, proceedToCheckout }, testInfo) => {
    const account = accounts[testInfo.workerIndex % accounts.length];  // Assign account based on worker index
    testInfo.account = account;  // Store the account information in testInfo
    await loginWithValidCredentials;
    await addProductToCart;
    await proceedToCheckout;


  });

    // Cleanup after tests
  test.afterEach(async ({ navigateToCartFromCheckout, deleteProductToCart }) => {
    await navigateToCartFromCheckout;
    await deleteProductToCart;
  });


  test('Able to Proceed Checkout', async ({ checkoutpage }) => {
    await expect(await checkoutpage.getPageURL()).toMatch('/checkout');

  });

  test('Validate delivery address details', async ({  validateDeliveryAddress }, testInfo) => {
    const addressObject = await validateDeliveryAddress;
    const addressData = addressObject.details;
  
    const address = addresses[testInfo.workerIndex % addresses.length];  // Assign account based on worker index
    testInfo.address = address;
  
    expect.soft(addressData[0]).toBe(address.name);
    expect.soft(addressData[1]).toBe(address.addressLine1);
    expect.soft(addressData[2]).toBe(address.addressLine2);
    expect.soft(addressData[3]).toBe(address.addressLine3);
    expect.soft(addressData[4]).toBe(address.addressLine4);
    expect.soft(addressData[5]).toBe(address.country);
    expect.soft(addressData[6]).toBe(address.phoneNumber);
  });

  test('Validate billing address details', async ({  validateBillingAddress }, testInfo) => {
    const addressObject = await validateBillingAddress;
    const addressData = addressObject.details;
  
    const address = addresses[testInfo.workerIndex % addresses.length];  // Assign account based on worker index
    testInfo.address = address;
  
    expect.soft(addressData[0]).toBe(address.name);
    expect.soft(addressData[1]).toBe(address.addressLine1);
    expect.soft(addressData[2]).toBe(address.addressLine2);
    expect.soft(addressData[3]).toBe(address.addressLine3);
    expect.soft(addressData[4]).toBe(address.addressLine4);
    expect.soft(addressData[5]).toBe(address.country);
    expect.soft(addressData[6]).toBe(address.phoneNumber);
  });

  test('Validate product data on Checkout', async ({ validateProductDataOnCheckout, checkoutpage }) => {
    const cartData = await validateProductDataOnCheckout;
    expect.soft(Array.isArray(cartData)).toBe(true);
    let productTotal = 0;
    for (let index = 0; index < cartData.length; index++) {
      const product = cartData[index];
      expect.soft(product.Thumbnail).toEqual(productThumbnails[index]);
      expect.soft(product.Name).toEqual(productNames[index]);
      expect.soft(product.Category).toEqual(productCategories[index]);
      expect.soft(product.Price).toEqual(productPrices[index]);
      expect.soft(product.Quantity).toEqual(productQuantities[index]);
      expect.soft(product.Total).toEqual(productTotals[index]);
      expect.soft(product.ManualTotal).toEqual(productManualTotals[index]);
      productTotal += product.ManualTotal;
    }
    const expectedCheckoutTotal = await checkoutpage.getCheckoutTotal();
    expect.soft(productTotal).toBe(expectedCheckoutTotal);
  });
});