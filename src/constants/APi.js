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


export const hitgroupVideoCallNotify = (payload) => {
  return apiClient({
    baseURL: ApiRoutes.BASE_URL,
    method: "post",
    url: ApiRoutes.API_GROUP_VIDEOCALL_PUSH,
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
  console.log(
    ApiRoutes.API_SINGLE_CHAT_PUSH,
    "========145",
    ApiRoutes.BASE_URL
  );
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
export const hitHiddenPageApi = (payload) => {
  return apiClient({
    baseURL: ApiRoutes.BASE_URL,
    method: "GET",
    url: ApiRoutes.API_HIDDENPAGE,
    data: payload,
  });
};

export const hitExistingUserLogin = (payload) => {
  return apiClient({
    baseURL: ApiRoutes.BASE_URL,
    method: "post",
    url: ApiRoutes.API_EXIISING_USER_LOGIN,
    data: payload,
  });
};
export const hitVoiceNotificationApi = (payload) => {
  alert("7888===>");
  console.log(payload, "payloaddddddddd");
  return apiClient({
    baseURL: ApiRoutes.BASE_URL,
    method: "post",
    url: ApiRoutes.API_VOICE_NOTIFICATION,
    data: payload,
  });
};
export default function postFormData(url, formData, options = {}) {
  console.log("pppppp188");
  // Define the default options for the fetch request
  const defaultOptions = {
    method: "POST",
    body: formData,
    headers: {
      // Include any headers you need, e.g., for handling form data
    },
  };
  // Merge the default options with user-provided options
  const requestOptions = { ...defaultOptions, ...options };
  // Make the POST request
  return fetch(url, requestOptions)
    .then((response) => {
      console.log(response, "response201");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json(); // Parse the response body as JSON
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
      throw error; // Rethrow the error for the caller to handle
    });
}
