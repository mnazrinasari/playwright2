const { writeProductDataToExcel } = require('../utils/excel.util');  // Importing the write function from util.js

class LoginPage {
    constructor(page) {
        this.page = page;
        this.userName = page.locator('a b');
    }

    
    async getPageURL(){
        const pageURL = await this.page.url();
        return pageURL;
    }


    async getuserName(){
        const username = await this.userName;
        await username.waitFor({ state: 'attached' });
        const usernameText = (await username.textContent()).trim();
        return usernameText;
    }


    async proceedContinue(){
        await this.continueButton.click();
    }


}

module.exports = { LoginPage };
