import { Image, SafeAreaView, TextInput, View } from "react-native";
import React, { useState } from "react";
import styles from "./styles";
import { ic_app_logo } from "../../routes/imageRoutes";
import CustomText from "../../components/CustomText";
import colors from "../../../assets/colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { CustomButton } from "../../components";
import { hitApiAssignDid } from "../../constants/APi";
import { Show_Toast } from "../../utils/toast";
import { OTP_SCREEN } from "../../routes/routeNames";
import Loading from "react-native-whc-loading";
const DIDScreen = ({ navigation, route }) => {
  const { phoneEncryptedCode, countryCode, phoneInput, otp } = route.params;
  const [isLoading, setIsLoading] = useState(false);

  const hitAssignDidApi = async () => {
    setIsLoading(true);

    hitApiAssignDid(phoneInput)
      .then((response) => {
        setIsLoading(false);

        navigation.navigate(OTP_SCREEN, {
          phoneEncryptedCode: phoneEncryptedCode,
          countryCode: countryCode,
          phoneInput: phoneInput,
          otp: otp,
        });
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };
  return (
    <SafeAreaView style={styles.mainView}>
      <View style={styles.wrapper}>
        <Image style={styles.logoStyle} source={ic_app_logo} />
        <CustomText
          text={"NG Voice DID"}
          textColor={colors.black}
          textSize={29}
          fontWeight={"bold"}
          marginTop={hp(8)}
          marginLeft={wp(3)}
          alignText={"center"}
        />

        <CustomButton
          onPress={() => hitAssignDidApi()}
          // primary
          title={"Auto Assign DID"}
          horzontalPadding={wp(12)}
          marginTop={hp(7)}
        />
      </View>
      <Loading loading={isLoading} />
    </SafeAreaView>
  );
};

export default DIDScreen;
