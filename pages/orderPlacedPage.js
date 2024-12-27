const { writeProductDataToExcel } = require('../utils');  // Importing the write function from util.js

class OrderPlacedPage {
    constructor(page) {
        this.page = page;
        this.successMessage = page.locator('div p');
        this.continueButton = page.locator('[data-qa="continue-button"]');


    }

    
    async getSuccessMessage(){
        await this.successMessage.first().textContent();
    }


    async proceedContinue(){
        await this.continueButton.click();
    }


}

module.exports = OrderPlacedPage;
