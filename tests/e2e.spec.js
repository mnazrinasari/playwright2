const test = require('../fixtures/fixture');
const { expect } = require('@playwright/test');
const { loadConfig } = require('../config/loader.config');



test.describe('E2E - Online Ordering', () => {

  const config = loadConfig();  
  const {
    baseUrl, username, productNames, productPrices, productQuantities, productTotals, productManualTotals
  } = config;



  // test('Able to login with valid credentials', async ({ loginWithValidCredentials, homepage, loginpage }) => {
  //   await loginWithValidCredentials;
  //   await expect(await homepage.getPageURL()).toMatch(baseUrl);
  //   const retrievedUserName = await loginpage.getuserName();
  //   const expectedLoggedInMessage = `Logged in as ${username}`;
  //   const actualLoggedInMessage = `Logged in as ${retrievedUserName}`;
  //   expect.soft(actualLoggedInMessage).toBe(expectedLoggedInMessage);
  // });

  test('Able to add product to cart', async ({ loginWithValidCredentials, addProductToCart, cartpage }) => {
    await loginWithValidCredentials;
    await addProductToCart;
    await expect(await cartpage.getPageURL()).toMatch('/view_cart');
  });

  test('Validate product data on Homepage', async ({ loginWithValidCredentials, validateProductDataOnHomepage }) => {
    await loginWithValidCredentials;
    await addProductToCart;
    const homepageData = await validateProductDataOnHomepage();
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

  // test('Validate product data on Cart', async ({ validateProductDataOnCart }) => {
  //   const cartData = await validateProductDataOnCart();
  //   expect.soft(Array.isArray(cartData)).toBe(true);
  //   for (let index = 0; index < cartData.length; index++) {
  //     const product = cartData[index];
  //     expect.soft(product.thumbnail).toEqual(productThumbnails[index]);
  //     expect.soft(product.name).toEqual(productNames[index]);
  //     expect.soft(product.category).toEqual(productCategories[index]);
  //     expect.soft(product.price).toEqual(productPrices[index]);
  //     expect.soft(product.quantity).toEqual(productQuantities[index]);
  //     expect.soft(product.total).toEqual(productTotals[index]);
  //     expect.soft(product.manualTotal).toEqual(productManualTotals[index]);
  //   }
  // });

  // test('Able to Proceed Checkout', async ({ proceedToCheckout, checkoutpage }) => {
  //   await proceedToCheckout();
  //   await expect(await checkoutpage.getPageURL()).toMatch('/checkout');
  // });

  // test('Validate delivery address details', async ({ validateDeliveryAddress }) => {
  //   const addressData = await validateDeliveryAddress();
  //   expect(addressData.name).toBe(name);
  //   expect(addressData.address1).toBe(addressLine1);
  //   expect(addressData.address2).toBe(addressLine2);
  //   expect(addressData.address3).toBe(addressLine3);
  //   expect(addressData.address4).toBe(addressLine4);
  //   expect(addressData.country).toBe(country);
  //   expect(addressData.phoneNumber).toBe(phoneNumber);
  // });

  // test('Validate billing address details', async ({ validateBillingAddress }) => {
  //   const addressData = await validateBillingAddress();
  //   expect.soft(addressData.name).toBe(name);
  //   expect.soft(addressData.address1).toBe(addressLine1);
  //   expect.soft(addressData.address2).toBe(addressLine2);
  //   expect.soft(addressData.address3).toBe(addressLine3);
  //   expect.soft(addressData.address4).toBe(addressLine4);
  //   expect.soft(addressData.country).toBe(country);
  //   expect.soft(addressData.phoneNumber).toBe(phoneNumber);
  // });

  // test('Validate product data on Checkout', async ({ validateProductDataOnCheckout, checkoutpage }) => {
  //   const checkoutData = await validateProductDataOnCheckout();

  //   let productTotal = 0;
  //   for (let index = 0; index < checkoutData.length; index++) {
  //     const product = checkoutData[index];
  //     expect.soft(product.thumbnail).toEqual(productThumbnails[index]);
  //     expect.soft(product.name).toEqual(productNames[index]);
  //     expect.soft(product.category).toEqual(productCategories[index]);
  //     expect.soft(product.price).toEqual(productPrices[index]);
  //     expect.soft(product.quantity).toEqual(productQuantities[index]);
  //     expect.soft(product.total).toEqual(productTotals[index]);
  //     expect.soft(product.manualTotal).toEqual(productManualTotals[index]);
  //     productTotal += product.manualTotal;
  //   }
  //   const expectedCheckoutTotal = await checkoutpage.getCheckoutTotal();
  //   expect.soft(productTotal).toBe(expectedCheckoutTotal);
  // });

  // test('Able to proceed to Payment', async ({ proceedToPayment, paymentpage }) => {
  //   await proceedToPayment();
  //   await expect(await paymentpage.getPageURL()).toMatch('/payment');
  // });
});