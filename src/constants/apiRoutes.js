let ApiRoutes = {
   BASE_URL: process.env.DEV_BACKEND_URL,
  //BASE_URL: 'https://billing.hifroggy.com/billing/froggy_api/',
  API_ENCRYPTION: "billing_encryption/encrypt_value.php",
  API_SEND_OTP: "billing_auto_register/otp_send.php",
  API_VERIFY_OTP: "billing_auto_register/otp_secure.php",
  API_FETCH_BALANCE: "billing_balance/get_balance.php",
  API_VOUCHER: "billing_voucher_recharge/refill_dialer_voucher.php",
  API_CALL_DETAIL: "billing_cdr/cust_cdrs.php",
  API_RATES: "billing_rates/get_rates.php",
};

export default ApiRoutes;
