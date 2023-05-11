import {
  Alert,
  Modal,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  View,
  ScrollView
} from "react-native";
import React, { useEffect, useState } from "react";
import CustomText from "../../components/CustomText";
import colors from "../../../assets/colors";
import CustomButton from "../../components/CustomButton";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import OTPTextView from "react-native-otp-textinput";
import {
  hitEncryptionApi,
  hitOtpVerificationAPI,
  hitSendOtpApi,
} from "../../constants/APi";
import { showErrorMessage } from "../../utils/commonUtils";

import { useDispatch } from "react-redux";
import { saveLoginDetails } from "../../redux/reducer";
import styles from "./styles";
import Loading from "react-native-whc-loading";
import { checkToken } from "../../utils/notificationHandler";
import messaging from '@react-native-firebase/messaging';
let otpEncryptedCode = null;

const OtpScreen = ({ navigation, route }) => {
  const [counter, setCounter] = useState(90);
  const [otpText, setOtpText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { phoneEncryptedCode, countryCode, phoneInput, otp } = route.params;
  // console.log('dadada==>',route.params)
  const dispatch = useDispatch();
  // console.log('phoneEncryptedCode-----',phoneEncryptedCode,'countryEncryptedCode',countryCode,'phoneInput',phoneInput)

  useEffect(() => {
    Alert.alert("OTP", `${otp}`, [
      { text: "OK", onPress: () => console.log("OK Pressed") },
    ]);
  }, []);
  useEffect(() => {
    const interval =
      counter > 0 &&
      setInterval(() => {
        setCounter(counter - 1);
      }, 1000);
    return () => clearInterval(interval);
  }, [counter]);

  const hitOtpEncryptionAPI = async () => {
    setIsLoading(true);

    if (otpText.length == 4) {
      const data = new FormData();
      data.append("source", otpText);
      hitEncryptionApi(data)
        .then((response) => {
          if (response.data.result == "success") {
            otpEncryptedCode = response.data.value;
            console.log();
            hitVerifyOtpApi();
          }
        })
        .catch((err) => {
          setIsLoading(false);
        });
    } else {
      alert("please Enter otp");
      setIsLoading(false);
    }
  };

  const hitVerifyOtpApi = async () => {
    const data = new FormData();
    data.append("phone_user", phoneEncryptedCode);
    data.append("otp", otpEncryptedCode);
    data.append("ccode", countryCode);
    data.append("device_token", await checkToken());
    data.append("phone_type", Platform.OS);

    console.log("dataaaa=======>", data);

    // async function requestUserPermission() {
    //   const authStatus = await messaging().requestPermission();
    //   const enabled =
    //     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    //     authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    
    //   if (enabled) {
    //     console.log('Authorization status:', authStatus);
    //     checkToken();
    //   }
    // }
    

    hitOtpVerificationAPI(data)
      .then((response) => {
        if (response.data.result == "success") {
          // otp = response.data.OTP;
          dispatch(saveLoginDetails(response.data.userinfo));
          navigation.navigate("StackNavigator");
          setIsLoading(false);
        } else {
          showErrorMessage(response.data.OTP);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  const hitOtpSendApi = async () => {
    const data = new FormData();
    data.append("phone", phoneInput);
    data.append("ccode", countryCode);

    const myResponse = await hitSendOtpApi(data);

    if (myResponse.data.result == "success") {
      otp = myResponse.data.OTP;

      setCounter(90);
      const interval =
        counter > 0 &&
        setInterval(() => {
          setCounter(counter - 1);
        }, 1000);
      return () => clearInterval(interval);
    } else {
      // setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      {/* <View style={{flex: 0.2}}> */}

      <CustomText
        text={"Enter OTP Here"}
        textColor={colors.white}
        textSize={32}
        fontWeight={"bold"}
        alignText={"center"}
        marginTop={hp(8)}
      />

      {/* </View> */}

      <ScrollView style={styles.wrapper2}>
        <CustomText
          text={`Please enter the One Time PIN which you received on your phone ${phoneInput} or Resend the One Time PIN`}
          textColor={colors.lightBlack}
          textSize={17}
          alignText={"center"}
          marginTop={hp(10)}
          horzontalPadding={wp(8)}
        />

        <CustomText
          text={`Your OTP code expire in ${counter} Seconds`}
          textColor={colors.lightBlack}
          textSize={17}
          alignText={"center"}
          marginTop={hp(10)}
        />

        <OTPTextView
          textInputStyle={styles.inputStyle}
          containerStyle={{
            marginHorizontal: wp(15),
          }}
          tintColor={colors.otpInputColor}
          offTintColor={colors.otpInputColor}
          inputCount={4}
          handleTextChange={(text) => setOtpText(text)}
        />

        <CustomButton
          title={"Verify"}
          primary
          horzontalPadding={wp(15)}
          marginTop={hp(8)}
          onPress={
            () => hitOtpEncryptionAPI()
            // navigation.navigate("StackNavigator")
          }
        />

        <CustomButton
          title={"Resend"}
          primary
          horzontalPadding={wp(15)}
          marginTop={hp(2)}
          //disabled={counter != 0}
          onPress={() => null}
        />
      </ScrollView>
      <Loading loading={isLoading} />
    </SafeAreaView>
  );
};

export default OtpScreen;
