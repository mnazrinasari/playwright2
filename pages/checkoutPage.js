const { writeProductDataToExcel, writeAddressDataToExcel } = require('../utils');  // Importing the write function from util.js

class CheckoutPage {
    constructor(page) {
        this.page = page;

        // Define locators for cart elements
        this.checkoutRowsLocator = this.page.locator('tbody tr:has(td h4 a)'); // Rows for each product in the cart
        this.proceedtoPaymentPage= this.page.locator('[href="/payment"]');
        this.pageName = this.page.locator('[class="active"]');
        this.deliveryAddress = this.page.locator('[id="address_delivery"]');
        this.billingAddress = this.page.locator('[id="address_invoice"]');

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

    cleanAddressEntry(entry, unwantedPrefix) {
        // Only remove unwanted prefix like "Mr." or "Ms." from the entry, but keep the name
        if (entry.startsWith(unwantedPrefix)) {
          return entry.slice(unwantedPrefix.length).trim();  // Remove the unwanted prefix but keep the name
        }
        return entry;  // Return the entry as-is if it doesn't start with the unwanted prefix
      }
      
      cleanAddressData(addressArray, unwantedEntry, unwantedPrefix) {
        // Modify the entries in the array without filtering out any ones
        return addressArray.map(entry => {
          // If the entry matches unwantedEntry (like "Your delivery address"), we just leave it out
          if (entry === unwantedEntry) {
            return null;  // Return null or undefined to remove it from the final result
          }
      
          // Remove the prefix (e.g., "Mr.") from the name field (index 1)
          return this.cleanAddressEntry(entry, unwantedPrefix);
        }).filter(entry => entry !== null && entry !== undefined); // Remove null/undefined values from the final result
      }
      
      async getAddressDetails(type) {
        let addressType;
        let addressLabel;
        let genderPrefix;
      
        // Determine which address to use based on the 'type' argument
        switch (type) {
          case 'delivery':
            addressType = this.deliveryAddress;
            addressLabel = 'Your delivery address';
            genderPrefix = 'Mr.';  // For delivery address, use "Mr."
            break;
          case 'billing':
            addressType = this.billingAddress;
            addressLabel = 'Your billing address';
            genderPrefix = 'Mr.';  // For billing address, use "Mr."
            break;
          default:
            throw new Error('Invalid address type');
        }
      
        // Retrieve the address details (assuming 8 address fields)
        const addressElements = addressType.locator("li");
        const count = 8; // Adjust if the number of address fields changes
        let retrievedAddress = [];
      
        for (let i = 0; i < count; i++) {
          const addressDetail = await addressElements.nth(i).textContent();
          retrievedAddress.push(addressDetail.trim());
        }
      
        // Clean the address data: Remove unwanted labels (addressLabel) and gender prefix (e.g., "Mr.")
        retrievedAddress = this.cleanAddressData(retrievedAddress, addressLabel, genderPrefix);
      
        // Call the Excel writing function
        await writeAddressDataToExcel(type, retrievedAddress);
      }
      
    
      
      


}

module.exports = CheckoutPage;