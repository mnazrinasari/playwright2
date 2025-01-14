const { readAccountConfig } = require('../utils/excel.util'); // Import the readpaymentInfoConfig function from utils

// Function to load account information for the given environment
function loadPaymentConfig(environment) {
  // Get account information based on the environment (filtered from the Excel file)
  const paymentInfo = readAccountConfig(environment);

  // Return the account-related data
//   return {
//     cardName: paymentInfo.cardName,
//     cardNumber: paymentInfo.cardNumber,
//     cvc: paymentInfo.cvc,
//     expirationMM: paymentInfo.expirationMM,
//     expirationYYYY: paymentInfo.expirationYYYY,
//   };
// }

return paymentInfo.map(info => ({
  cardName: info.cardName,
  cardNumber: info.cardNumber,
  cvc: info.cvc,
  expirationMM: info.expirationMM,
  expirationYYYY: info.expirationYYYY,
  country: info.country,
  phoneNumber: String(info.phoneNumber)
}));
}

module.exports = { loadPaymentConfig };
