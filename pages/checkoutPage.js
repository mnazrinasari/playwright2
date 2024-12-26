const { writeProductDataToExcel } = require('../utils');  // Importing the write function from util.js

class CheckoutPage {
    constructor(page) {
        this.page = page;

        // Define locators for cart elements
        this.checkoutRowsLocator = this.page.locator('tbody tr:has(td h4 a)'); // Rows for each product in the cart
        this.proceedtoPaymentPage= this.page.locator('[href="/payment"]');
        this.pageName = this.page.locator('[class="active"]');
    }

    // Get cart details and save them to an Excel file
    async getCheckoutDetails() {
        // Fetch the rows of the cart
    const checkoutRows = await this.checkoutRowsLocator;
    const checkoutRowsCount = await checkoutRows.count();
    const checkoutPageName = await this.pageName.textContent();
    let checkoutDetails = [];
        // Loop through each row and collect details
        for(let i=0; i<checkoutRowsCount; i++){
            const row = checkoutRows.nth(i);

            // Extract details for each product in the cart
        let checkoutProductThumbnail = await row.locator('td a img').getAttribute('src');
        let checkoutProductName = await row.locator('td h4 a').textContent();
        let checkoutProductCategory = await row.locator('td p').nth(0).textContent();
        let checkoutProductPrice = (await row.locator('td p').nth(1).textContent()).replace('Rs. ', '');
        let checkoutProductQuantity = await row.locator('td button').textContent();
        let checkoutProductTotal= (await row.locator('td p').nth(2).textContent()).replace('Rs. ', '');
        let checkoutProductManualTotal = String(checkoutProductPrice * checkoutProductQuantity);
            // Push product details into the cartDetails array (as an object)
        checkoutDetails.push({
            Page: checkoutPageName, 
            Thumbnail: checkoutProductThumbnail,
            Name: checkoutProductName,
            Category: checkoutProductCategory,
            Price: checkoutProductPrice,
            Quantity: checkoutProductQuantity,
            Total: checkoutProductTotal,
            ManualTotal: checkoutProductManualTotal
            });
        }

        // Call the utility function to save cart details into the Excel file
        writeProductDataToExcel(checkoutDetails);
    }


    async proceedtoPayment(){
        await this.proceedtoPaymentPage.click();
    }
}

module.exports = CheckoutPage;
