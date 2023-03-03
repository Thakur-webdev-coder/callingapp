import { Image, SafeAreaView, TextInput, View } from "react-native";
import React from "react";
import styles from "./styles";
import { ic_app_logo } from "../../routes/imageRoutes";
import CustomText from "../../components/CustomText";
import colors from "../../../assets/colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { CustomButton } from "../../components";
const UpdateProfile = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.mainView}>
      <View style={styles.wrapper}>
        <Image source={ic_app_logo} />
      </View>
      <View style={styles.wrapper2}>
        {/* <View style={styles.imgContainer}> */}
        <Image
          style={styles.profileImg}
          source={{
            uri: "https://images.dpsmiles.net/bts-kpop-bt21-zpp3k.webp",
          }}
        />
        {/* </View> */}
        <CustomText
          text={"Display Account Name"}
          textColor={colors.white}
          textSize={26}
          fontWeight={"bold"}
          marginTop={hp(2)}
          marginLeft={wp(5)}
        />
        <TextInput
          placeholder="Enter Your Name Here "
          style={styles.inputTxtBoxStyle}
          placeholderTextColor={colors.searchBarTxt}
        />

        <CustomText
          text={"This name will visible to Kokoafone Contacts "}
          textColor={colors.white}
          textSize={22}
          marginTop={hp(5)}
          alignText={"center"}
        />

        <CustomButton
          onPress={() => navigation.navigate("DIDScreen")}
          primary
          title={"Save"}
          horzontalPadding={wp(18)}
          marginTop={hp(4)}
        />
      </View>
    </SafeAreaView>
  );
};

export default UpdateProfile;
