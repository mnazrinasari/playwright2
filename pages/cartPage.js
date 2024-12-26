const { writeToExcel } = require('../utils'); // Import the helper to write to Excel
const path = require('path'); // Required for resolving file paths

class CartPage {
    constructor(page) {
        this.page = page;

        // Define locators for cart elements
        this.cartRowsLocator = this.page.locator('tbody tr'); // Rows for each product in the cart
    }

    async getCartDetailsAndSaveToExcel() {
        // Fetch the rows of the cart
        const cartRows = await this.page.locator('tbody tr');
        const cartRowsCount = await cartRows.count();
        let cartDetails = [];

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
            const cartProductManualTotal = String(cartProductPrice * cartProductQuantity);

            // Push product details into the cartDetails array (as an object)
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

        // Convert the cart details into a 2D array format (array of arrays)
        const header = ['Thumbnail', 'Name', 'Category', 'Price', 'Quantity', 'Total', 'Manual Total'];
        const excelData = [header];

        // Add each product's details as a row
        cartDetails.forEach(product => {
            excelData.push([
                product.thumbnail,
                product.name,
                product.category,
                product.price,
                product.quantity,
                product.total,
                product.manualTotal
            ]);
        });

        // Define file path for saving the Excel file
        const filePath = path.resolve(__dirname, '..', 'cartDetails.xlsx'); // Ensure it is in the project root

        // Write the data to the Excel file
        writeToExcel(excelData, filePath);
        console.log('Cart details saved to Excel file at:', filePath);
    }
}

module.exports = CartPage;
