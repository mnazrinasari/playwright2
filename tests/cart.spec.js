const test = require('../fixtures/fixture');
const { expect } = require('@playwright/test');
const { loadConfig } = require('../config/loader.config');

let context;


const config = loadConfig();
const {
  accounts, productNames, productThumbnails, productCategories, productPrices, productQuantities, productTotals, productManualTotals
} = config;

test.describe('E2E - Online Ordering', () => {
    // Setup before tests
  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
  });
  
  test.beforeEach(async ({ loginWithValidCredentials, addProductToCart }, testInfo) => {
    const account = accounts[testInfo.workerIndex % accounts.length];  // Assign account based on worker index
    testInfo.account = account;  // Store the account information in testInfo
    await loginWithValidCredentials;
    await addProductToCart;

  });
  test.afterEach(async ({ deleteProductToCart }) => {
    await deleteProductToCart;

  });

 
  test('Able to add product to cart', async ({ cartpage }) => {
    await expect(await cartpage.getPageURL()).toMatch('/view_cart');
  });

  test('Validate product data on Homepage', async ({ validateProductDataOnHomepage }) => {
    const cartData = await validateProductDataOnHomepage;
    expect.soft(Array.isArray(cartData)).toBe(true);
  
    for (let index = 0; index < cartData.length; index++) {
      const product = cartData[index];
      expect.soft(product.Thumbnail).toEqual(productThumbnails[index]);
      expect.soft(product.Name).toEqual(productNames[index]);
      expect.soft(product.Category).toEqual(productCategories[index]);
      expect.soft(product.Price).toEqual(productPrices[index]);
      expect.soft(product.Quantity).toEqual(productQuantities[index]);
      expect.soft(product.Total).toEqual(productTotals[index]);
      expect.soft(product.ManualTotal).toEqual(productManualTotals[index]);
    }    
  });

  test('Validate product data on Cart', async ({ validateProductDataOnCart }) => {
    const cartData = await validateProductDataOnCart;
    expect.soft(Array.isArray(cartData)).toBe(true);
  
    for (let index = 0; index < cartData.length; index++) {
      const product = cartData[index];
      expect.soft(product.Thumbnail).toEqual(productThumbnails[index]);
      expect.soft(product.Name).toEqual(productNames[index]);
      expect.soft(product.Category).toEqual(productCategories[index]);
      expect.soft(product.Price).toEqual(productPrices[index]);
      expect.soft(product.Quantity).toEqual(productQuantities[index]);
      expect.soft(product.Total).toEqual(productTotals[index]);
      expect.soft(product.ManualTotal).toEqual(productManualTotals[index]);
    }
  });
  

});