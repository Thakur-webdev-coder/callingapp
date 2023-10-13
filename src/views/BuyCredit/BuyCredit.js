import React, { useState } from "react";
import { SafeAreaView, View } from "react-native";
import AppStyle from "../../components/AppStyle";
import { CommonHeader } from "../../components";
import WebView from "react-native-webview";
import { useSelector } from "react-redux";
import Loading from "react-native-whc-loading";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import buyCreditStyles from "./buyCredit.styles";

const BuyCredit = ({ navigation }) => {
  const { username, password, did } = useSelector(
    (store) => store.sliceReducer.loginDetails
  );
  const URL = `https://billing.nextgen.ng/billing/customer/mobile_payment.php?pr_login=${did}&pr_password=${password}&mobiledone=submit_log`;

  const [isLoading, setIsLoading] = useState(false);

  const handleLoadStart = () => {
    setIsLoading(true);
  };

  const handleLoadEnd = () => {
    setIsLoading(false);
  };
  return (
    <SafeAreaView style={AppStyle.wrapper}>
      <CommonHeader 
      paddingHorizontal={wp(5)}
       headerText={"Buy Credit"}
       onPress={() => navigation.goBack()}
        />

      <WebView
        style={buyCreditStyles.mainViewStyle}
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
export default BuyCredit;
