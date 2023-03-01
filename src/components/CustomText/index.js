import { Text, TouchableOpacity } from "react-native";
import React from "react";
import styles from "./styles";

const CustomText = ({
  text,
  marginTop,
  textAlign,
  horzontalPadding,
  paddingVertical,
  textSize,
  alignText,
  fontWeight,
  padding,
  textColor,
  width,
  marginLeft
}) => {
  return (
    <Text
      style={[
        styles.textStyle,
        {
          marginTop: marginTop,
          textAlign: textAlign,
          paddingHorizontal: horzontalPadding,
          fontSize: textSize,
          alignSelf: alignText,
          color:textColor,
          padding:padding,
          fontWeight: fontWeight,
          color: textColor,
          width: width,
          paddingVertical: paddingVertical,
          marginLeft:marginLeft,
        

        },
      ]}
      allowFontScaling={false}
    >
      {text}
    </Text>
  );
};

export default CustomText;
