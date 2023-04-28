import { apiClient } from "../helpers/ApiInterceptor";
import ApiRoutes from "./apiRoutes";

export const hitEncryptionApi = (payload) => {
  console.log("paylosaddd--enc---", payload);
  return apiClient({
    baseURL: ApiRoutes.BASE_URL,
    method: "post",
    url: ApiRoutes.API_ENCRYPTION,
    data: payload,
  });
};

export const hitSendOtpApi = (payload) => {
  return apiClient({
    baseURL: ApiRoutes.BASE_URL,
    method: "post",
    url: ApiRoutes.API_SEND_OTP,
    data: payload,
  });
};

export const hitOtpVerificationAPI = (payload) => {
  return apiClient({
    baseURL: ApiRoutes.BASE_URL,
    method: "post",
    url: ApiRoutes.API_VERIFY_OTP,
    data: payload,
  });
};

export const hitFetchUserBalanceApi = (payload) => {
  return apiClient({
    baseURL: ApiRoutes.BASE_URL,
    method: "post",
    url: ApiRoutes.API_FETCH_BALANCE,
    data: payload,
  });
};

export const hitVoucherApi = (payload) => {
  console.log("payload-------", payload);
  return apiClient({
    baseURL: ApiRoutes.BASE_URL,
    method: "post",
    url: ApiRoutes.API_VOUCHER,
    data: payload,
  });
};

export const hitGetCallDetailsApi = (payload) => {
  return apiClient({
    baseURL: ApiRoutes.BASE_URL,
    method: "post",
    url: ApiRoutes.API_CALL_DETAIL,
    data: payload,
  });
};
export const hitTransferHistoryApi = (payload) => {
  return apiClient({
    baseURL: ApiRoutes.BASE_URL,
    method: "post",
    url: ApiRoutes.API_TRANSFER_HISTORY,
    data: payload,
  });
};
export const hitCallRatesApi = () => {
  return apiClient({
    baseURL: ApiRoutes.BASE_URL,
    method: "GET",
    url: ApiRoutes.API_RATES,
  });
};
// export const hitCallRatesNewApi = () => {
//   return apiClient({
//     baseURL: ApiRoutes.BASE_URL,
//     method: "GET",
//     url: ApiRoutes.API_RATES_NEW,
//   });
// };
export const hitCallRatesNewApi = (payload) => {
  console.log("-----paylod", payload);
  return apiClient({
    baseURL: ApiRoutes.BASE_URL,
    method: "POST",
    url: ApiRoutes.API_RATES_NEW,
    data: payload,
  });
};

export const hitApiAssignDid = (username) => {
  return apiClient({
    method: "post",
    url: ApiRoutes.API_ASSIGN_DID,
    params: { pr_login: username },
  });
};

export const hitCreditTransferApi = (payload) => {
  return apiClient({
    baseURL: ApiRoutes.BASE_URL,
    method: "post",
    url: ApiRoutes.API_TRANSFER_CREDIT,
    data: payload,
  });
};

export const hitJoinVideoCallApi = (payload) => {
  return apiClient({
    baseURL: ApiRoutes.BASE_URL,
    method: "post",
    url: ApiRoutes.API_JOIN_VIDEO,
    data: payload,
  });
};

export const hithangUpCallApi = (payload) => {
  return apiClient({
    baseURL: ApiRoutes.BASE_URL,
    method: "post",
    url: ApiRoutes.API_HANG_UP_CALL,
    data: payload,
  });
};

export const hitGetRegisteredNumberApi = () => {
  return apiClient({
    baseURL: ApiRoutes.BASE_URL,
    method: "GET",
    url: ApiRoutes.API_REGISTERED_NUMBER,
  });
};

export const hitSyncContactApi = (payload) => {
  return apiClient({
    baseURL: ApiRoutes.BASE_URL,
    method: "post",
    url: ApiRoutes.SYNC_CONTACTS,
    data: payload,
  });
};

export const hitSendSingleChatPush = (payload) => {
  return apiClient({
    baseURL: ApiRoutes.BASE_URL,
    method: "post",
    url: ApiRoutes.API_SINGLE_CHAT_PUSH,
    data: payload,
  });
};

export const hitSendGroupChatPush = (payload) => {
  return apiClient({
    baseURL: ApiRoutes.BASE_URL,
    method: "post",
    url: ApiRoutes.API_GROUP_CHAT_PUSH,
    data: payload,
  });
};
