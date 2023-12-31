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
    "https://billing.nextgen.ng/billing/customer/billing_did_success.php",
  API_TRANSFER_CREDIT:
    "billing_balance_transfer_balance/balance_transfer_org.php",

  API_JOIN_VIDEO: "join_video/join_video_call.php",
  API_HANG_UP_CALL: "join_video/hangup_call.php",
  API_GROUP_VIDEOCALL_PUSH: "join_video/join_group_video_call.php",
  API_REGISTERED_NUMBER: "join_video/call_phone_number.php",
  SYNC_CONTACTS: "billing_auto_register/sync_contacts.php",
  SYNC_CONTACTS_IOS: "billing_auto_register/sync_contacts_ios.php",
  API_TRANSFER_HISTORY:
    "billing_balance_transfer_balance/balance_transfer_report.php",
  API_RATES_NEW: "billing_rates/get_rates_new.php",
  API_SINGLE_CHAT_PUSH: "join_video/single-chat-push.php",
  API_GROUP_CHAT_PUSH: "join_video/group-chat-push.php",
  API_HIDDENPAGE: "billing_hiddenpage_status/status.php",
  API_EXIISING_USER_LOGIN: "billing_encryption/login.php",
  API_VOICE_NOTIFICATION: "nextgen_api/call_notification/audio_notification.php",
};

export default ApiRoutes;
