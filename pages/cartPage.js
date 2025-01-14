class CartPage {
    constructor(page) {
        this.page = page;
        this.cartRowsLocator = page.locator('tbody tr'); // Rows for each product in the cart
        this.proceedtoCheckoutpage = page.locator('[class="btn btn-default check_out"]');
        this.pageName = page.locator('[class="active"]');

    }

    async getPageURL(){
        const pageURL = await this.page.url();
        return pageURL;
    }

    // Get cart details and save them to an Excel file
    async getCartDetails() {
        // Fetch the rows of the cart
        const cartRows = await this.cartRowsLocator;
        const cartRowsCount = await cartRows.count();
        let cartDetails = [];
        const cartPageName = await this.pageName.textContent();
      
        // Loop through each row and collect details
        for (let i = 0; i < cartRowsCount; i++) {
          const row = cartRows.nth(i);
      
          // Extract details for each product in the cart
          const cartProductThumbnail = await row.locator('td a img').getAttribute('src');
          const cartProductName = await row.locator('td h4 a').textContent();
          const cartProductCategory = await row.locator('td p').nth(0).textContent();
          const cartProductPrice = (await row.locator('td p').nth(1).textContent()).replace('Rs. ', '');
          const cartProductQuantity = await row.locator('td button').textContent();
          const cartProductTotal = (await row.locator('td p').nth(2).textContent()).replace('Rs. ', '');
          const cartProductManualTotal = String(cartProductPrice * cartProductQuantity); // Price * Quantity
      
          // Push product details into the cartDetails array (as an object)
          cartDetails.push({
            Page: cartPageName, 
            Thumbnail: cartProductThumbnail,
            Name: cartProductName,
            Category: cartProductCategory,
            Price: cartProductPrice,
            Quantity: Number(cartProductQuantity),
            Total: Number(cartProductTotal),
            ManualTotal: Number(cartProductManualTotal)
          });
        }
      
        // Return the cart details object
        return cartDetails;
      }
      
async proceedtoCheckout(){
    const cartVisible = await this.pageName;
    await cartVisible.waitFor({ state: 'visible' });
    await this.proceedtoCheckoutpage.click();
}

async deleteProductToCart(){
        const cartRows = await this.cartRowsLocator;
        const cartRowsCount = await cartRows.count();
        // Loop through each row and collect details
        for (let i = 0; i < cartRowsCount; i++) {
            const row = cartRows.nth(i).locator('td');
            await row.locator('[class="cart_quantity_delete"]').click();
        }
    }
}



module.exports = { CartPage };
