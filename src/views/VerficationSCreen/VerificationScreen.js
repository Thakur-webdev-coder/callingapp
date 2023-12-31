import {
  Image,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  View,
} from "react-native";
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
import CustomImage from "../../components/CustomImage";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { ic_app_logo } from "../../routes/imageRoutes";
import Loading from "react-native-whc-loading";
import LinearGradient from "react-native-linear-gradient";

let phoneEncryptedCode = null;
let countryEncryptedCode = null;

const VerificationScreen = ({ navigation }) => {
  const [phoneInput, setPhoneInput] = useState("");
  const [countryCode, setcountryCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  console.log("phpne", phoneInput);

  const hitCountryEncryptionApi = async () => {
    setIsLoading(true);

    if (isValidPhoneNumber(phoneInput)) {
      const data = new FormData();
      data.append("source", countryCode);
      hitEncryptionApi(data)
        .then((response) => {
          if (response.data.result == "success") {
            countryEncryptedCode = response.data.value;
            hitPhoneEncryptionAPi();
          }
        })
        .catch((err) => {
          setIsLoading(false);
        });
    } else {
      alert("Please Enter a Valid Phone Number");
      setIsLoading(false);
    }
  };

  const hitPhoneEncryptionAPi = async () => {
    const data = new FormData();
    data.append("source", parsePhoneNumber(phoneInput)?.nationalNumber);

    hitEncryptionApi(data)
      .then((response) => {
        if (response.data.result == "success") {
          phoneEncryptedCode = response?.data?.value;
          if (countryEncryptedCode || phoneEncryptedCode) hitOtpSendApi();
        }
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  const hitOtpSendApi = async () => {
    const data = new FormData();
    data.append("phone", phoneEncryptedCode);
    data.append("ccode", countryEncryptedCode);

    hitSendOtpApi(data)
      .then((response) => {
        if (response.data.result == "success") {
          // console.log('phoneEncryptedCode-----',phoneEncryptedCode,'countryEncryptedCode',countryEncryptedCode,'phoneInput',phoneInput)
          navigation.navigate("DIDScreen", {
            phoneEncryptedCode: phoneEncryptedCode,
            countryCode: countryEncryptedCode,
            phoneInput: phoneInput,
            otp: response.data.OTP,
          });
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      {/* <ScrollView style={styles.scrollWrapper}> */}
      <View style={{ flex: 1 }}>
        <Image
          style={{ alignSelf: "center", marginVertical: wp(20) }}
          // alignSelf={"center"}
          // marginTop={wp(20)}
          source={ic_app_logo}
        />
      </View>
      <LinearGradient
      colors={['#FD2A46', '#F8B502']}
      start={{ x: 0, y: 0.2 }}
      end={{ x: 0, y: 1 }}
      style={styles.gradient}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.wrapper2}
      >
        <ScrollView>
          <CustomText
            text={"Enter Phone Number to Login or Signup"}
            textColor={colors.white}
            textSize={20}
            fontWeight={"bold"}
            alignText={"center"}
            marginTop={hp(8)}
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
            title={"Continue"}
            // primary
            icon
            horzontalPadding={wp(15)}
            marginTop={hp(8)}
            onPress={() => hitCountryEncryptionApi()}
            // onPress={() => navigation.navigate(OTP_SCREEN)}
          />
        </ScrollView>
      </KeyboardAvoidingView>
      </LinearGradient>
      <Loading loading={isLoading} />
      {/* </ScrollView> */}
    </SafeAreaView>
  );
};

export default VerificationScreen;
