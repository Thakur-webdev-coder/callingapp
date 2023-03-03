import { SafeAreaView, View } from "react-native";
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
let otpEncryptedCode = null;

const OtpScreen = ({ navigation, route }) => {
  // const [state,setState]=useState({})

  const [counter, setCounter] = useState(90);
  const [otpText, setOtpText] = useState("");

  const { phoneInput } = route.params;
  const { countryCode } = route.params;
  const dispatch = useDispatch();

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

      if (myResponse.data.result == "success") {
        otpEncryptedCode = myResponse.data.value;
        hitVerifyOtpApi();
      }
    } else {
      alert("please Enter otp");
    }
  };

  const hitVerifyOtpApi = async () => {
    const data = new FormData();
    data.append("phone_user", phoneInput);
    data.append("otp", otpEncryptedCode);
    data.append("ccode", countryCode);

    console.log("dataaaa", data);

    const myResponse = await hitOtpVerificationAPI(data);

    if (myResponse.data.result == "success") {
      dispatch(saveLoginDetails(myResponse.data.userinfo));
      navigation.navigate("UpdateProfile");
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
      <View>
        <CustomText
          text={"Enter OTP Here"}
          textColor={colors.white}
          textSize={32}
          fontWeight={"bold"}
          alignText={"center"}
          marginTop={hp(8)}
        />
      </View>
      <View style={styles.wrapper2}>
        <CustomText
          text={
            "Please enter the One Time PIN which you received on your phone +2349852145236 or Resend the One Time PIN"
          }
          textColor={colors.lightBlack}
          textSize={17}
          alignText={"center"}
          marginTop={hp(10)}
          horzontalPadding={wp(8)}
        />

        <CustomText
          text={"Your OTP code expire in 90 Seconds"}
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
          onPress={() => hitOtpEncryptionAPI()}
        />

        <CustomButton
          title={"Resend"}
          secondary
          horzontalPadding={wp(15)}
          marginTop={hp(2)}
          // disabled={counter != 0}
          // disabled
          onPress={() => hitOtpSendApi()}
        />
      </View>
    </SafeAreaView>
  );
};

export default OtpScreen;
