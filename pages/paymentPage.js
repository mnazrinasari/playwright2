const { writeProductDataToExcel } = require('../utils');  // Importing the write function from util.js

class PaymentPage {
    constructor(page) {
        this.page = page;
        this.nameOnCard = page.locator('[data-qa="name-on-card"]');
        this.cardNumber = page.locator('[data-qa="card-number"]');
        this.cvs = page.locator('[data-qa="cvc"]');
        this.expirationMM = page.locator('[data-qa="expiry-month"]');
        this.expirationYYYY= page.locator('[data-qa="expiry-year"]');
        this.payandConfirmOrder = page.locator('[data-qa="pay-button"]');

    }

    // Get cart details and save them to an Excel file
    async enterPaymentDetils(name, number, cvs, monthexp, yearexp) {
        await this.nameOnCard.fill(name);
        await this.cardNumber.fill(String(number));
        await this.cvs.fill(String(cvs));
        await this.expirationMM.fill(String(monthexp));
        await this.expirationYYYY.fill(String(yearexp));
      
    }
    
    async proceedtoOrder(){
        await this.payandConfirmOrder.click();
    }
}

module.exports = PaymentPage;
