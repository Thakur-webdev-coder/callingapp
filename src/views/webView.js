import { SafeAreaView } from "react-native";
import WebView from "react-native-webview";
import { CommonHeader } from "../components";

const WebViewScreen = ({ navigation, route }) => {
  const url = route.params.url;

  const title = route.params.title;
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CommonHeader headerText={title} />

      <WebView
        // startInLoadingState={true}
        source={{
          uri: url,
        }}
      />
    </SafeAreaView>
  );
};
export default WebViewScreen;
