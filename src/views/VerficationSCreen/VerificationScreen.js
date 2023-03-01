import { SafeAreaView, View } from "react-native";
import React, { useEffect, useState } from "react";
import AppStyle from "../../components/AppStyle";
import CustomText from "../../components/CustomText";
import ReactNativePhoneInput from "react-native-phone-input";
import styles from "./styles";
import CustomButton from "../../components/CustomButton";
import { BOARDING_SCREEN, OTP_SCREEN } from "../../routes/routeNames";
import colors from "../../../assets/colors";
import { hitEncryptionApi, hitSendOtpApi } from "../../constants/APi";
import { isValidPhoneNumber, parsePhoneNumber } from "libphonenumber-js";
import * as RNLocalize from "react-native-localize";

let phoneEncryptedCode = null;
let countryEncryptedCode = null;

const VerificationScreen = ({ navigation }) => {
  const [phoneInput, setPhoneInput] = useState("");
  const [countryCode, setcountryCode] = useState("");

  console.log("phpne", phoneInput);

  

  const hitCountryEncryptionApi = async () => {
    if (isValidPhoneNumber(phoneInput)) {
      const data = new FormData();
      data.append("source", countryCode);
      const myResponse = await hitEncryptionApi(data);

      if (myResponse.data.result == "success") {
        countryEncryptedCode = myResponse.data.value;
        hitPhoneEncryptionAPi();
      }
    } else {
      alert("Please Enter a Valid Phone Number");
    }
  };

  const hitPhoneEncryptionAPi = async () => {
    const data = new FormData();
    data.append("source", parsePhoneNumber(phoneInput)?.nationalNumber);

    const myResponse = await hitEncryptionApi(data);

    if (myResponse.data.result == "success") {
      phoneEncryptedCode = myResponse?.data?.value;
      if (countryEncryptedCode || phoneEncryptedCode) hitOtpSendApi();
    }
  };

  const hitOtpSendApi = async () => {
    const data = new FormData();
    data.append("phone", phoneEncryptedCode);
    data.append("ccode", countryEncryptedCode);

    const myResponse = await hitSendOtpApi(data);

    if (myResponse.data.result == "success") {
      navigation.navigate(OTP_SCREEN, {
        phoneInput: phoneEncryptedCode,
        countryCode: countryEncryptedCode,
      });
    } else {
    }
  };

  return (
    <SafeAreaView style={AppStyle.wrapper}>
      <View style={AppStyle.secondWrapper}>
        <CustomText
          text={"VERIFY YOUR NUMBER"}
          textSize={20}
          marginTop={140}
          fontWeight={"bold"}
          textColor={colors.white}
          alignText={"center"}
        />
        <CustomText
          text={"Kindly provide your phone number to verify your account."}
          textAlign={"center"}
          horzontalPadding={30}
          marginTop={10}
          textColor={colors.white}
          alignText={"center"}
        />

        <ReactNativePhoneInput
          ref={(ref) => {
            this.phone = ref;
            setcountryCode(ref?.getCountryCode());
            console.log("reff", countryCode);
          }}
          onChangePhoneNumber={(text) => setPhoneInput(text)}
          style={styles?.phoneViewStyle}
          flagStyle={styles?.flagStyle}
          initialCountry={RNLocalize.getCountry().toLocaleLowerCase()}
          textStyle={styles?.inputTextStyle}
        />

        <CustomButton
          title={"Next"}
          primary
          horzontalPadding={40}
          marginTop={80}
          onPress={() => hitCountryEncryptionApi()}
        />

        <CustomText
          text={"Click “Next” to get OTP"}
          marginTop={5}
          textColor={colors.white}
          alignText={"center"}
        />
      </View>
    </SafeAreaView>
  );
};

export default VerificationScreen;
