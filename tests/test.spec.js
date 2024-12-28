const { test, expect } = require('@playwright/test');
const { HomePage } = require('../pages/homePage');
const CartPage = require('../pages/cartPage');
const CheckoutPage = require('../pages/checkoutPage');
const PaymentPage = require('../pages/paymentPage');
const OrderPlacedPage = require('../pages/orderPlacedPage');
const { loadConfig } = require('../config/loader.config');
const { clearProductDetailsFile, clearAddressDetailsFile } = require('../utils');

const config = loadConfig();  // The loader config will automatically choose the environment based on TEST_ENV or default to 'test'
const {
  baseUrl, username, password, nameOnCard,cardNumber,cvc,expirationMM,expirationYYYY,productNames, products, productThumbnails, productCategories,
  productPrices, productQuantities, productTotals, productManualTotals
} = config;  // Destructure config to get product data

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

    await homepage.addProductToCart(productNames);  // Using the first product name
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

  test.afterAll(async () => {
    await clearProductDetailsFile();
    await clearAddressDetailsFile();
    await page.close();
  });
});