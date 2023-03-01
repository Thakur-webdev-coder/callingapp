import { apiClient } from "../helpers/ApiInterceptor";
import ApiRoutes from "./apiRoutes";

export const hitEncryptionApi = (payload) => {
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
export const hitCallRatesApi = () => {
  return apiClient({
    baseURL: ApiRoutes.BASE_URL,
    method: "GET",
    url: ApiRoutes.API_RATES,
  });
};
