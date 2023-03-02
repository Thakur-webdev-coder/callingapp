import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import colors from "../../../assets/colors";
import { ic_back } from "../../routes/imageRoutes";
import CustomImage from "../CustomImage";
import CustomText from "../CustomText";
import styles from "./styles";
import { useNavigation } from "@react-navigation/native";

const CommonHeader = ({ headerText, paddingHorizontal }) => {
  const navigation = useNavigation();
  return (
    <View style={[styles.toolBar, { paddingHorizontal: paddingHorizontal }]}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image style={styles.imgStyle} source={ic_back} />
      </TouchableOpacity>
      <CustomText
        fontWeight={"bold"}
        text={headerText}
        textColor={colors.white}
        textSize={20}
      />

      <View></View>
    </View>
  );
};
export default CommonHeader;
