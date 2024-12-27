const { test, expect } = require('@playwright/test');
const { HomePage } = require('../pages/homePage');
const CartPage  = require('../pages/cartPage'); 
const CheckoutPage = require('../pages/checkoutPage');
const PaymentPage = require('../pages/paymentPage');
const OrderPlacedPage = require('../pages/orderPlacedPage');


const { getEnvironmentConfig } = require('../environment.config');
const { readProductData, clearProductDetailsFile, clearAddressDetailsFile } = require('../utils');

let config;
try {
  config = getEnvironmentConfig();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

const { environment, baseUrl, username, password, nameOnCard, cardNumber, cvc, expirationMM, expirationYYYY } = config;
let productData = readProductData(environment);
const productName = productData.map(product => product.Name);

test.describe('Login Tests', () => {
  let page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    const homepage = new HomePage(page);

    if (!username || !password) {
      throw new Error('Username or Password is undefined');
    }
    await page.goto(baseUrl);
    await homepage.navigateToPage('login');
    await homepage.loginExistingUser(username, password);
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
    await homepage.addProductToCart(productName);
    await cartpage.getCartDetails();
  });

  test('Proceed Checkout', async () => {
    const cartpage = new CartPage(page);
    const checkoutpage = new CheckoutPage(page);
    await cartpage.proceedtoCheckout();
    await checkoutpage.getCheckoutDetails();
    await checkoutpage.getAddressDetails('delivery');
    await checkoutpage.getAddressDetails('billing');
  });


  test('Proceed Payment', async () => {
    const checkoutpage = new CheckoutPage(page);
    const paymentpage = new PaymentPage(page);
    const orderplacedpage = new OrderPlacedPage(page);
    await checkoutpage.proceedtoPayment();
    await paymentpage.enterPaymentDetils(nameOnCard, cardNumber, cvc, expirationMM, expirationYYYY);
    await paymentpage.proceedtoOrder();
    await orderplacedpage.proceedContinue();
  });

  test.afterAll(async () => {
    await clearProductDetailsFile();  // Create backup and clear the product details file after all tests
    await clearAddressDetailsFile();  // Clear address details file after all tests
    await page.close();
  });
});
