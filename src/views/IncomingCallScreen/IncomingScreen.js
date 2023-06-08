import {
  View,
  Text,
  Image,
  TouchableOpacity,
  AppState,
  BackHandler,
  Alert,
  Platform,
  Linking,
} from "react-native";
import React, { useEffect } from "react";
import { ic_avatar, ic_callrecive, ic_endcall } from "../../routes/imageRoutes";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import colors from "../../../assets/colors";
import InCallManager from "react-native-incall-manager";
import LinearGradient from "react-native-linear-gradient";
import { hithangUpCallApi } from "../../constants/APi";
import { hangupMeeting } from "../../lib-jitsi-meet/actions";
import { PERMISSIONS, requestMultiple } from "react-native-permissions";

const IncomingScreen = ({ navigation, route }) => {
  const notificationData = route.params.callData;
  const cameraPermissions = Platform.OS == 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;
  const micPermissions = Platform.OS == 'ios' ? PERMISSIONS.IOS.MICROPHONE : PERMISSIONS.ANDROID.RECORD_AUDIO;
   console.log('notificationData------>>>',notificationData);
  useEffect(() => {
    checkPeermission()
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === "inactive") {
        rejectCall();
      }
    };

    AppState.addEventListener("change", handleAppStateChange);

    const backAction = () => {
      console.log("Back button is pressed");
      rejectCall();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => {
      AppState.removeEventListener("change", handleAppStateChange);
      backHandler.remove();
    };
  }, []);



  const checkPeermission = () => {
    console.log('checkPeermission------->>>');
    requestMultiple([cameraPermissions, micPermissions]).then((result) => {
      console.log(result[cameraPermissions], result[micPermissions], 'result--------->>>', result);

      if (result[cameraPermissions] !== 'granted' || result[micPermissions] !== 'granted') {
        Alert.alert('Insufficient permissions!', 'You need to grant camera and Microphone access permissions to use this app.', [
          { text: 'Okay', onPress: () => openAppSettings() }
        ]);
        rejectCall();
        return false;
        
      } 
    })
      .catch((error) => {
        console.log('errr----', error);
      });
  };

  const openAppSettings = () => {
    if (Platform.OS === 'android') {
      Linking.openSettings();
    } else {
      Linking.openURL('app-settings:')
    }
  };

  const acceptCall = () => {
    InCallManager.stopRingtone();
    navigation.navigate("CallScreen", {
      voiceCall: notificationData?.Type == "A" ? true : false,
      fromNotification: true,
      callData: notificationData?.sender_phone,
      meetimgUrl: notificationData?.Meeting_url,
    });
  };

  const rejectCall = () => {
    InCallManager.stopRingtone();
    hitHanupCall();
     navigation.goBack();
  };

  const hitHanupCall = async () => {
    const data = new FormData();
    data.append("receiver_number", notificationData?.sender_phone);

    console.log("data -->", data);
    hithangUpCallApi(data).then((response) => {
      Store.dispatch(hangupMeeting());
    });
  };
  return (
    <View>
      <Text
        style={{
          color: colors.black,
          alignSelf: "center",
          marginTop: hp(12),
          fontSize: 18,
          fontWeight: "bold",
        }}
      >
        {notificationData?.Subject}
      </Text>
      <Image
        source={ic_avatar}
        style={{ alignSelf: "center", marginTop: hp(3) }}
      />
      <Text
        style={{
          color: colors.black,
          alignSelf: "center",
          marginTop: hp(3),
          fontSize: 18,
          fontWeight: "bold",
        }}
      >
        {notificationData?.sender_phone}
      </Text>

      <Text
        style={{
          color: colors.black,
          alignSelf: "center",
          marginTop: hp(1),
        }}
      >
        is Calling..
      </Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginTop: hp(20),
          paddingBottom:hp(5)
        }}
      >
        <TouchableOpacity onPress={() => acceptCall()}>
          <LinearGradient
            colors={[colors.greenTop, colors.greenMid, colors.greenMid]}
            style={{
              height: 80,
              width: 80,
              borderRadius: 40,
              backgroundColor: "green",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image source={ic_callrecive} />
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => rejectCall()}>
          <Image source={ic_endcall} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default IncomingScreen;
