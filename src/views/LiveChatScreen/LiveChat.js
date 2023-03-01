import React, { useState } from "react";
import { SafeAreaView, View } from "react-native";
import WebView from "react-native-webview";
import AppStyle from "../../components/AppStyle";
import { CommonHeader } from "../../components";
import styles from "./styles";
import Loading from "react-native-whc-loading";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
const LiveChat = () => {
  const URL = `https://tawk.to/chat/63de1f18c2f1ac1e20315d9d/1godqiuj4`;
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadStart = () => {
    setIsLoading(true);
  };

  const handleLoadEnd = () => {
    setIsLoading(false);
  };

  return (
    <SafeAreaView style={AppStyle.wrapper}>
      <CommonHeader paddingHorizontal={wp(5)} headerText={"Live Chat"} />
      <WebView
        style={styles.mainViewStyle}
        javaScriptEnabled={true}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
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
export default LiveChat;
