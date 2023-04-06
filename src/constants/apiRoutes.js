let ApiRoutes = {
  BASE_URL: process.env.DEV_BACKEND_URL,
  API_ENCRYPTION: "billing_encryption/encrypt_value.php",
  API_SEND_OTP: "billing_auto_register/otp_send.php",
  API_VERIFY_OTP: "billing_auto_register/otp_secure.php",
  API_FETCH_BALANCE: "billing_balance/get_balance.php",
  API_VOUCHER: "billing_voucher_recharge/refill_dialer_voucher.php",
  API_CALL_DETAIL: "billing_cdr/cust_cdrs.php",
  API_RATES: "billing_rates/get_rates.php",
  API_ASSIGN_DID:
    "https://billing.kokoafone.com/billing/customer/billing_did_success.php",
  API_TRANSFER_CREDIT:
    "billing_balance_transfer_balance/balance_transfer_org.php",

  API_JOIN_VIDEO: "join_video/join_video_call.php",
  API_HANG_UP_CALL: "join_video/hangup_call.php",

  API_REGISTERED_NUMBER: "join_video/call_phone_number.php",
};

export default ApiRoutes;
