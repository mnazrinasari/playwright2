const { writeProductDataToExcel } = require('../utils/excel.util');  // Importing the write function from util.js

class PaymentPage {
    constructor(page) {
        this.page = page;
        this.nameOnCard = page.locator('[data-qa="name-on-card"]');
        this.cardNumber = page.locator('[data-qa="card-number"]');
        this.cvs = page.locator('[data-qa="cvc"]');
        this.expirationMM = page.locator('[data-qa="expiry-month"]');
        this.expirationYYYY = page.locator('[data-qa="expiry-year"]');
        this.continuePay = page.locator("[data-qa='pay-button']");

    }

    // Get cart details and save them to an Excel file
    async enterPaymentDetails(name, number, cvs, monthexp, yearexp) {
        await this.nameOnCard.pressSequentially(name);
        await this.cardNumber.pressSequentially(String(number));
        await this.cvs.pressSequentially(String(cvs));
        await this.expirationMM.pressSequentially(String(monthexp));
        await this.expirationYYYY.pressSequentially(String(yearexp));
      
    }
    
    async proceedtoOrder(){
        await this.continuePay.click({ force: true });  // Try force-click if necessary
    }
}

module.exports = PaymentPage;
