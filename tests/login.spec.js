const test = require('../fixtures/fixture');
const { expect } = require('@playwright/test');
const { loadConfig } = require('../config/loader.config');

let context;

const config = loadConfig();
const {
  baseUrl, accounts} = config;

test.describe('E2E - Online Ordering', () => {
  
  test.beforeAll(async ({ browser }) => {   // Setup before tests
    context = await browser.newContext();
  });

  
  test.beforeEach(async ({ loginWithValidCredentials }, testInfo) => {
    const account = accounts[testInfo.workerIndex % accounts.length];  // Assign account based on worker index
    testInfo.account = account;  // Store the account information in testInfo
    await loginWithValidCredentials;
  });

  test('Able to login with valid credentials', async ({ page, homepage, loginpage }, testInfo) => {
    const account = testInfo.account;  // Retrieve the account information from testInfo
    await expect(await homepage.getPageURL()).toMatch(baseUrl);
    const retrievedUserName = await loginpage.getuserName();
    const expectedLoggedInMessage = `Logged in as ${account.username}`;
    const actualLoggedInMessage = `Logged in as ${retrievedUserName}`;
    expect.soft(actualLoggedInMessage).toBe(expectedLoggedInMessage);
  });
});