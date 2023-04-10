import React, { useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import WebView from "react-native-webview";
import { CommonHeader } from "../components";
import AppStyle from "../components/AppStyle";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Loading from "react-native-whc-loading";
import colors from "../../assets/colors";

const WebViewScreen = ({ navigation, route }) => {
  const { url, title } = route.params;
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadStart = () => {
    setIsLoading(true);
  };

  const handleLoadEnd = () => {
    setIsLoading(false);
  };

  return (
    <SafeAreaView style={AppStyle.wrapper}>
      <View style={AppStyle.secondWrapper}>
        <CommonHeader headerText={title} onPress={() => navigation.goBack()} />
        <WebView
          style={styles.mainViewStyle}
          javaScriptEnabled={true}
          onLoadStart={handleLoadStart}
          onLoadEnd={handleLoadEnd}
          source={{
            uri: url,
          }}
        />
        <Loading
          style={{
            flex: 1,
            justifyContent: "center",
          }}
          loading={isLoading}
        />
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  mainViewStyle: {
    marginTop: hp(3),
    marginBottom: hp(0.5),
    backgroundColor: colors.white,
    color: "black",
  },
});
export default WebViewScreen;
