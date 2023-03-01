import React, { useState } from "react";
import { SafeAreaView, View } from "react-native";
import AppStyle from "../../components/AppStyle";
import WebView from "react-native-webview";
import styles from "./styles";
import { CommonHeader } from "../../components";
import Loading from "react-native-whc-loading";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
const Directory = () => {
  const URL = `https://directory.hifroggy.com/`;
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadStart = () => {
    setIsLoading(true);
  };

  const handleLoadEnd = () => {
    setIsLoading(false);
  };

  return (
    <SafeAreaView style={AppStyle.wrapper}>
      <CommonHeader paddingHorizontal={wp(5)} headerText={"Directory"} />
      <WebView
        style={styles.mainViewStyle}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        javaScriptEnabled={true}
        source={{ uri: URL }}
      />
      <Loading
        style={{
          flex: 1,
          justifyContent: "center",
        }}
        loading={isLoading}
      />
    </SafeAreaView>
  );
};
export default Directory;
