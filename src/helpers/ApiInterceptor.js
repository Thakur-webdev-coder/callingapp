import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Store } from "../redux";
import { changeLoadingStatus } from "../redux/reducer";
import { Show_Toast } from "../utils/toast";

export const apiClient = axios.create({
  headers: {
    "Content-Type": "multipart/form-data",
  },
});
apiClient.interceptors.request.use(
  (config) => {
    Store.dispatch(changeLoadingStatus(true));

    const accessToken = AsyncStorage.getItem("token");
    if (accessToken) {
      config.headers["x-auth-token"] = accessToken;
    }
    return config;
  },
  (error) => {
    console.log("erooorrr---->", error);
    Promise.reject(error);
  }
);
apiClient.interceptors.response.use(
  (response) => {
    Store.dispatch(changeLoadingStatus(false));
    if (
      response.data.result == "success" ||
      !response.data.hasOwnProperty("result")
    ) {
      console.log("response success------->", response.data);
      return response;
    } else {
      console.log("response failure------->", response.data);

      return response;
    }
  },
  async (error) => {
    Store.dispatch(changeLoadingStatus(false));

    Show_Toast("Something went wrong Please Try Again!");
    return Promise.reject(error);
  }
);
