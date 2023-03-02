import { SafeAreaView, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import AppStyle from "../../components/AppStyle";
import CustomImage from "../../components/CustomImage";
import CustomText from "../../components/CustomText";
import colors from "../../../assets/colors";
import CustomButton from "../../components/CustomButton";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import OTPTextView from "react-native-otp-textinput";
import { ic_logo_medium } from "../../routes/imageRoutes";
import {
  hitEncryptionApi,
  hitOtpVerificationAPI,
  hitSendOtpApi,
} from "../../constants/APi";
import { showErrorMessage } from "../../utils/commonUtils";

import { useDispatch } from "react-redux";
import { saveLoginDetails } from "../../redux/reducer";
let otpEncryptedCode = null;

const OtpScreen = ({ navigation, route }) => {
  // const [state,setState]=useState({})

  const [counter, setCounter] = useState(90);
  const [otpText, setOtpText] = useState("");

  // const { phoneInput } = route.params;
  // const { countryCode } = route.params;
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
    <SafeAreaView style={AppStyle.wrapper}>
      <View style={AppStyle.secondWrapper}>
        <CustomImage
          alignSelf={"center"}
          marginTop={60}
          imgSrc={ic_logo_medium}
        />

        <CustomText
          text={"Enter OTP"}
          marginTop={40}
          textSize={20}
          textColor={colors.white}
          horzontalPadding={20}
          fontWeight={"bold"}
        />

        <CustomText
          text={" A 4 digit code has been sent to your mobile number."}
          textColor={colors.textGray}
          horzontalPadding={15}
          textAlign={"left"}
          textSize={14}
        />

        <OTPTextView
          textInputStyle={{
            color: colors.white,
            backgroundColor: colors.otpInputColor,
            borderRadius: 10,
            marginTop: 20,
            borderBottomWidth: 0,
          }}
          containerStyle={{
            marginHorizontal: 40,
          }}
          tintColor={colors.otpInputColor}
          offTintColor={colors.otpInputColor}
          inputCount={4}
          handleTextChange={(text) => setOtpText(text)}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            alignSelf: "center",
            marginTop: hp(5),
          }}
        >
          <CustomText
            text={"Request code again:"}
            textColor={colors.textGray}
            horzontalPadding={5}
          />

          <CustomText
            text={`${counter} Secs`}
            textColor={colors.white}
            fontWeight={"bold"}
          />
        </View>

        <CustomButton
          title={"Verify"}
          primary
          horzontalPadding={wp(22)}
          marginTop={20}
          onPress={() => navigation.navigate("UpdateProfile")}
        />

        <CustomButton
          title={"Resend"}
          primary
          horzontalPadding={wp(22)}
          marginTop={10}
          disabled={counter != 0}
          onPress={() => hitOtpSendApi()}
        />
      </View>
    </SafeAreaView>
  );
};

export default OtpScreen;
