const { writeProductDataToExcel } = require('../utils');  // Importing the write function from util.js

class OrderPlacedPage {
    constructor(page) {
        this.page = page;
        this.successMessage = page.locator('div p');


    }

    
    async getSuccessMessage(){
        await this.successMessage.first().textContent();
    }
}

module.exports = OrderPlacedPage;
