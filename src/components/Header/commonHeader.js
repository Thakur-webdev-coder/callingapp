import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import colors from "../../../assets/colors";
import { ic_back } from "../../routes/imageRoutes";
import CustomText from "../CustomText";
import styles from "./styles";
import { useNavigation } from "@react-navigation/native";
import CustomImage from "../CustomImage";

const CommonHeader = ({ headerText, paddingHorizontal,onPress }) => {
  return (
    <View style={[styles.toolBar, { paddingHorizontal: paddingHorizontal }]}>
      <TouchableOpacity onPress={onPress} style={{ marginRight:12}}>
        <CustomImage
        imgSrc={ic_back}
        padding={10}
       
         />
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
