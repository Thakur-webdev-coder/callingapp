import { Image, Platform, SafeAreaView, TextInput, View } from "react-native";
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
import { checkToken } from "../../utils/notificationHandler";
import { hitExistingUserLogin } from "../../constants/APi";
const ExistingUserLoginScreen = ({ navigation }) => {
  const [usernameInput, setUsernameInput] = useState("");

  // console.log("usernameInput", usernameInput);

  const hitLoginApi = async () => {
    const data = new FormData();
    data.append("username", usernameInput);
    data.append("device_token", await checkToken());
    data.append("phone_type", Platform.OS);

    console.log("dataaaa=======>", data);

    hitExistingUserLogin(data)
      .then((response) => {
        if (response.data.result == "success") {
          // otp = response.data.OTP;
          dispatch(saveLoginDetails(response.data.userinfo));
          setIsLoading(false);
          navigation?.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: "StackNavigator" }],
            })
          );
          //  navigation.navigate("StackNavigator");
        } else {
          // showErrorMessage(response.data.OTP);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  return (
    <SafeAreaView style={styles.mainView}>
      <View style={styles.wrapper}>
        <Image source={ic_app_logo} />
      </View>
      <View style={styles.wrapper2}>
        <CustomText
          text={"Existing User Login"}
          textColor={colors.white}
          textSize={26}
          alignText={"center"}
          fontWeight={"bold"}
          marginTop={hp(4)}
          marginLeft={wp(5)}
        />
        <TextInput
          placeholder="Enter Username"
          onChangeText={(text) => setUsernameInput(text)}
          style={styles.inputTxtBoxStyle}
          placeholderTextColor={colors.searchBarTxt}
        />

        <CustomButton
          primary
          title={"Login"}
          horzontalPadding={wp(18)}
          marginTop={hp(8)}
        />
      </View>
    </SafeAreaView>
  );
};

export default ExistingUserLoginScreen;
