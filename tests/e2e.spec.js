const test = require('../fixtures/fixture');
const { expect } = require('@playwright/test');
const { loadConfig } = require('../config/loader.config');
const { createPageContext, captureScreenshotOnFailure, cleanupContext } = require('../utils/context.util');



let context;

// Setup before tests
test.beforeAll(async ({ browser }) => {
  context = await browser.newContext();
});

// Cleanup after tests
test.afterEach(async () => {
  await cleanupContext(context);
});


test.describe('E2E - Online Ordering', () => {

  const config = loadConfig();  
  const {
    baseUrl, username, password, 
    cardName, cardNumber, cvc, expirationMM, expirationYYYY, 
    productNames, productThumbnails, productCategories, productPrices, productQuantities, productTotals, productManualTotals, 
    name, addressLine1, addressLine2, addressLine3, addressLine4, country, phoneNumber
  } = config;


  test('Able to login with valid credentials', async ({ loginWithValidCredentials, homepage, loginpage }) => {
    await loginWithValidCredentials;
    await expect(await homepage.getPageURL()).toMatch(baseUrl);
    const retrievedUserName = await loginpage.getuserName();
    const expectedLoggedInMessage = `Logged in as ${username}`;
    const actualLoggedInMessage = `Logged in as ${retrievedUserName}`;
    expect.soft(actualLoggedInMessage).toBe(expectedLoggedInMessage);
  });

  test('Able to add product to cart', async ({ loginWithValidCredentials, addProductToCart, deleteProductToCart, cartpage }) => {
    await loginWithValidCredentials;
    await addProductToCart;
    await expect(await cartpage.getPageURL()).toMatch('/view_cart');
    await deleteProductToCart;
  });

  test('Validate product data on Homepage', async ({ loginWithValidCredentials, addProductToCart, validateProductDataOnHomepage, deleteProductToCart }) => {
    await loginWithValidCredentials;
    await addProductToCart;
    const homepageData = await validateProductDataOnHomepage;
    for (let index = 0; index < homepageData.length; index++) {
      const product = homepageData[index];
      await expect.soft(product.name).toEqual(productNames[index]);
      await expect.soft(product.category).toEqual("");
      await expect.soft(product.price).toEqual(productPrices[index]);
      await expect.soft(product.quantity).toEqual(productQuantities[index]);
      await expect.soft(product.total).toEqual(productTotals[index]);
      await expect.soft(product.manualTotal).toEqual(productManualTotals[index]);
    }    
    await deleteProductToCart;
  });

  test('Validate product data on Cart', async ({ loginWithValidCredentials, addProductToCart, validateProductDataOnCart, deleteProductToCart }) => {
    await loginWithValidCredentials;
    await addProductToCart;
    const cartData = await validateProductDataOnCart;
    expect.soft(Array.isArray(cartData)).toBe(true);
    for (let index = 0; index < cartData.length; index++) {
      const product = cartData[index];
      expect.soft(product.thumbnail).toEqual(productThumbnails[index]);
      expect.soft(product.name).toEqual(productNames[index]);
      expect.soft(product.category).toEqual(productCategories[index]);
      expect.soft(product.price).toEqual(productPrices[index]);
      expect.soft(product.quantity).toEqual(productQuantities[index]);
      expect.soft(product.total).toEqual(productTotals[index]);
      expect.soft(product.manualTotal).toEqual(productManualTotals[index]);
    }
    await deleteProductToCart;
  });

  test('Able to Proceed Checkout', async ({ navigateToCartFromCheckout, loginWithValidCredentials, addProductToCart, deleteProductToCart, proceedToCheckout, checkoutpage }) => {
    await loginWithValidCredentials;
    await addProductToCart;
    await proceedToCheckout;
    await expect(await checkoutpage.getPageURL()).toMatch('/checkout');
    await navigateToCartFromCheckout;
    await deleteProductToCart;

  });

  test('Validate delivery address details', async ({ navigateToCartFromCheckout, loginWithValidCredentials, addProductToCart, deleteProductToCart, proceedToCheckout, validateDeliveryAddress }) => {
    await loginWithValidCredentials;
    await addProductToCart;
    await proceedToCheckout;
    const addressData = await validateDeliveryAddress;
    expect(addressData.name).toBe(name);
    expect(addressData.address1).toBe(addressLine1);
    expect(addressData.address2).toBe(addressLine2);
    expect(addressData.address3).toBe(addressLine3);
    expect(addressData.address4).toBe(addressLine4);
    expect(addressData.country).toBe(country);
    expect(addressData.phoneNumber).toBe(phoneNumber);
    await navigateToCartFromCheckout;
    await deleteProductToCart;
  });

  test('Validate billing address details', async ({ navigateToCartFromCheckout, loginWithValidCredentials, addProductToCart, deleteProductToCart, proceedToCheckout, validateBillingAddress }) => {
    await loginWithValidCredentials;
    await addProductToCart;
    await proceedToCheckout;
    const addressData = await validateBillingAddress;
    expect.soft(addressData.name).toBe(name);
    expect.soft(addressData.address1).toBe(addressLine1);
    expect.soft(addressData.address2).toBe(addressLine2);
    expect.soft(addressData.address3).toBe(addressLine3);
    expect.soft(addressData.address4).toBe(addressLine4);
    expect.soft(addressData.country).toBe(country);
    expect.soft(addressData.phoneNumber).toBe(phoneNumber);
    await navigateToCartFromCheckout;
    await deleteProductToCart;
  });

  test('Validate product data on Checkout', async ({ navigateToCartFromCheckout, loginWithValidCredentials, addProductToCart, deleteProductToCart, proceedToCheckout, validateProductDataOnCheckout, checkoutpage }) => {
    await loginWithValidCredentials;
    await addProductToCart;
    await proceedToCheckout;

    const checkoutData = await validateProductDataOnCheckout;
    let productTotal = 0;
    for (let index = 0; index < checkoutData.length; index++) {
      const product = checkoutData[index];
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
    await navigateToCartFromCheckout;
    await deleteProductToCart;
  });

  test('Able to proceed to Payment', async ({ navigateToCartFromPayment, loginWithValidCredentials, addProductToCart, deleteProductToCart, proceedToCheckout, proceedToPayment, paymentpage }) => {
    await loginWithValidCredentials;
    await addProductToCart;
    await proceedToCheckout;
    await proceedToPayment;
    await expect(await paymentpage.getPageURL()).toMatch('/payment');
    await navigateToCartFromPayment;
    await deleteProductToCart;
  });

 // Test 10: Able to proceed to Complete Order
 test('Able to proceed to Complete Order', async ({ loginWithValidCredentials, addProductToCart, proceedToCheckout, proceedToPayment, proceedToCompleteOrder, orderplacedpage }) => {
  await loginWithValidCredentials;
  await addProductToCart;
  await proceedToCheckout;
  await proceedToPayment;
  await proceedToCompleteOrder;
  await expect(await orderplacedpage.getPageURL()).toMatch('/payment_done');
  const successMessage = 'Congratulations! Your order has been confirmed!';
  const actualMessage = await orderplacedpage.getSuccessMessage();
  await expect.soft(actualMessage).toBe(successMessage);
  // await expect(actualMessage).toBe('failed');
});

// Test 11: Verify homepage after completing the order
test('Verify homepage is displayed after click continue at Complete Order', async ({ loginWithValidCredentials, addProductToCart, proceedToCheckout, proceedToPayment, proceedToCompleteOrder,verifyHomepageAfterOrder, homepage }) => {
  await loginWithValidCredentials;
  await addProductToCart;
  await proceedToCheckout;
  await proceedToPayment;
  await proceedToCompleteOrder;
  await verifyHomepageAfterOrder;
  await expect(await homepage.getPageURL()).toMatch(baseUrl);

  });
});