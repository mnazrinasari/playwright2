const { writeProductDataToExcel } = require('../utils/excel.util');  // Importing the write function from util.js

class OrderPlacedPage {
    constructor(page) {
        this.page = page;
        this.successMessage = page.locator('div p');
        this.continueButton = page.locator('[data-qa="continue-button"]');
        this.pageURL = page.url();

    }

    async getPageURL(){
        const pageURL = await this.cartURL;
        return pageURL;
  
    }
    
    async getSuccessMessage(){
        const message = (await this.successMessage.nth(0).textContent()).trim();
        return message;
    }


    async proceedContinue(){
        await this.continueButton.click();
    }


}

module.exports = OrderPlacedPage;
