// const { test, expect } = require('@playwright/test');
// const { HomePage } = require('../pages/homePage');
// const CartPage = require('../pages/cartPage'); 
// const environment = process.env.TEST_ENV || 'test';
// const path = require('path');
// const { readFromExcel } = require('../utils'); // Ensure the correct import
// const filePath = './logintestdata.xlsx'; // Adjust path to your Excel file
// const { baseUrl, username, password } = readLoginConfig(filePath, environment);


// test('login', async ({ page }) => {
//     const homepage = new HomePage(page);

//     await page.goto('./');

//  //login   
//     await homepage.navigateToPage('login');

//     await expect(page).toHaveURL('https://automationexercise.com/login');
//     await homepage.loginExistingUser(username, password)
//     const userNameElement = await page.locator('a b');
//     await userNameElement.waitFor({state: 'attached'});
//     const retrievedUserName = await userNameElement.textContent();
    
//     const expectedLoggedInMessage = `Logged in as ${username}`;
//     const actualLoggedInMessage = `Logged in as ${retrievedUserName}`;
//     expect(expectedLoggedInMessage).toBe(actualLoggedInMessage);
    

//     const productName = ['Fancy Green Top', 'Winter Top'];
//     await homepage.addProductToCart(productName);



//   // Create an instance of CartPage
//   const cartPage = new CartPage(page);

//   const filePath = path.resolve(__dirname, '..', 'cartDetails.xlsx');

//   // Read the saved Excel data
//   const cartData = readFromExcel(filePath);

//   console.log(cartData); // Optionally print the cart data to verify

//   // Step 3: Add assertions to verify cart data
//   // Ensure there are at least two rows (header + 1 product row)
//   expect(cartData.length).toBeGreaterThan(1); // Check that there's at least one product row

//   // Example assertions to verify specific cart details
//   expect(cartData[1][1]).toBe('Winter Top'); // Verify the name of the first product
//   expect(cartData[1][2]).toBe('Women > Tops'); // Verify the category of the first product
//   expect(cartData[1][4]).toBe('14'); // Verify the quantity of the first product
//   expect(cartData[1][6]).toBe('8400'); // Verify the total price of the first product

//   // Further assertions for additional products can be added
//   expect(cartData[2][1]).toBe('Fancy Green Top'); // Verify the name of the second product
//   expect(cartData[2][2]).toBe('Women > Tops'); // Verify the category of the second product
//   expect(cartData[2][4]).toBe('14'); // Verify the quantity of the second product
//   expect(cartData[2][6]).toBe('9800'); // V

// await page.locator('[class="btn btn-default check_out"]').click();


 
// //checkout

//     await expect(page).toHaveURL('https://automationexercise.com/checkout');

//     const checkoutRows = await page.locator('tbody tr:has(td h4 a)');
//     const checkoutCount = await cartRows.count();
//     let checkoutDetails = [];
//     for(let i=0; i<cartRowsCount; i++){
//         const row = cartRows.nth(i);
//         let checkoutProductThumbnail = await row.locator('td a img').getAttribute('src');
//         let checkoutProductName = await row.locator('td h4 a').textContent();
//         let checkoutProductCategory = await row.locator('td p').nth(0).textContent();
//         let checkoutProductPrice = (await row.locator('td p').nth(1).textContent()).replace('Rs. ', '');
//         let checkoutProductQuantity = await row.locator('td button').textContent();
//         let checkoutProductTotal= (await row.locator('td p').nth(2).textContent()).replace('Rs. ', '');
//         let checkoutProductManualTotal = String(checkoutProductPrice * checkoutProductQuantity);
//         checkoutDetails.push({
//             thumbnail: checkoutProductThumbnail,
//             name: checkoutProductName,
//             category: checkoutProductCategory,
//             price: checkoutProductPrice,
//             quantity: checkoutProductQuantity,
//             total: checkoutProductTotal,
//             manualTotal: checkoutProductManualTotal
//           });
    
    
    
    
//     }
//     console.log(checkoutDetails);

//     await page.locator('[class="btn btn-default check_out"]').click();


// //payment
//     await expect(page).toHaveURL('https://automationexercise.com/payment');

//     await page.locator('[data-qa="name-on-card"]').fill('test');
//     await page.locator('[data-qa="card-number"]').fill('4444444444444444');
//     await page.locator('[data-qa="cvc"]').fill('111');
//     await page.locator('[data-qa="expiry-month"]').fill('11');
//     await page.locator('[data-qa="expiry-year"]').fill('2030');
//     await page.locator('[data-qa="pay-button"]').click();




// });