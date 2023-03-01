import { SafeAreaView } from "react-native";
import WebView from "react-native-webview";

const WebViewScreen = () => {
  const { loginDetails } = useSelector((store) => store);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <WebView
        // startInLoadingState={true}
        source={{
          uri: "https://billing.hifroggy.com/billing/customer/mobile_payment.php?pr_login=919459840876&pr_password=45351&mobiledone=submit_log",
        }}
      />
    </SafeAreaView>
  );
};
export default WebViewScreen;
