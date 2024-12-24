const { test, expect } = require('@playwright/test');

test('login', async ({ page }) => {
    await page.goto('https://automationexercise.com/');

 //login   
    await page.locator('[href="/login"]').click();
    await expect(page).toHaveURL('https://automationexercise.com/login');

    const existingUserName = 'automation-assessment@bro.com';
    await page.locator('[data-qa="login-email"]').fill(existingUserName);
    await page.locator('[data-qa="login-password"]').fill('automation-assessment');
    await page.locator('[data-qa="login-button"]').click();

    const retrievedUserName = await page.locator('a b').textContent();
    const expectedLoggedInMessage = `Logged in as ${existingUserName}`;
    const actualLoggedInMessage = `Logged in as ${retrievedUserName}`;
    expect(expectedLoggedInMessage).toBe(actualLoggedInMessage);
    
    console.log(expectedLoggedInMessage);
    console.log(actualLoggedInMessage);

    const productName = 'Fancy Green Top';
    let productAddedtoCart;


    const productCard = await page.locator('[class="product-image-wrapper"]');
    const allProductsCounts = await productCard.count();
//HOMEPAGE
//selecting product and view the PDP
    for(let i=0; i<allProductsCounts; i++){
    const singleProduct = await productCard.nth(i).locator('div p').nth(0).textContent();
        if(singleProduct === productName){
            productAddedtoCart = singleProduct;
            const homeThumbnail = await productCard.nth(i).locator('div img').getAttribute('src');
            console.log(homeThumbnail);
            await productCard.nth(i).locator('li a').click();
            break;
      }
    }
    console.log(productAddedtoCart);

//PDP 
//adding quantity and assertions on PDP
let pdpDetails = [];
const productInfo = await page.locator('[class="product-details"]');
const pdpProductThumbnail = await productInfo.locator('div img').nth(0).getAttribute('src');
const pdpProductName = await productInfo.locator('div h2').textContent();
const pdpProductCategory = (await productInfo.locator('div p').nth(0).textContent()).replace('Category: ','');
const pdpProductPrice = (await productInfo.locator('span span').textContent()).replace('Rs. ','');

const quantityInput = await productInfo.locator('[id="quantity"]');
const quantityToAdd = 3
const pdpProductQuantity =  String(quantityToAdd);
const pdpProductTotal = String(pdpProductPrice * pdpProductQuantity);
const pdpProductManualTotal = pdpProductTotal;

for (let i = 0; i < quantityToAdd-1; i++) {
  await quantityInput.press('ArrowUp');
}

await page.locator('[class="btn btn-default cart"]').click();

const addedToCartModal = await page.locator('[href="/view_cart"]').nth(1);
await addedToCartModal.waitFor({state: 'visible'});
await addedToCartModal.click();



pdpDetails.push({
    thumbnail: pdpProductThumbnail,
    name: pdpProductName,
    category: pdpProductCategory,
    price: pdpProductPrice,
    quantity: pdpProductQuantity,
    total: pdpProductTotal,
    manualTotal: pdpProductManualTotal
  });

  console.log(pdpDetails);


//cart
await expect(page).toHaveURL('https://automationexercise.com/view_cart');
const cartRows = await page.locator('tbody tr');
await cartRows.waitFor({state: 'attached'});
const cartRowsCount = await cartRows.count();
let cartDetails = [];
for(let i=0; i<cartRowsCount; i++){
    const row = cartRows.nth(i);
    let cartProductThumbnail = await row.locator('td a img').getAttribute('src');
    let cartProductName = await row.locator('td h4 a').textContent();
    let cartProductCategory = await row.locator('td p').nth(0).textContent();
    let cartProductPrice = (await row.locator('td p').nth(1).textContent()).replace('Rs. ', '');
    let cartProductQuantity = await row.locator('td button').textContent();
    let cartProductTotal= (await row.locator('td p').nth(2).textContent()).replace('Rs. ', '');
    let cartProductManualTotal = String(cartProductPrice * cartProductQuantity);
    cartDetails.push({
        thumbnail: cartProductThumbnail,
        name: cartProductName,
        category: cartProductCategory,
        price: cartProductPrice,
        quantity: cartProductQuantity,
        total: cartProductTotal,
        manualTotal: cartProductManualTotal
      });




}
console.log(cartDetails);
await page.locator('[class="btn btn-default check_out"]').click();


 
//checkout

    await expect(page).toHaveURL('https://automationexercise.com/checkout');

    const checkoutRows = await page.locator('tbody tr:has(td h4 a)');
    await checkoutRows.waitFor({state: 'attached'});
    const checkoutCount = await cartRows.count();
    let checkoutDetails = [];
    for(let i=0; i<cartRowsCount; i++){
        const row = cartRows.nth(i);
        let checkoutProductThumbnail = await row.locator('td a img').getAttribute('src');
        let checkoutProductName = await row.locator('td h4 a').textContent();
        let checkoutProductCategory = await row.locator('td p').nth(0).textContent();
        let checkoutProductPrice = (await row.locator('td p').nth(1).textContent()).replace('Rs. ', '');
        let checkoutProductQuantity = await row.locator('td button').textContent();
        let checkoutProductTotal= (await row.locator('td p').nth(2).textContent()).replace('Rs. ', '');
        let checkoutProductManualTotal = String(checkoutProductPrice * checkoutProductQuantity);
        checkoutDetails.push({
            thumbnail: checkoutProductThumbnail,
            name: checkoutProductName,
            category: checkoutProductCategory,
            price: checkoutProductPrice,
            quantity: checkoutProductQuantity,
            total: checkoutProductTotal,
            manualTotal: checkoutProductManualTotal
          });
    
    
    
    
    }
    console.log(checkoutDetails);

    await page.locator('[class="btn btn-default check_out"]').click();


//payment
    await expect(page).toHaveURL('https://automationexercise.com/payment');

    await page.locator('[data-qa="name-on-card"]').fill('test');
    await page.locator('[data-qa="card-number"]').fill('4444444444444444');
    await page.locator('[data-qa="cvc"]').fill('111');
    await page.locator('[data-qa="expiry-month"]').fill('11');
    await page.locator('[data-qa="expiry-year"]').fill('2030');
    await page.locator('[data-qa="pay-button"]').click();




});