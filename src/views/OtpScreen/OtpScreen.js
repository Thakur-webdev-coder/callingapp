import {
  Alert,
  Modal,
  SafeAreaView,
  TouchableOpacity,
  View,
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
import { ScrollView } from "react-native-gesture-handler";
let otpEncryptedCode = null;

const OtpScreen = ({ navigation, route }) => {
  const [counter, setCounter] = useState(90);
  const [otpText, setOtpText] = useState("");

  const { phoneEncryptedCode, countryCode, phoneInput } = route.params;
  // console.log('dadada==>',route.params)
  const dispatch = useDispatch();
  // console.log('phoneEncryptedCode-----',phoneEncryptedCode,'countryEncryptedCode',countryCode,'phoneInput',phoneInput)

  useEffect(() => {
    Alert.alert(
      "OTP",
      `Your OTP is sent to your Mobile Number  ${phoneInput}`,
      [{ text: "OK", onPress: () => console.log("OK Pressed") }]
    );
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
    if (otpText.length == 4) {
      const data = new FormData();
      data.append("source", otpText);
      const myResponse = await hitEncryptionApi(data);
      console.log("1atapi=======>", myResponse.data.value);
      if (myResponse.data.result == "success") {
        otpEncryptedCode = myResponse.data.value;
        console.log();
        hitVerifyOtpApi();
      }
    } else {
      alert("please Enter otp");
    }
  };

  const hitVerifyOtpApi = async () => {
    const data = new FormData();
    data.append("phone_user", phoneEncryptedCode);
    data.append("otp", otpEncryptedCode);
    data.append("ccode", countryCode);

    console.log("dataaaa=======>", data);

    const myResponse = await hitOtpVerificationAPI(data);
    console.log("2ntapi=======>", myResponse.data.result);

    if (myResponse.data.result == "success") {
      dispatch(saveLoginDetails(myResponse.data.userinfo));
      navigation.navigate("StackNavigator");
    } else {
      showErrorMessage(myResponse.data.OTP);
    }
  };

  const hitOtpSendApi = async () => {
    const data = new FormData();
    data.append("phone", phoneInput);
    data.append("ccode", countryCode);

    const myResponse = await hitSendOtpApi(data);

    if (myResponse.data.result == "success") {
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
          onPress={() =>
            // hitOtpEncryptionAPI()
            navigation.navigate("StackNavigator")
          }
        />

        <CustomButton
          title={"Resend"}
          primary
          horzontalPadding={wp(15)}
          marginTop={hp(2)}
           //disabled={counter != 0}
          onPress={() =>
            navigation.navigate("StackNavigator")
            // hitOtpSendApi()
            }
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default OtpScreen;
