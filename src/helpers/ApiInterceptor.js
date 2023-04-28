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
    const accessToken = AsyncStorage.getItem("token");
    if (accessToken) {
      config.headers["x-auth-token"] = accessToken;
    }
    // console.log("request api", config);

    return config;
  },
  (error) => {
    console.log("erooorrr---->", error);
    Promise.reject(error);
  }
);
apiClient.interceptors.response.use(
  (response) => {
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
    console.log("error------>", error);
    Show_Toast("Something went wrong Please Try Again!");
    return Promise.reject(error);
  }
);
